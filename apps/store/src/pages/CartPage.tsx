import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQty, total, itemCount } = useCart()
  const shipping = total >= 999 ? 0 : 99
  const grandTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-cocoa/20 mb-6" />
        <h1 className="font-heading text-3xl font-semibold text-cocoa mb-3">Your bag is empty</h1>
        <p className="font-body text-cocoa/60 mb-8">Looks like you haven't added anything yet.</p>
        <Link
          to="/shop"
          className="inline-flex items-center bg-gold-accessible text-white font-body font-medium text-sm px-8 py-3 rounded-pill hover:bg-cocoa transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold text-cocoa mb-8">
        Your Bag <span className="text-cocoa/40 text-xl">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.map(item => (
            <div key={`${item.product.id}-${item.size}`} className="flex gap-4 bg-ivory rounded-card p-4 shadow-card">
              <Link to={`/products/${item.product.slug}`} className="shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-32 object-cover rounded-card"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/products/${item.product.slug}`}>
                    <h3 className="font-heading text-lg font-semibold text-cocoa hover:text-gold-accessible transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="font-body text-xs text-sage mb-1">Size: {item.size}</p>
                  <p className="font-heading text-lg font-medium text-cocoa">{formatPrice(item.product.price)}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center border border-cocoa/20 rounded-pill">
                    <button
                      onClick={() => updateQty(item.product.id, item.size, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center text-cocoa hover:text-gold-accessible"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-body text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.size, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center text-cocoa hover:text-gold-accessible"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size)}
                    className="text-cocoa/40 hover:text-error transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-ivory rounded-card p-6 shadow-card sticky top-24">
            <h2 className="font-heading text-xl font-semibold text-cocoa mb-6">Order Summary</h2>
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between font-body text-sm text-cocoa">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-cocoa">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-success' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="font-body text-xs text-sage">Free shipping on orders above {formatPrice(999)}</p>
              )}
              <div className="border-t border-cocoa/10 pt-3 flex justify-between font-heading text-xl font-semibold text-cocoa">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-gold-accessible text-white font-body font-medium text-sm py-3.5 rounded-pill text-center hover:bg-cocoa transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="block w-full text-center mt-3 text-gold-accessible font-body text-sm font-medium hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
