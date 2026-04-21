import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Lock, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { formatPrice, cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

type Step = 'delivery' | 'payment'

const STEPS = ['Cart', 'Delivery', 'Payment', 'Confirm']

// ─── Razorpay script loader ───────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (document.getElementById('razorpay-script')) return resolve(true)
    const s = document.createElement('script')
    s.id = 'razorpay-script'
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user, customer, openAuthModal } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('delivery')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [form, setForm] = useState({
    email: customer?.email || user?.email || '',
    fname: customer?.full_name?.split(' ')[0] ?? '',
    lname: customer?.full_name?.split(' ').slice(1).join(' ') ?? '',
    phone: customer?.phone ?? '',
    addr1: '', addr2: '', city: '', state: '', pincode: '',
  })
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const shipping = total >= 999 ? 0 : 99
  const grandTotal = total + shipping

  function update(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }))
  }

  // Auth guard — redirect to sign-in if not logged in
  useEffect(() => {
    if (!user && step === 'delivery') {
      openAuthModal('signin')
    }
  }, [user, step])

  async function placeOrder() {
    if (!user || items.length === 0) return
    setPlacing(true)
    setOrderError(null)

    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          customer_id: user.id,
          items: items.map(item => ({
            product_id: item.product.id,
            variant_id: item.variantId ?? null,
            qty: item.qty,
            unit_price: Math.round(item.product.price * 100),
          })),
          shipping_address: {
            full_name: [form.fname, form.lname].filter(Boolean).join(' '),
            phone: form.phone,
            line1: form.addr1,
            line2: form.addr2 || null,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            country: 'India',
          },
          payment_method: paymentMethod,
          coupon_code: null,
        },
      })

      if (error || !data) {
        throw new Error(
          typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : 'Failed to create order. Please try again.',
        )
      }

      const { order_id, order_number, razorpay_order_id, razorpay_key_id } = data as {
        order_id: string
        order_number: string
        razorpay_order_id?: string
        razorpay_key_id?: string
      }

      // COD — navigate immediately
      if (paymentMethod === 'cod') {
        clearCart()
        navigate('/order-confirmation', { state: { orderId: order_id, orderNumber: order_number } })
        return
      }

      // Online payment — open Razorpay Checkout
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        throw new Error('Payment gateway failed to load. Please refresh and try again.')
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: razorpay_key_id,
        amount: Math.round(grandTotal * 100),
        currency: 'INR',
        name: 'SAVINRA',
        description: 'Fashion Order',
        image: '/savinra-logo.svg',
        order_id: razorpay_order_id,
        handler: function () {
          clearCart()
          navigate('/order-confirmation', {
            state: { orderId: order_id, orderNumber: order_number },
          })
        },
        prefill: {
          name: [form.fname, form.lname].filter(Boolean).join(' '),
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#8B7355' },
        modal: {
          ondismiss: function () {
            setPlacing(false)
          },
        },
      })
      rzp.open()
      // setPlacing(false) is handled by ondismiss or the handler callback
    } catch (err: unknown) {
      setOrderError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      )
      setPlacing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-cocoa mb-3">Sign in to continue checkout</h2>
          <p className="font-body text-sm text-cocoa/60 mb-6">
            Please sign in or create an account to place your order.
          </p>
          <button
            onClick={() => openAuthModal('signin')}
            className="bg-gold-accessible text-white font-body font-medium px-8 py-3 rounded-pill hover:bg-cocoa transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const inputCls =
    'w-full px-4 py-3 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible transition-colors placeholder:text-cocoa/35'

  return (
    <div className="min-h-screen bg-parchment">
      {/* Simplified header */}
      <header className="border-b border-gold/20 bg-parchment/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <img src="/savinra-logo.svg" alt="SAVINRA" width={56} height={28} className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-1.5 font-body text-xs">
            {STEPS.map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'px-2.5 py-1 rounded-full transition-colors',
                    s === 'Delivery' && step === 'delivery'
                      ? 'bg-gold-accessible text-white font-medium'
                      : s === 'Payment' && step === 'payment'
                        ? 'bg-gold-accessible text-white font-medium'
                        : s === 'Cart'
                          ? 'text-success font-medium'
                          : 'text-cocoa/40',
                  )}
                >
                  {s}
                </span>
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
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                >
                  <h2 className="font-heading text-2xl font-semibold text-cocoa mb-6">
                    Contact &amp; Delivery
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => update('email', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="Priya"
                          value={form.fname}
                          onChange={e => update('fname', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Sharma"
                          value={form.lname}
                          onChange={e => update('lname', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => update('phone', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        placeholder="Flat/House No., Building, Street"
                        value={form.addr1}
                        onChange={e => update('addr1', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Area, Landmark"
                        value={form.addr2}
                        onChange={e => update('addr2', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="New Delhi"
                          value={form.city}
                          onChange={e => update('city', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">
                          State
                        </label>
                        <select
                          value={form.state}
                          onChange={e => update('state', e.target.value)}
                          className={cn(inputCls, 'appearance-none')}
                        >
                          <option value="">Select state</option>
                          {[
                            'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal',
                            'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'Kerala', 'Telangana',
                            'Punjab', 'Haryana', 'Madhya Pradesh', 'Bihar', 'Odisha',
                          ].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="110001"
                        value={form.pincode}
                        onChange={e => update('pincode', e.target.value.replace(/\D/g, ''))}
                        className={inputCls}
                      />
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
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                >
                  <button
                    onClick={() => setStep('delivery')}
                    className="flex items-center gap-1 font-body text-sm text-gold-accessible mb-6 hover:underline"
                  >
                    &larr; Back to delivery
                  </button>
                  <h2 className="font-heading text-2xl font-semibold text-cocoa mb-6">
                    Payment Method
                  </h2>

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
                          paymentMethod === method.id
                            ? 'border-gold-accessible glass'
                            : 'border-cocoa/15 bg-ivory hover:border-gold/40',
                        )}
                      >
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                            paymentMethod === method.id
                              ? 'border-gold-accessible bg-gold-accessible'
                              : 'border-cocoa/30',
                          )}
                        >
                          {paymentMethod === method.id && (
                            <Check size={11} className="text-white" strokeWidth={3} />
                          )}
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
                    disabled={placing}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-gold-accessible text-white font-body font-medium py-3.5 rounded-pill hover:bg-cocoa transition-colors disabled:opacity-60"
                  >
                    {placing ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Placing Order...
                      </span>
                    ) : (
                      <>
                        <Lock size={15} /> Place Order &middot; {formatPrice(grandTotal)}
                      </>
                    )}
                  </motion.button>
                  {orderError && (
                    <p className="text-center font-body text-xs text-error mt-2">{orderError}</p>
                  )}
                  <p className="text-center font-body text-xs text-cocoa/40 mt-3 flex items-center justify-center gap-1">
                    <Lock size={11} /> Your payment is 100% secure &amp; encrypted
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
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={56}
                        height={75}
                        className="w-14 h-[75px] object-cover rounded-card"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold-accessible text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm font-semibold text-cocoa leading-tight truncate">
                        {item.product.name}
                      </p>
                      <p className="font-body text-xs text-sage">Size: {item.size}</p>
                    </div>
                    <span className="font-heading text-sm font-medium text-cocoa shrink-0">
                      {formatPrice(item.product.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gold/20 pt-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-cocoa">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-cocoa">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-success font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-heading text-lg font-semibold text-cocoa border-t border-gold/15 pt-3 mt-2">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
