import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Lock, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice, cn } from '@/lib/utils'

type Step = 'delivery' | 'payment'

const STEPS = ['Cart', 'Delivery', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('delivery')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [form, setForm] = useState({ email: '', fname: '', lname: '', phone: '', addr1: '', addr2: '', city: '', state: '', pincode: '' })
  const shipping = total >= 999 ? 0 : 99
  const grandTotal = total + shipping

  function update(field: string, val: string) { setForm(f => ({ ...f, [field]: val })) }

  function placeOrder() {
    clearCart()
    navigate('/order-confirmation')
  }

  const inputCls = "w-full px-4 py-3 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible transition-colors placeholder:text-cocoa/35"

  return (
    <div className="min-h-screen bg-parchment">
      {/* Simplified header */}
      <header className="border-b border-gold/20 bg-parchment/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <span className="savinra-shine font-heading font-bold text-xl tracking-widest">SAVINRA</span>
          </Link>
          <div className="flex items-center gap-1.5 font-body text-xs">
            {STEPS.map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className={cn(
                  'px-2.5 py-1 rounded-full transition-colors',
                  s === 'Delivery' && step === 'delivery' ? 'bg-gold-accessible text-white font-medium' :
                  s === 'Payment' && step === 'payment' ? 'bg-gold-accessible text-white font-medium' :
                  s === 'Cart' ? 'text-success font-medium' :
                  'text-cocoa/40'
                )}>{s === 'Cart' ? 'Cart' : s}</span>
                {i < STEPS.length - 1 && <ChevronRight size={12} className="text-cocoa/25" />}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 font-body text-xs text-cocoa/50">
            <Lock size={12} /> Secure checkout
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {step === 'delivery' && (
                <motion.div key="delivery" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <h2 className="font-heading text-2xl font-semibold text-cocoa mb-6">Contact & Delivery</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Email</label>
                      <input type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">First Name</label>
                        <input type="text" placeholder="Priya" value={form.fname} onChange={e => update('fname', e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Last Name</label>
                        <input type="text" placeholder="Sharma" value={form.lname} onChange={e => update('lname', e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Phone Number</label>
                      <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Address Line 1</label>
                      <input type="text" placeholder="Flat/House No., Building, Street" value={form.addr1} onChange={e => update('addr1', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Address Line 2 (Optional)</label>
                      <input type="text" placeholder="Area, Landmark" value={form.addr2} onChange={e => update('addr2', e.target.value)} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">City</label>
                        <input type="text" placeholder="New Delhi" value={form.city} onChange={e => update('city', e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">State</label>
                        <select value={form.state} onChange={e => update('state', e.target.value)} className={cn(inputCls, 'appearance-none')}>
                          <option value="">Select state</option>
                          {['Delhi','Maharashtra','Karnataka','Tamil Nadu','West Bengal','Rajasthan','Gujarat','Uttar Pradesh','Kerala','Telangana','Punjab','Haryana','Madhya Pradesh','Bihar','Odisha'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">PIN Code</label>
                      <input type="text" maxLength={6} placeholder="110001" value={form.pincode} onChange={e => update('pincode', e.target.value.replace(/\D/g,''))} className={inputCls} />
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('payment')}
                    className="mt-6 w-full bg-gold-accessible text-white font-body font-medium py-3.5 rounded-pill hover:bg-cocoa transition-colors"
                  >
                    Continue to Payment
                  </motion.button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
                  <button onClick={() => setStep('delivery')} className="flex items-center gap-1 font-body text-sm text-gold-accessible mb-6 hover:underline">
                    &larr; Back to delivery
                  </button>
                  <h2 className="font-heading text-2xl font-semibold text-cocoa mb-6">Payment Method</h2>

                  <div className="space-y-3">
                    {[
                      { id: 'upi', label: 'UPI', sub: 'PhonePe, GPay, Paytm, BHIM' },
                      { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex, Rupay' },
                      { id: 'netbanking', label: 'Net Banking', sub: 'All major Indian banks' },
                      { id: 'cod', label: 'Cash on Delivery', sub: 'Available on orders up to ₹5,000' },
                    ].map(method => (
                      <label
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-card border-2 cursor-pointer transition-all',
                          paymentMethod === method.id ? 'border-gold-accessible glass' : 'border-cocoa/15 bg-ivory hover:border-gold/40'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          paymentMethod === method.id ? 'border-gold-accessible bg-gold-accessible' : 'border-cocoa/30'
                        )}>
                          {paymentMethod === method.id && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium text-cocoa">{method.label}</p>
                          <p className="font-body text-xs text-cocoa/50">{method.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={placeOrder}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-gold-accessible text-white font-body font-medium py-3.5 rounded-pill hover:bg-cocoa transition-colors"
                  >
                    <Lock size={15} /> Place Order &middot; {formatPrice(grandTotal)}
                  </motion.button>
                  <p className="text-center font-body text-xs text-cocoa/40 mt-3 flex items-center justify-center gap-1">
                    <Lock size={11} /> Your payment is 100% secure & encrypted
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="glass rounded-card p-5 sticky top-24">
              <h3 className="font-heading text-lg font-semibold text-cocoa mb-4">Your Order</h3>
              <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3 items-center">
                    <div className="relative shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} width={56} height={75} className="w-14 h-[75px] object-cover rounded-card" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold-accessible text-white text-[10px] font-medium rounded-full flex items-center justify-center">{item.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm font-semibold text-cocoa leading-tight truncate">{item.product.name}</p>
                      <p className="font-body text-xs text-sage">Size: {item.size}</p>
                    </div>
                    <span className="font-heading text-sm font-medium text-cocoa shrink-0">{formatPrice(item.product.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gold/20 pt-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-cocoa"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between text-cocoa"><span>Shipping</span><span className={shipping === 0 ? 'text-success font-medium' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-heading text-lg font-semibold text-cocoa border-t border-gold/15 pt-3 mt-2">
                  <span>Total</span><span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
