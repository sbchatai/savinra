import { useState } from 'react'
import { ORDERS } from '@/data/placeholder'
import { formatPrice } from '@/lib/utils'
import AccountSidebar from '@/components/account/AccountSidebar'
import { Upload, CheckCircle } from 'lucide-react'
import SEOHead from '@/components/layout/SEOHead'

export default function ReturnsPage() {
  const [step, setStep] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState('')
  const [reason, setReason] = useState('')
  const [resolution, setResolution] = useState('refund')

  const deliveredOrders = ORDERS.filter(o => o.status === 'delivered')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SEOHead title="Returns & Exchanges" noIndex />
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-semibold text-cocoa mb-4">Returns & Exchanges</h1>

          {/* Policy card */}
          <div className="bg-ivory rounded-card p-5 shadow-card mb-8">
            <h2 className="font-body text-sm font-medium text-cocoa mb-2">Return Policy</h2>
            <ul className="font-body text-sm text-cocoa/70 space-y-1">
              <li>15-day return window from delivery date</li>
              <li>Items must be unworn with original tags attached</li>
              <li>Earrings and customised pieces are non-returnable</li>
              <li>Refund processed within 5-7 business days after pickup</li>
            </ul>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            {['Select Order', 'Reason', 'Resolution', 'Photos'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= step ? 'bg-gold-accessible text-white' : 'bg-ivory text-cocoa/40 border border-cocoa/20'
                }`}>
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`font-body text-xs hidden sm:block ${i <= step ? 'text-cocoa' : 'text-cocoa/40'}`}>{label}</span>
                {i < 3 && <div className={`w-6 h-px ${i < step ? 'bg-gold-accessible' : 'bg-cocoa/10'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Select order */}
          {step === 0 && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-cocoa mb-4">Select the order to return</h2>
              {deliveredOrders.length === 0 ? (
                <p className="font-body text-sm text-cocoa/60">No eligible orders for return.</p>
              ) : (
                <div className="space-y-3">
                  {deliveredOrders.map(order => (
                    <button
                      key={order.id}
                      onClick={() => { setSelectedOrder(order.id); setStep(1) }}
                      className={`w-full text-left bg-ivory rounded-card p-4 border-2 transition-colors ${
                        selectedOrder === order.id ? 'border-gold-accessible' : 'border-transparent hover:border-gold/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img src={order.items[0].image} alt="" className="w-14 h-18 object-cover rounded-card" />
                        <div>
                          <p className="font-body text-sm font-medium text-cocoa">{order.id}</p>
                          <p className="font-body text-xs text-sage">{order.items[0].name}</p>
                          <p className="font-body text-sm text-cocoa mt-1">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Reason */}
          {step === 1 && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-cocoa mb-4">Why are you returning?</h2>
              <div className="space-y-2 mb-6">
                {[
                  'Size doesn\'t fit',
                  'Colour differs from image',
                  'Quality not as expected',
                  'Received damaged item',
                  'Wrong item received',
                  'Other',
                ].map(r => (
                  <label key={r} className={`flex items-center gap-3 p-3 rounded-card border cursor-pointer transition-colors ${
                    reason === r ? 'border-gold-accessible bg-gold-highlight/20' : 'border-cocoa/10 bg-ivory'
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      reason === r ? 'border-gold-accessible' : 'border-cocoa/30'
                    }`}>
                      {reason === r && <div className="w-2 h-2 rounded-full bg-gold-accessible" />}
                    </div>
                    <span className="font-body text-sm text-cocoa">{r}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="border-2 border-cocoa/20 text-cocoa font-body text-sm px-6 py-2.5 rounded-pill hover:border-gold-accessible transition-colors">
                  Back
                </button>
                <button
                  onClick={() => reason && setStep(2)}
                  disabled={!reason}
                  className="bg-gold-accessible text-white font-body text-sm px-6 py-2.5 rounded-pill hover:bg-cocoa transition-colors disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Resolution */}
          {step === 2 && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-cocoa mb-4">How would you like to resolve this?</h2>
              <div className="space-y-2 mb-6">
                {[
                  { value: 'refund', label: 'Refund to original payment method' },
                  { value: 'exchange', label: 'Exchange for a different size' },
                  { value: 'credit', label: 'Store credit (instant)' },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-card border cursor-pointer transition-colors ${
                    resolution === opt.value ? 'border-gold-accessible bg-gold-highlight/20' : 'border-cocoa/10 bg-ivory'
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      resolution === opt.value ? 'border-gold-accessible' : 'border-cocoa/30'
                    }`}>
                      {resolution === opt.value && <div className="w-2 h-2 rounded-full bg-gold-accessible" />}
                    </div>
                    <span className="font-body text-sm text-cocoa">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="border-2 border-cocoa/20 text-cocoa font-body text-sm px-6 py-2.5 rounded-pill hover:border-gold-accessible transition-colors">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="bg-gold-accessible text-white font-body text-sm px-6 py-2.5 rounded-pill hover:bg-cocoa transition-colors">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {step === 3 && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-cocoa mb-4">Upload photos (optional)</h2>
              <p className="font-body text-sm text-cocoa/60 mb-4">Help us process your return faster by uploading photos of the item.</p>
              <div className="border-2 border-dashed border-cocoa/20 rounded-card p-12 text-center mb-6 bg-ivory">
                <Upload size={32} className="mx-auto text-cocoa/30 mb-3" />
                <p className="font-body text-sm text-cocoa/50">Click to upload or drag and drop</p>
                <p className="font-body text-xs text-cocoa/30 mt-1">JPG, PNG up to 5MB</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="border-2 border-cocoa/20 text-cocoa font-body text-sm px-6 py-2.5 rounded-pill hover:border-gold-accessible transition-colors">
                  Back
                </button>
                <button className="bg-gold-accessible text-white font-body text-sm px-6 py-2.5 rounded-pill hover:bg-cocoa transition-colors">
                  Submit Return Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
