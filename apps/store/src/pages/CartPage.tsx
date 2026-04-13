import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, Tag, Gift, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { PRODUCTS } from '@/data/placeholder'
import ProductCard from '@/components/product/ProductCard'
import { formatPrice, cn } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQty, total, itemCount } = useCart()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [giftWrap, setGiftWrap] = useState(false)

  const shipping = total >= 999 ? 0 : 99
  const discount = couponApplied ? Math.round(total * 0.1) : 0
  const giftWrapFee = giftWrap ? 99 : 0
  const grandTotal = total - discount + shipping + giftWrapFee

  const suggestedProducts = PRODUCTS.filter(p => !items.find(i => i.product.id === p.id)).slice(0, 3)

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto px-4 py-24 text-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-24 h-24 mx-auto bg-ivory rounded-full flex items-center justify-center mb-8"
        >
          <ShoppingBag size={40} className="text-gold-accessible" />
        </motion.div>
        <h1 className="font-heading text-3xl font-semibold text-cocoa mb-3">Your bag is empty</h1>
        <p className="font-body text-cocoa/60 mb-8 leading-relaxed">Looks like you haven't added any pieces yet.<br />Explore our collections to find something beautiful.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-gold-accessible text-white font-body font-medium text-sm px-8 py-3.5 rounded-pill hover:bg-cocoa transition-all hover:scale-105">
          Explore Collection <ArrowRight size={16} />
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-3xl font-semibold text-cocoa mb-8"
      >
        Your Bag <span className="text-cocoa/35 text-xl font-body">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.map((item, idx) => (
              <motion.div
                key={`${item.product.id}-${item.size}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex gap-4 bg-ivory rounded-card p-4 shadow-card"
              >
                <Link to={`/products/${item.product.slug}`} className="shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={80}
                    height={107}
                    className="w-20 h-28 object-cover rounded-card"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${item.product.slug}`}>
                      <h3 className="font-heading text-lg font-semibold text-cocoa hover:text-gold-accessible transition-colors leading-tight">{item.product.name}</h3>
                    </Link>
                    <p className="font-body text-xs text-sage mt-1">Size: <span className="font-medium text-cocoa">{item.size}</span></p>
                    {item.product.customizable && (
                      <p className="font-body text-xs text-gold-accessible mt-0.5">Customisable</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center border border-cocoa/20 rounded-pill overflow-hidden">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateQty(item.product.id, item.size, item.qty - 1)}
                        className="w-9 h-9 flex items-center justify-center text-cocoa hover:text-gold-accessible hover:bg-ivory transition-colors"
                      >
                        <Minus size={14} />
                      </motion.button>
                      <span className="w-8 text-center font-body text-sm font-medium text-cocoa">{item.qty}</span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateQty(item.product.id, item.size, item.qty + 1)}
                        className="w-9 h-9 flex items-center justify-center text-cocoa hover:text-gold-accessible hover:bg-ivory transition-colors"
                      >
                        <Plus size={14} />
                      </motion.button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-lg font-medium text-cocoa">{formatPrice(item.product.price * item.qty)}</span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="text-cocoa/30 hover:text-error transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-card p-6 shadow-card sticky top-24">
            <h2 className="font-heading text-xl font-semibold text-cocoa mb-5">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-5">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 border border-cocoa/20 rounded-card px-3 py-2">
                  <Tag size={14} className="text-sage shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value.toUpperCase())}
                    disabled={couponApplied}
                    className="flex-1 font-body text-sm text-cocoa bg-transparent outline-none placeholder:text-cocoa/35"
                  />
                </div>
                <button
                  onClick={() => coupon.length >= 4 && setCouponApplied(true)}
                  disabled={couponApplied}
                  className={cn(
                    'px-4 py-2 font-body text-sm font-medium rounded-card transition-colors',
                    couponApplied ? 'bg-success text-white' : 'bg-gold-accessible text-white hover:bg-cocoa'
                  )}
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {couponApplied && <p className="mt-1.5 font-body text-xs text-success">10% discount applied!</p>}
            </div>

            {/* Gift wrap */}
            <label className="flex items-center gap-3 mb-5 cursor-pointer group">
              <div
                onClick={() => setGiftWrap(v => !v)}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
                  giftWrap ? 'bg-gold-accessible border-gold-accessible' : 'border-cocoa/30 group-hover:border-gold-accessible'
                )}
              >
                {giftWrap && <span className="text-white text-xs font-bold">&#10003;</span>}
              </div>
              <div className="flex items-center gap-2">
                <Gift size={14} className="text-sage" />
                <span className="font-body text-sm text-cocoa">Gift wrapping</span>
                <span className="font-body text-xs text-sage">(+&#8377;99)</span>
              </div>
            </label>

            {/* Line items */}
            <div className="flex flex-col gap-2.5 mb-5 text-sm font-body">
              <div className="flex justify-between text-cocoa">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-success">
                  <span>Discount (10%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-cocoa">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-success font-medium' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between text-cocoa">
                  <span>Gift wrapping</span>
                  <span>+{formatPrice(99)}</span>
                </div>
              )}
              {shipping > 0 && (
                <p className="font-body text-xs text-sage">Add {formatPrice(999 - total)} more for free shipping</p>
              )}
            </div>

            <div className="border-t border-gold/20 pt-4 mb-5">
              <div className="flex justify-between font-heading text-xl font-semibold text-cocoa">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <p className="font-body text-xs text-cocoa/45 mt-1">Inclusive of all taxes</p>
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                to="/checkout"
                className="block w-full bg-gold-accessible text-white font-body font-medium text-sm py-3.5 rounded-pill text-center hover:bg-cocoa transition-all duration-200"
              >
                Proceed to Checkout
              </Link>
            </motion.div>
            <Link to="/shop" className="block w-full text-center mt-3 text-gold-accessible font-body text-sm font-medium hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* You may also like */}
      {suggestedProducts.length > 0 && (
        <section className="mt-16 border-t border-gold/20 pt-12">
          <h2 className="font-heading text-3xl font-semibold text-cocoa mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {suggestedProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
