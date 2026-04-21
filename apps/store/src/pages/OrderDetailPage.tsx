import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { formatPrice } from '@/lib/utils'
import AccountSidebar from '@/components/account/AccountSidebar'
import { CheckCircle, Circle, Truck, Package, MapPin } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrderRow {
  id: string
  order_number: string
  created_at: string
  status: string
  total: number
  subtotal: number
  shipping: number
  discount: number
  payment_method: string | null
  is_cod: boolean
  shipping_name: string | null
  shipping_line1: string | null
  shipping_line2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_pincode: string | null
  shipping_phone: string | null
  confirmed_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  customer_note: string | null
  customer_id: string
}

interface OrderItemRow {
  id: string
  product_name: string
  variant_size: string | null
  variant_color: string | null
  qty: number
  unit_price: number
  total: number
  image_url: string | null
}

// ---------------------------------------------------------------------------
// Tracking config
// ---------------------------------------------------------------------------

const TRACKING_STEPS = [
  { label: 'Confirmed', icon: CheckCircle },
  { label: 'Processing', icon: Package },
  { label: 'Shipped', icon: Truck },
  { label: 'Out for Delivery', icon: MapPin },
  { label: 'Delivered', icon: CheckCircle },
]

function getStepIndex(status: string): number {
  switch (status) {
    case 'confirmed': return 0
    case 'processing': return 1
    case 'shipped': return 2
    case 'out_for_delivery': return 3
    case 'delivered': return 4
    default: return -1
  }
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <div className="flex-1 animate-pulse" aria-label="Loading order details" aria-busy="true">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-cocoa/10 rounded" />
          <div className="h-4 w-32 bg-cocoa/10 rounded" />
        </div>
      </div>
      <div className="bg-ivory rounded-card p-6 shadow-card mb-8">
        <div className="h-6 w-36 bg-cocoa/10 rounded mb-6" />
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-cocoa/10" />
              <div className="h-3 w-14 bg-cocoa/10 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-ivory rounded-card p-6 shadow-card mb-8 space-y-4">
        <div className="h-6 w-20 bg-cocoa/10 rounded mb-4" />
        {[1, 2].map((n) => (
          <div key={n} className="flex items-center gap-4">
            <div className="w-16 h-20 bg-cocoa/10 rounded-card shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-cocoa/10 rounded" />
              <div className="h-3 w-24 bg-cocoa/10 rounded" />
            </div>
            <div className="h-6 w-16 bg-cocoa/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [order, setOrder] = useState<OrderRow | null>(null)
  const [items, setItems] = useState<OrderItemRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const fetchOrder = useCallback(async () => {
    if (!id || !user) return

    setIsLoading(true)
    setFetchError(null)

    const [orderResult, itemsResult] = await Promise.all([
      supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single(),
      supabase
        .from('order_items')
        .select('id, product_name, variant_size, variant_color, qty, unit_price, total, image_url')
        .eq('order_id', id),
    ])

    if (orderResult.error || !orderResult.data) {
      setFetchError('Order not found.')
      setIsLoading(false)
      return
    }

    const fetched = orderResult.data as OrderRow

    // Security: ensure this order belongs to the current user
    if (fetched.customer_id !== user.id) {
      navigate('/orders', { replace: true })
      return
    }

    setOrder(fetched)
    setItems((itemsResult.data ?? []) as OrderItemRow[])
    setIsLoading(false)
  }, [id, user, navigate])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  async function handleCancelOrder() {
    if (!order) return
    setIsCancelling(true)
    setCancelError(null)

    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', order.id)

    if (error) {
      setCancelError('Could not cancel the order. Please try again.')
      setIsCancelling(false)
      return
    }

    navigate('/orders')
  }

  function formatOrderDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // ---------------------------------------------------------------------------
  // Render: loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-12">
          <AccountSidebar />
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render: error / not found
  // ---------------------------------------------------------------------------

  if (fetchError || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl text-cocoa mb-4">
          {fetchError ?? 'Order not found'}
        </h1>
        <Link to="/orders" className="text-gold-accessible font-body font-medium hover:underline">
          View all orders
        </Link>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render: order detail
  // ---------------------------------------------------------------------------

  const currentStep = getStepIndex(order.status)
  const canCancel = order.status === 'confirmed' || order.status === 'processing'

  const addressParts = [
    order.shipping_name,
    order.shipping_line1,
    order.shipping_line2,
    order.shipping_city,
    order.shipping_state,
    order.shipping_pincode,
    order.shipping_phone ? `Ph: ${order.shipping_phone}` : null,
  ].filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-semibold text-cocoa">{order.order_number}</h1>
              <p className="font-body text-sm text-cocoa/50">Placed on {formatOrderDate(order.created_at)}</p>
            </div>
            <Link to="/orders" className="font-body text-sm text-gold-accessible hover:underline">
              Back to Orders
            </Link>
          </div>

          {/* Tracking stepper */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-8">
            <h2 className="font-heading text-xl font-semibold text-cocoa mb-6">Order Tracking</h2>

            {/* Desktop horizontal */}
            <div className="hidden md:flex items-center justify-between relative">
              {/* Background line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-cocoa/10" />
              {/* Progress line */}
              <div
                className="absolute top-5 left-0 h-0.5 bg-gold-accessible transition-all"
                style={{
                  width: currentStep >= 0
                    ? `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%`
                    : '0%',
                }}
              />
              {TRACKING_STEPS.map((step, i) => {
                const StepIcon = i <= currentStep ? step.icon : Circle
                return (
                  <div key={step.label} className="relative flex flex-col items-center z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        i <= currentStep
                          ? 'bg-gold-accessible text-white'
                          : 'bg-parchment border-2 border-cocoa/20 text-cocoa/30'
                      }`}
                    >
                      <StepIcon size={18} />
                    </div>
                    <span
                      className={`mt-2 font-body text-xs text-center ${
                        i <= currentStep ? 'text-cocoa font-medium' : 'text-cocoa/40'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Mobile vertical */}
            <div className="md:hidden space-y-4">
              {TRACKING_STEPS.map((step, i) => {
                const StepIcon = i <= currentStep ? step.icon : Circle
                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        i <= currentStep
                          ? 'bg-gold-accessible text-white'
                          : 'bg-parchment border-2 border-cocoa/20 text-cocoa/30'
                      }`}
                    >
                      <StepIcon size={14} />
                    </div>
                    <span
                      className={`font-body text-sm ${
                        i <= currentStep ? 'text-cocoa font-medium' : 'text-cocoa/40'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>

          </div>

          {/* Order items */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-8">
            <h2 className="font-heading text-xl font-semibold text-cocoa mb-4">Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image_url ?? '/savinra-logo.svg'}
                    alt={item.product_name}
                    width={64}
                    height={80}
                    className="w-16 h-20 object-cover rounded-card shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-cocoa">{item.product_name}</p>
                    <p className="font-body text-xs text-sage">
                      {item.variant_size && <>Size: {item.variant_size} &middot; </>}
                      Qty: {item.qty}
                    </p>
                  </div>
                  <p className="font-heading text-lg font-medium text-cocoa">
                    {formatPrice(item.unit_price / 100)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-cocoa/10 pt-4 mt-4 flex justify-between">
              <span className="font-heading text-lg font-semibold text-cocoa">Total</span>
              <span className="font-heading text-lg font-semibold text-cocoa">
                {formatPrice(order.total / 100)}
              </span>
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-8">
            <h2 className="font-heading text-xl font-semibold text-cocoa mb-2">Delivery Address</h2>
            <p className="font-body text-sm text-cocoa/70 whitespace-pre-line">
              {addressParts.join(', ')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {cancelError && (
              <p className="font-body text-sm text-error">{cancelError}</p>
            )}
            <div className="flex gap-4">
              {order.status === 'delivered' && (
                <Link
                  to="/returns"
                  className="border-2 border-gold-accessible text-gold-accessible font-body font-medium text-sm px-6 py-2.5 rounded-pill hover:bg-gold-accessible hover:text-white transition-colors"
                >
                  Request Return
                </Link>
              )}
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="border-2 border-error text-error font-body font-medium text-sm px-6 py-2.5 rounded-pill hover:bg-error hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCancelling ? 'Cancelling…' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
