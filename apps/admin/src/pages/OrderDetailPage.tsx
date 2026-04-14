import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Database } from '@savinra/shared'

type Order = Database['public']['Tables']['orders']['Row']

interface OrderItem {
  id: string
  product_name: string
  variant_color: string | null
  variant_size: string | null
  qty: number
  unit_price: number
  total: number
  image_url: string | null
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

const STATUS_FLOW = ['pending', 'confirmed', 'shipped', 'delivered']

function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    loadOrder(id)
  }, [id])

  async function loadOrder(orderId: string) {
    setIsLoading(true)
    try {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderErr || !orderData) {
        navigate('/orders', { replace: true })
        return
      }

      setOrder(orderData)
      setNewStatus(orderData.status)

      // Fetch order items
      const { data: itemData } = await supabase
        .from('order_items')
        .select('id, qty, unit_price, total, product_name, variant_color, variant_size, image_url')
        .eq('order_id', orderId)

      setItems(itemData ?? [])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdateStatus() {
    if (!order || newStatus === order.status) return
    setIsUpdating(true)
    setError(null)

    const timestamps: Record<string, string | null> = {}
    if (newStatus === 'confirmed') timestamps.confirmed_at = new Date().toISOString()
    if (newStatus === 'shipped') timestamps.shipped_at = new Date().toISOString()
    if (newStatus === 'delivered') timestamps.delivered_at = new Date().toISOString()
    if (newStatus === 'cancelled') timestamps.cancelled_at = new Date().toISOString()

    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status: newStatus, ...timestamps })
      .eq('id', order.id)

    if (updateErr) {
      setError('Failed to update status. Please try again.')
    } else {
      setOrder((prev) => prev ? { ...prev, status: newStatus, ...timestamps } : prev)
    }

    setIsUpdating(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-cocoa/40 font-body">
        Loading order...
      </div>
    )
  }

  if (!order) return null

  const statusTimeline = [
    { label: 'Placed', time: order.created_at, reached: true },
    { label: 'Confirmed', time: order.confirmed_at, reached: !!order.confirmed_at },
    { label: 'Shipped', time: order.shipped_at, reached: !!order.shipped_at },
    { label: 'Delivered', time: order.delivered_at, reached: !!order.delivered_at },
  ]

  return (
    <section aria-labelledby="order-detail-heading" className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 id="order-detail-heading" className="font-heading text-xl font-medium text-cocoa">
          Order #{order.order_number}
        </h2>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
            STATUS_BADGE[order.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Order info + shipping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-parchment rounded-card shadow-card border border-admin-border p-5">
          <h3 className="font-heading text-base font-medium text-cocoa mb-3">Order Info</h3>
          <dl className="space-y-2 text-sm font-body">
            <div className="flex justify-between">
              <dt className="text-cocoa/50">Order ID</dt>
              <dd className="font-mono text-xs text-cocoa">{order.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cocoa/50">Placed</dt>
              <dd className="text-cocoa">{formatDateTime(order.created_at)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cocoa/50">Payment</dt>
              <dd className="capitalize text-cocoa">{order.payment_method}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cocoa/50">Payment status</dt>
              <dd className="capitalize text-cocoa">{order.payment_status}</dd>
            </div>
            {order.coupon_code && (
              <div className="flex justify-between">
                <dt className="text-cocoa/50">Coupon</dt>
                <dd className="font-mono text-cocoa">{order.coupon_code}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-parchment rounded-card shadow-card border border-admin-border p-5">
          <h3 className="font-heading text-base font-medium text-cocoa mb-3">Shipping Address</h3>
          <address className="text-sm font-body not-italic text-cocoa/70 space-y-0.5">
            <p className="font-medium text-cocoa">{order.shipping_name}</p>
            <p>{order.shipping_line1}</p>
            {order.shipping_line2 && <p>{order.shipping_line2}</p>}
            <p>{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}</p>
            <p>{order.shipping_country}</p>
            <p className="mt-1">{order.shipping_phone}</p>
          </address>
        </div>
      </div>

      {/* Status timeline */}
      <div className="bg-parchment rounded-card shadow-card border border-admin-border p-5">
        <h3 className="font-heading text-base font-medium text-cocoa mb-4">Status Timeline</h3>
        <ol className="flex items-center gap-0" aria-label="Order status timeline">
          {statusTimeline.map((step, i) => (
            <li key={step.label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step.reached
                      ? 'bg-success border-success'
                      : 'bg-parchment border-admin-border'
                  }`}
                  aria-hidden="true"
                >
                  {step.reached && (
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <p className={`text-xs mt-1.5 font-body font-medium ${step.reached ? 'text-cocoa' : 'text-cocoa/30'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-cocoa/30 font-body mt-0.5 text-center max-w-[80px]">
                  {formatDateTime(step.time)}
                </p>
              </div>
              {i < statusTimeline.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 mb-6 ${
                    statusTimeline[i + 1].reached ? 'bg-success' : 'bg-admin-border'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Update status */}
      <div className="bg-parchment rounded-card shadow-card border border-admin-border p-5">
        <h3 className="font-heading text-base font-medium text-cocoa mb-3">Update Status</h3>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-admin-border rounded text-cocoa bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 font-body"
            aria-label="Select new order status"
          >
            {[...STATUS_FLOW, 'cancelled'].map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
          <button
            onClick={handleUpdateStatus}
            disabled={isUpdating || newStatus === order.status}
            className="px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm text-error font-body">{error}</p>
        )}
      </div>

      {/* Order items */}
      <div className="bg-parchment rounded-card shadow-card border border-admin-border">
        <div className="px-6 py-4 border-b border-admin-border">
          <h3 className="font-heading text-base font-medium text-cocoa">Items</h3>
        </div>
        <table className="w-full text-sm" aria-label="Order items">
          <thead>
            <tr className="border-b border-admin-border">
              <th className="text-left px-6 py-3 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Product</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Variant</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Qty</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Unit Price</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-cocoa/40 font-body">
                  No items found.
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr
                  key={item.id}
                  className={`border-b border-admin-border/50 ${i % 2 === 1 ? 'bg-parchment/60' : ''}`}
                >
                  <td className="px-6 py-3.5 font-body text-cocoa">{item.product_name}</td>
                  <td className="px-6 py-3.5 text-cocoa/60 font-body">
                    {[item.variant_size, item.variant_color].filter(Boolean).join(' / ') || '—'}
                  </td>
                  <td className="px-6 py-3.5 text-center text-cocoa font-body">{item.qty}</td>
                  <td className="px-6 py-3.5 text-right text-cocoa font-body">{formatINR(item.unit_price)}</td>
                  <td className="px-6 py-3.5 text-right font-semibold text-cocoa font-body">{formatINR(item.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-admin-border">
          <dl className="space-y-1.5 text-sm font-body max-w-xs ml-auto">
            <div className="flex justify-between text-cocoa/60">
              <dt>Subtotal</dt>
              <dd>{formatINR(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-cocoa/60">
              <dt>Shipping</dt>
              <dd>{order.shipping === 0 ? 'Free' : formatINR(order.shipping)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd>−{formatINR(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between font-semibold text-cocoa border-t border-admin-border pt-2">
              <dt>Total</dt>
              <dd>{formatINR(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Notes */}
      {(order.customer_note || order.admin_note) && (
        <div className="bg-parchment rounded-card shadow-card border border-admin-border p-5">
          <h3 className="font-heading text-base font-medium text-cocoa mb-3">Notes</h3>
          {order.customer_note && (
            <div className="mb-2">
              <p className="text-xs font-medium text-cocoa/50 uppercase tracking-wide font-body mb-1">Customer note</p>
              <p className="text-sm text-cocoa/70 font-body">{order.customer_note}</p>
            </div>
          )}
          {order.admin_note && (
            <div>
              <p className="text-xs font-medium text-cocoa/50 uppercase tracking-wide font-body mb-1">Admin note</p>
              <p className="text-sm text-cocoa/70 font-body">{order.admin_note}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
