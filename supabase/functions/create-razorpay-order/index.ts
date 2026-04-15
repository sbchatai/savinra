/**
 * create-razorpay-order — Savinra Edge Function
 *
 * Creates a Razorpay order + pending order record in DB.
 * COD orders bypass Razorpay and are confirmed immediately.
 *
 * Required secrets:
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-injected)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

// ── Schema ────────────────────────────────────────────────────
const ItemSchema = z.object({
  product_id:    z.string().uuid(),
  variant_id:    z.string().uuid().nullable().optional(),
  qty:           z.number().int().positive(),
  unit_price:    z.number().int().nonnegative(),   // paise
  product_name:  z.string(),
  variant_size:  z.string().nullable().optional(),
  variant_color: z.string().nullable().optional(),
  image_url:     z.string().nullable().optional(),
  customizations: z.record(z.string()).optional(),
})

const AddressSchema = z.object({
  full_name: z.string().min(2),
  phone:     z.string().min(10),
  line1:     z.string().min(3),
  line2:     z.string().nullable().optional(),
  city:      z.string().min(2),
  state:     z.string().min(2),
  pincode:   z.string().length(6),
  country:   z.string().default('India'),
})

const RequestSchema = z.object({
  customer_id:     z.string().uuid(),
  items:           z.array(ItemSchema).min(1),
  shipping_address: AddressSchema,
  payment_method:  z.enum(['upi', 'card', 'netbanking', 'cod', 'wallet']),
  coupon_code:     z.string().optional(),
})

// ── Helper: JSON response ─────────────────────────────────────
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// ── Main handler ──────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  )

  // Parse + validate
  let body: z.infer<typeof RequestSchema>
  try {
    body = RequestSchema.parse(await req.json())
  } catch (e) {
    return json({ error: 'Invalid request', details: e }, 400)
  }

  const { customer_id, items, shipping_address, payment_method, coupon_code } = body

  // ── Calculate totals ───────────────────────────────────────
  const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.qty, 0)
  const FREE_SHIPPING_ABOVE = 99900  // ₹999
  const FLAT_SHIPPING = 9900         // ₹99

  // Fetch live settings from DB
  const { data: settings } = await supabase
    .from('store_settings')
    .select('free_shipping_above, flat_shipping_rate, cod_enabled, cod_max_order_value')
    .single()

  const freeShippingAbove = settings?.free_shipping_above ?? FREE_SHIPPING_ABOVE
  const flatShipping = settings?.flat_shipping_rate ?? FLAT_SHIPPING
  const shipping = subtotal >= freeShippingAbove ? 0 : flatShipping

  // COD validation
  if (payment_method === 'cod') {
    if (!settings?.cod_enabled) return json({ error: 'Cash on Delivery is not available' }, 400)
    const codMax = settings?.cod_max_order_value ?? 500000
    if (subtotal > codMax) {
      return json({ error: `COD is only available for orders up to ₹${codMax / 100}` }, 400)
    }
  }

  // ── Validate coupon ────────────────────────────────────────
  let couponId: string | null = null
  let discount = 0

  if (coupon_code) {
    const { data: coupon, error: couponErr } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', coupon_code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (couponErr || !coupon) {
      return json({ error: 'Invalid or expired coupon code' }, 400)
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return json({ error: 'This coupon has expired' }, 400)
    }
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return json({ error: 'This coupon has reached its usage limit' }, 400)
    }
    if (subtotal < coupon.min_order_value) {
      return json({ error: `Minimum order value for this coupon is ₹${coupon.min_order_value / 100}` }, 400)
    }
    // Check per-customer restriction
    if (coupon.customer_id && coupon.customer_id !== customer_id) {
      return json({ error: 'This coupon is not valid for your account' }, 400)
    }

    if (coupon.type === 'percentage') {
      discount = Math.floor((subtotal * coupon.value) / 100)
      if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount)
    } else {
      discount = Math.min(coupon.value, subtotal)
    }
    couponId = coupon.id
  }

  const total = subtotal + shipping - discount

  // ── Create Razorpay order (skip for COD) ──────────────────
  let razorpayOrderId: string | null = null

  if (payment_method !== 'cod') {
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!keyId || !keySecret) {
      return json({ error: 'Payment gateway not configured' }, 500)
    }

    const credentials = btoa(`${keyId}:${keySecret}`)
    const receipt = `savinra_${Date.now()}`

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: total, currency: 'INR', receipt }),
    })

    if (!rzpRes.ok) {
      const err = await rzpRes.json()
      console.error('Razorpay error:', err)
      return json({ error: 'Payment gateway error. Please try again.' }, 502)
    }

    const rzpData = await rzpRes.json()
    razorpayOrderId = rzpData.id
  }

  // ── Insert order ──────────────────────────────────────────
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id,
      order_number: '',          // trigger fills this
      status:          payment_method === 'cod' ? 'confirmed' : 'pending',
      payment_method,
      payment_status:  payment_method === 'cod' ? 'pending' : 'pending',
      subtotal,
      shipping,
      discount,
      total,
      coupon_id:       couponId,
      coupon_code:     coupon_code ?? null,
      is_cod:          payment_method === 'cod',
      razorpay_order_id: razorpayOrderId,
      // Shipping address snapshot
      shipping_name:    shipping_address.full_name,
      shipping_phone:   shipping_address.phone,
      shipping_line1:   shipping_address.line1,
      shipping_line2:   shipping_address.line2 ?? null,
      shipping_city:    shipping_address.city,
      shipping_state:   shipping_address.state,
      shipping_pincode: shipping_address.pincode,
      shipping_country: shipping_address.country,
      confirmed_at:    payment_method === 'cod' ? new Date().toISOString() : null,
    })
    .select('id, order_number')
    .single()

  if (orderErr || !order) {
    console.error('Order insert error:', orderErr)
    return json({ error: 'Failed to create order. Please try again.' }, 500)
  }

  // ── Insert order items ─────────────────────────────────────
  const orderItems = items.map(item => ({
    order_id:     order.id,
    product_id:   item.product_id,
    variant_id:   item.variant_id ?? null,
    product_name: item.product_name,
    variant_size: item.variant_size ?? null,
    variant_color: item.variant_color ?? null,
    unit_price:   item.unit_price,
    qty:          item.qty,
    total:        item.unit_price * item.qty,
    image_url:    item.image_url ?? null,
  }))

  const { data: insertedItems, error: itemsErr } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select('id')

  if (itemsErr) {
    console.error('Order items error:', itemsErr)
    return json({ error: 'Failed to save order items.' }, 500)
  }

  // Insert customizations per item
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.customizations && Object.keys(item.customizations).length > 0) {
      const customRows = Object.entries(item.customizations).map(([label, value]) => ({
        order_item_id: insertedItems![i].id,
        label,
        value,
      }))
      await supabase.from('order_item_customizations').insert(customRows)
    }
  }

  // ── Record coupon use ──────────────────────────────────────
  if (couponId) {
    await supabase.from('coupon_uses').insert({
      coupon_id:   couponId,
      customer_id,
      order_id:    order.id,
      discount,
    })
  }

  // ── Return ─────────────────────────────────────────────────
  return json({
    order_id:          order.id,
    order_number:      order.order_number,
    razorpay_order_id: razorpayOrderId,
    razorpay_key_id:   Deno.env.get('RAZORPAY_KEY_ID') ?? null,
    amount:            total,
    currency:          'INR',
    is_cod:            payment_method === 'cod',
  })
})
