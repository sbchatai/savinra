/**
 * razorpay-webhook — Savinra Edge Function
 *
 * Receives Razorpay payment events, verifies HMAC SHA256 signature,
 * then updates orders.payment_status and triggers fulfilment flow.
 *
 * Required secrets (set via `supabase secrets set`):
 *   RAZORPAY_WEBHOOK_SECRET  — from Razorpay dashboard > Webhooks
 *   SUPABASE_SERVICE_ROLE_KEY — auto-injected by Supabase runtime
 *   SUPABASE_URL              — auto-injected by Supabase runtime
 *
 * Razorpay events handled:
 *   payment.captured   → mark order paid + confirmed
 *   payment.failed     → mark payment failed
 *   refund.processed   → mark order refunded
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts'

// ── Types ─────────────────────────────────────────────────────
interface RazorpayWebhookPayload {
  entity:  string
  event:   string
  payload: {
    payment?: {
      entity: {
        id:          string
        order_id:    string
        amount:      number
        status:      string
        method:      string
        error_code?:       string
        error_description?: string
      }
    }
    refund?: {
      entity: {
        id:       string
        payment_id: string
        amount:   number
      }
    }
  }
}

// ── Handler ───────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured')
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── 1. Verify HMAC SHA256 signature ───────────────────────
  const signature = req.headers.get('x-razorpay-signature')
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing signature' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const rawBody = await req.text()

  const expectedSig = hmac('sha256', webhookSecret, rawBody, 'utf8', 'hex')
  if (expectedSig !== signature) {
    console.warn('Razorpay webhook signature mismatch')
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── 2. Parse payload ───────────────────────────────────────
  let payload: RazorpayWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── 3. Supabase admin client (service role — bypasses RLS) ─
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  )

  const event = payload.event
  console.log(`Razorpay event: ${event}`)

  // ── 4. Handle events ───────────────────────────────────────
  try {
    if (event === 'payment.captured') {
      const payment = payload.payload.payment?.entity
      if (!payment) throw new Error('No payment entity in payload')

      // Log payment attempt
      await supabase.from('payment_attempts').insert({
        order_id:           await resolveOrderId(supabase, payment.order_id),
        gateway:            'razorpay',
        razorpay_order_id:  payment.order_id,
        razorpay_payment_id: payment.id,
        amount:             payment.amount,
        status:             'success',
        gateway_response:   payload as unknown as Record<string, unknown>,
      })

      // Update order
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status:      'paid',
          status:              'confirmed',
          razorpay_payment_id: payment.id,
          confirmed_at:        new Date().toISOString(),
        })
        .eq('razorpay_order_id', payment.order_id)

      if (error) throw error
      console.log(`Order ${payment.order_id} marked paid + confirmed`)

    } else if (event === 'payment.failed') {
      const payment = payload.payload.payment?.entity
      if (!payment) throw new Error('No payment entity in payload')

      await supabase.from('payment_attempts').insert({
        order_id:           await resolveOrderId(supabase, payment.order_id),
        gateway:            'razorpay',
        razorpay_order_id:  payment.order_id,
        razorpay_payment_id: payment.id,
        amount:             payment.amount,
        status:             'failed',
        failure_reason:     payment.error_description ?? null,
        gateway_response:   payload as unknown as Record<string, unknown>,
      })

      await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('razorpay_order_id', payment.order_id)

      console.log(`Order ${payment.order_id} payment failed`)

    } else if (event === 'refund.processed') {
      const refund = payload.payload.refund?.entity
      if (!refund) throw new Error('No refund entity in payload')

      await supabase
        .from('orders')
        .update({ payment_status: 'refunded', status: 'refunded' })
        .eq('razorpay_payment_id', refund.payment_id)

      console.log(`Refund processed for payment ${refund.payment_id}`)

    } else {
      // Acknowledge but don't process unknown events
      console.log(`Unhandled Razorpay event: ${event}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Webhook handler error:', err)
    return new Response(JSON.stringify({ error: 'Handler failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

// ── Helper: look up internal order UUID from Razorpay order ID ──
async function resolveOrderId(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  razorpayOrderId: string
): Promise<string> {
  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .eq('razorpay_order_id', razorpayOrderId)
    .single()

  if (error || !data) throw new Error(`Order not found for razorpay_order_id: ${razorpayOrderId}`)
  return data.id
}
