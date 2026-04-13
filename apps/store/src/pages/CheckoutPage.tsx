import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

const STEPS = ['Cart', 'Delivery', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const { items, total } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 0=cart, 1=delivery, 2=payment
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const shipping = total >= 999 ? 0 : 99

  const handlePlaceOrder = () => {
    navigate('/order-confirmation')
  }

  return (
    <div className="min-h-screen bg-parchment">
      {/* Simplified header */}
      <header className="bg-parchment border-b border-gold/30 py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-gold text-lg">&loz;</span>
            <span className="savinra-shine font-heading text-2xl font-bold tracking-wide">SAVINRA</span>
          </Link>
          <Link to="/cart" className="font-body text-sm text-gold-accessible hover:underline">
            Back to Bag
          </Link>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-bold ${
                i <= step + 1 ? 'bg-gold-accessible text-white' : 'bg-ivory text-cocoa/40'
              }`}>
                {i + 1}
              </div>
              <span className={`font-body text-sm hidden sm:block ${
                i <= step + 1 ? 'text-cocoa' : 'text-cocoa/40'
              }`}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-px ${i <= step ? 'bg-gold-accessible' : 'bg-ivory'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form */}
        <div className="lg:col-span-3">
          {step === 1 && (
            <div className="space-y-8">
              {/* Contact */}
              <section>
                <h2 className="font-heading text-2xl font-semibold text-cocoa mb-4">Contact Information</h2>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-ivory border border-cocoa/10 rounded-card px-4 py-3 font-body text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible"
                />
              </section>

              {/* Address */}
              <section>
                <h2 className="font-heading text-2xl font-semibold text-cocoa mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="Full Name" className="bg-ivory border border-cocoa/10 rounded-card px-4 py-3 font-body text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible" />
                  <input placeholder="Phone Number" className="bg-ivory border border-cocoa/10 rounded-card px-4 py-3 font-body text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible" />
                  <input placeholder="Address Line 1" className="sm:col-span-2 bg-ivory border border-cocoa/10 rounded-card px-4 py-3 font-body text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible" />
                  <input placeholder="Address Line 2 (optional)" className="sm:col-span-2 bg-ivory border border-cocoa/10 rounded-card px-4 py-3 font-body text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible" />
                  <input placeholder="City" className="bg-ivory border border-cocoa/10 rounded-card px-4 py-3 font-body text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible" />
                  <input placeholder="State" className="bg-ivory border border-cocoa/10 rounded-card px-4 py-3 font-body text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible" />
                  <input placeholder="PIN Code" className="bg-ivory border border-cocoa/10 rounded-card px-4 py-3 font-body text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible" />
                </div>
              </section>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gold-accessible text-white font-body font-medium text-sm py-3.5 rounded-pill hover:bg-cocoa transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <section>
                <h2 className="font-heading text-2xl font-semibold text-cocoa mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'upi', label: 'UPI (GPay, PhonePe, Paytm)' },
                    { value: 'card', label: 'Credit / Debit Card' },
                    { value: 'netbanking', label: 'Net Banking' },
                    { value: 'cod', label: 'Cash on Delivery' },
                  ].map(pm => (
                    <label
                      key={pm.value}
                      className={`flex items-center gap-3 p-4 rounded-card border cursor-pointer transition-colors ${
                        paymentMethod === pm.value
                          ? 'border-gold-accessible bg-gold-highlight/20'
                          : 'border-cocoa/10 bg-ivory hover:border-gold/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === pm.value ? 'border-gold-accessible' : 'border-cocoa/30'
                      }`}>
                        {paymentMethod === pm.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-gold-accessible" />
                        )}
                      </div>
                      <span className="font-body text-sm text-cocoa">{pm.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-cocoa/20 text-cocoa font-body font-medium text-sm py-3.5 rounded-pill hover:border-gold-accessible transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-gold-accessible text-white font-body font-medium text-sm py-3.5 rounded-pill hover:bg-cocoa transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-ivory rounded-card p-6 shadow-card sticky top-8">
            <h2 className="font-heading text-lg font-semibold text-cocoa mb-4">Order Summary</h2>
            <div className="flex flex-col gap-4 mb-6">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                  <div className="relative">
                    <img src={item.product.images[0]} alt="" className="w-16 h-20 object-cover rounded-card" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-cocoa text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm text-cocoa font-medium">{item.product.name}</p>
                    <p className="font-body text-xs text-sage">Size: {item.size}</p>
                    <p className="font-body text-sm text-cocoa mt-1">{formatPrice(item.product.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-cocoa/10 pt-4 flex flex-col gap-2">
              <div className="flex justify-between font-body text-sm text-cocoa">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-cocoa">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-success' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="border-t border-cocoa/10 pt-3 flex justify-between font-heading text-lg font-semibold text-cocoa">
                <span>Total</span>
                <span>{formatPrice(total + shipping)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
