import { Link } from 'react-router-dom'
import { CheckCircle, MessageCircle } from 'lucide-react'
import { PRODUCTS } from '@/data/placeholder'
import ProductCard from '@/components/product/ProductCard'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function OrderConfirmationPage() {
  const { total, items, clearCart } = useCart()
  const shipping = total >= 999 ? 0 : 99
  const recommended = PRODUCTS.slice(0, 3)

  return (
    <div className="min-h-screen bg-parchment">
      {/* Simplified header */}
      <header className="bg-parchment border-b border-gold/30 py-4">
        <div className="max-w-5xl mx-auto px-4">
          <Link to="/" className="flex items-center gap-2 justify-center">
            <span className="text-gold text-lg">&loz;</span>
            <span className="savinra-shine font-heading text-2xl font-bold tracking-wide">SAVINRA</span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        {/* Success icon */}
        <div className="mb-6">
          <CheckCircle size={72} className="mx-auto text-success" strokeWidth={1.5} />
        </div>
        <h1 className="font-heading text-4xl font-semibold text-cocoa mb-3">Order Confirmed!</h1>
        <p className="font-body text-cocoa/60 mb-2">Thank you for shopping with SAVINRA</p>
        <p className="font-body text-lg text-cocoa font-medium mb-8">
          Order #ORD-2026-{String(Math.floor(Math.random() * 9000 + 1000))}
        </p>

        {/* Order details card */}
        <div className="bg-ivory rounded-card p-6 shadow-card text-left mb-8">
          <h2 className="font-heading text-xl font-semibold text-cocoa mb-4">Order Details</h2>
          {items.length > 0 ? (
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3">
                  <img src={item.product.images[0]} alt="" className="w-14 h-18 object-cover rounded-card" />
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-cocoa">{item.product.name}</p>
                    <p className="font-body text-xs text-sage">Size: {item.size} &middot; Qty: {item.qty}</p>
                  </div>
                  <p className="font-body text-sm text-cocoa">{formatPrice(item.product.price * item.qty)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-cocoa/60 mb-4">Your order has been placed successfully.</p>
          )}
          <div className="border-t border-cocoa/10 pt-4 space-y-2">
            <div className="flex justify-between font-body text-sm text-cocoa">
              <span>Shipping</span>
              <span className="text-success">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-heading text-lg font-semibold text-cocoa">
              <span>Total</span>
              <span>{formatPrice(total + shipping)}</span>
            </div>
          </div>
          <div className="border-t border-cocoa/10 pt-4 mt-4">
            <p className="font-body text-sm text-cocoa/60">
              <strong className="text-cocoa">Delivery Address:</strong> 12, Green Park Extension, New Delhi &mdash; 110016
            </p>
            <p className="font-body text-sm text-cocoa/60 mt-1">
              <strong className="text-cocoa">Payment:</strong> UPI
            </p>
          </div>
        </div>

        {/* WhatsApp tracking */}
        <div className="bg-success/10 rounded-card p-4 flex items-center gap-3 mb-12">
          <MessageCircle size={24} className="text-success shrink-0" />
          <p className="font-body text-sm text-cocoa text-left">
            Track your order on WhatsApp. We'll send you real-time updates on shipping and delivery.
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-16">
          <Link
            to="/orders"
            className="border-2 border-gold-accessible text-gold-accessible font-body font-medium text-sm px-8 py-3 rounded-pill hover:bg-gold-accessible hover:text-white transition-colors"
          >
            View Orders
          </Link>
          <Link
            to="/shop"
            onClick={() => clearCart()}
            className="bg-gold-accessible text-white font-body font-medium text-sm px-8 py-3 rounded-pill hover:bg-cocoa transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Recommended */}
        <section>
          <h2 className="font-heading text-3xl font-semibold text-cocoa mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {recommended.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
