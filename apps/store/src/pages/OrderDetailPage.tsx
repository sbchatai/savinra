import { useParams, Link } from 'react-router-dom'
import { ORDERS } from '@/data/placeholder'
import { formatPrice } from '@/lib/utils'
import AccountSidebar from '@/components/account/AccountSidebar'
import { CheckCircle, Circle, Truck, Package, MapPin } from 'lucide-react'

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
    default: return 1
  }
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const order = ORDERS.find(o => o.id === id)

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl text-cocoa mb-4">Order not found</h1>
        <Link to="/orders" className="text-gold-accessible font-body font-medium hover:underline">
          View all orders
        </Link>
      </div>
    )
  }

  const currentStep = getStepIndex(order.status)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-semibold text-cocoa">{order.id}</h1>
              <p className="font-body text-sm text-cocoa/50">Placed on {order.date}</p>
            </div>
            <Link to="/orders" className="font-body text-sm text-gold-accessible hover:underline">
              Back to Orders
            </Link>
          </div>

          {/* Tracking stepper - horizontal desktop */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-8">
            <h2 className="font-heading text-xl font-semibold text-cocoa mb-6">Order Tracking</h2>

            {/* Desktop horizontal */}
            <div className="hidden md:flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-cocoa/10" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-gold-accessible transition-all"
                style={{ width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
              />
              {TRACKING_STEPS.map((step, i) => {
                const StepIcon = i <= currentStep ? step.icon : Circle
                return (
                  <div key={step.label} className="relative flex flex-col items-center z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i <= currentStep ? 'bg-gold-accessible text-white' : 'bg-parchment border-2 border-cocoa/20 text-cocoa/30'
                    }`}>
                      <StepIcon size={18} />
                    </div>
                    <span className={`mt-2 font-body text-xs text-center ${
                      i <= currentStep ? 'text-cocoa font-medium' : 'text-cocoa/40'
                    }`}>{step.label}</span>
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      i <= currentStep ? 'bg-gold-accessible text-white' : 'bg-parchment border-2 border-cocoa/20 text-cocoa/30'
                    }`}>
                      <StepIcon size={14} />
                    </div>
                    <span className={`font-body text-sm ${
                      i <= currentStep ? 'text-cocoa font-medium' : 'text-cocoa/40'
                    }`}>{step.label}</span>
                  </div>
                )
              })}
            </div>

            {order.awb && (
              <p className="mt-4 font-body text-xs text-cocoa/50">
                AWB: {order.awb} &middot; {order.carrier}
              </p>
            )}
          </div>

          {/* Order items */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-8">
            <h2 className="font-heading text-xl font-semibold text-cocoa mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-card" />
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-cocoa">{item.name}</p>
                    <p className="font-body text-xs text-sage">Size: {item.size} &middot; Qty: {item.qty}</p>
                  </div>
                  <p className="font-heading text-lg font-medium text-cocoa">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-cocoa/10 pt-4 mt-4 flex justify-between">
              <span className="font-heading text-lg font-semibold text-cocoa">Total</span>
              <span className="font-heading text-lg font-semibold text-cocoa">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Address */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-8">
            <h2 className="font-heading text-xl font-semibold text-cocoa mb-2">Delivery Address</h2>
            <p className="font-body text-sm text-cocoa/70">{order.address}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {order.status === 'delivered' && (
              <Link
                to="/returns"
                className="border-2 border-gold-accessible text-gold-accessible font-body font-medium text-sm px-6 py-2.5 rounded-pill hover:bg-gold-accessible hover:text-white transition-colors"
              >
                Request Return
              </Link>
            )}
            {order.status === 'processing' && (
              <button className="border-2 border-error text-error font-body font-medium text-sm px-6 py-2.5 rounded-pill hover:bg-error hover:text-white transition-colors">
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
