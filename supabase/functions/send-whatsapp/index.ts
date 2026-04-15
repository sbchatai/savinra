/**
 * send-whatsapp — Savinra Edge Function
 *
 * Sends WhatsApp template messages via WATI API and logs every attempt.
 *
 * Required secrets:
 *   WATI_API_KEY, WATI_ACCOUNT_ID
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-injected)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const RequestSchema = z.object({
  customer_id:   z.string().uuid().optional(),
  phone:         z.string().min(10),   // with country code, e.g. 919876543210
  template_name: z.enum(['order_confirm', 'shipped', 'delivered', 'abandoned_cart', 'promo', 'otp']),
  variables:     z.record(z.string()).default({}),
  order_id:      z.string().uuid().optional(),
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// Template name → WATI broadcast name mapping
const TEMPLATE_MAP: Record<string, string> = {
  order_confirm:  'savinra_order_confirmed',
  shipped:        'savinra_order_shipped',
  delivered:      'savinra_order_delivered',
  abandoned_cart: 'savinra_abandoned_cart',
  promo:          'savinra_promotion',
  otp:            'savinra_otp',
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  )

  let body: z.infer<typeof RequestSchema>
  try {
    body = RequestSchema.parse(await req.json())
  } catch (e) {
    return json({ error: 'Invalid request', details: e }, 400)
  }

  const { customer_id, phone, template_name, variables, order_id } = body

  const watiKey       = Deno.env.get('WATI_API_KEY')
  const watiAccountId = Deno.env.get('WATI_ACCOUNT_ID')

  if (!watiKey || !watiAccountId) {
    // Log queued, return error
    await supabase.from('whatsapp_logs').insert({
      customer_id: customer_id ?? null,
      phone,
      message_type:  template_name,
      template_name: TEMPLATE_MAP[template_name],
      payload:       variables,
      status:        'failed',
      error_message: 'WATI credentials not configured',
      order_id:      order_id ?? null,
    })
    return json({ error: 'WhatsApp gateway not configured' }, 500)
  }

  // Build WATI parameters array from variables object
  const parameters = Object.entries(variables).map(([name, value]) => ({ name, value }))

  // Insert log row first (queued)
  const { data: logRow } = await supabase
    .from('whatsapp_logs')
    .insert({
      customer_id: customer_id ?? null,
      phone,
      message_type:  template_name,
      template_name: TEMPLATE_MAP[template_name],
      payload:       variables,
      status:        'queued',
      order_id:      order_id ?? null,
    })
    .select('id')
    .single()

  // Send via WATI
  let status: string
  let gatewayMsgId: string | null = null
  let errorMessage: string | null = null

  try {
    const watiRes = await fetch(
      `https://live-mt-server.wati.io/${watiAccountId}/api/v1/sendTemplateMessage?whatsappNumber=${phone}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${watiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_name:  TEMPLATE_MAP[template_name],
          broadcast_name: TEMPLATE_MAP[template_name],
          parameters,
        }),
      }
    )

    const watiData = await watiRes.json()

    if (watiRes.ok && watiData.result) {
      status = 'sent'
      gatewayMsgId = watiData.messageId ?? null
    } else {
      status = 'failed'
      errorMessage = watiData.info ?? JSON.stringify(watiData)
    }
  } catch (err) {
    status = 'failed'
    errorMessage = String(err)
  }

  // Update log row
  if (logRow?.id) {
    await supabase
      .from('whatsapp_logs')
      .update({
        status,
        gateway_msg_id: gatewayMsgId,
        error_message:  errorMessage,
        sent_at:        status === 'sent' ? new Date().toISOString() : null,
      })
      .eq('id', logRow.id)
  }

  return json({ success: status === 'sent', status, gateway_msg_id: gatewayMsgId })
})
