import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface CouponFormData {
  code: string
  description: string
  type: 'percentage' | 'fixed'
  value: string
  min_order_value: string
  max_discount: string
  usage_limit: string
  valid_from: string
  valid_until: string
  is_active: boolean
}

interface Props {
  couponId: string | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY_FORM: CouponFormData = {
  code: '',
  description: '',
  type: 'percentage',
  value: '',
  min_order_value: '',
  max_discount: '',
  usage_limit: '',
  valid_from: '',
  valid_until: '',
  is_active: true,
}

function inputClass() {
  return 'w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body'
}

function labelClass() {
  return 'block text-sm font-medium text-cocoa/70 font-body mb-1.5'
}

export default function CouponFormModal({ couponId, onClose, onSaved }: Props) {
  const isEditing = Boolean(couponId)

  const [form, setForm] = useState<CouponFormData>(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!couponId) return
    supabase
      .from('coupons')
      .select('*')
      .eq('id', couponId)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            code: data.code,
            description: data.description ?? '',
            type: data.type as 'percentage' | 'fixed',
            value: String(data.type === 'percentage' ? data.value / 100 : data.value / 100),
            min_order_value: data.min_order_value > 0 ? String(data.min_order_value / 100) : '',
            max_discount: data.max_discount ? String(data.max_discount / 100) : '',
            usage_limit: data.usage_limit ? String(data.usage_limit) : '',
            valid_from: data.valid_from ? data.valid_from.split('T')[0] : '',
            valid_until: data.valid_until ? data.valid_until.split('T')[0] : '',
            is_active: data.is_active,
          })
        }
        setIsLoading(false)
      })
  }, [couponId])

  function handleField(field: keyof CouponFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleCheckbox(field: keyof CouponFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.checked }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    const val = parseFloat(form.value)
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid discount value.')
      setIsSaving(false)
      return
    }

    // Percentage: store as integer 0–100; Fixed: store as paise
    const valueInPaise = form.type === 'percentage'
      ? Math.round(val * 100)
      : Math.round(val * 100)

    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description || null,
      type: form.type,
      value: valueInPaise,
      min_order_value: form.min_order_value ? Math.round(parseFloat(form.min_order_value) * 100) : 0,
      max_discount: form.max_discount ? Math.round(parseFloat(form.max_discount) * 100) : null,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
      valid_from: form.valid_from ? new Date(form.valid_from).toISOString() : new Date().toISOString(),
      valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
      is_active: form.is_active,
    }

    try {
      if (isEditing && couponId) {
        const { error: err } = await supabase.from('coupons').update(payload).eq('id', couponId)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('coupons').insert(payload)
        if (err) throw err
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-modal-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-parchment rounded-card shadow-xl border border-admin-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-admin-border">
          <h2 id="coupon-modal-title" className="font-heading text-lg font-medium text-cocoa">
            {isEditing ? 'Edit Coupon' : 'New Coupon'}
          </h2>
          <button onClick={onClose} className="text-cocoa/40 hover:text-cocoa transition-colors" aria-label="Close">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-cocoa/40 font-body">Loading…</div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
            {/* Code */}
            <div>
              <label htmlFor="cpn-code" className={labelClass()}>Code <span className="text-error" aria-hidden="true">*</span></label>
              <input
                id="cpn-code"
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className={`${inputClass()} font-mono tracking-widest`}
                placeholder="SAVE20"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="cpn-desc" className={labelClass()}>Description</label>
              <textarea id="cpn-desc" rows={2} value={form.description} onChange={handleField('description')} className={`${inputClass()} resize-y`} placeholder="20% off on orders above ₹2,000" />
            </div>

            {/* Type + Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpn-type" className={labelClass()}>Discount type</label>
                <select id="cpn-type" value={form.type} onChange={handleField('type')} className={inputClass()}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </div>
              <div>
                <label htmlFor="cpn-value" className={labelClass()}>
                  {form.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} <span className="text-error" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cocoa/40 font-body">
                    {form.type === 'percentage' ? '%' : '₹'}
                  </span>
                  <input
                    id="cpn-value"
                    type="number"
                    required
                    min={form.type === 'percentage' ? '1' : '1'}
                    max={form.type === 'percentage' ? '100' : undefined}
                    step={form.type === 'percentage' ? '1' : '1'}
                    value={form.value}
                    onChange={handleField('value')}
                    className={`${inputClass()} ${form.type === 'fixed' ? 'pl-7' : 'pl-7'}`}
                    placeholder={form.type === 'percentage' ? '20' : '500'}
                  />
                </div>
              </div>
            </div>

            {/* Min order + Max discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpn-min" className={labelClass()}>Min order (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cocoa/40 font-body">₹</span>
                  <input id="cpn-min" type="number" min="0" step="1" value={form.min_order_value} onChange={handleField('min_order_value')} className={`${inputClass()} pl-7`} placeholder="0 = no minimum" />
                </div>
                <p className="text-xs text-cocoa/30 font-body mt-1">Order subtotal must meet this to apply.</p>
              </div>
              <div>
                <label htmlFor="cpn-cap" className={labelClass()}>Max discount cap (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cocoa/40 font-body">₹</span>
                  <input id="cpn-cap" type="number" min="0" step="1" value={form.max_discount} onChange={handleField('max_discount')} className={`${inputClass()} pl-7`} placeholder="No cap" />
                </div>
                <p className="text-xs text-cocoa/30 font-body mt-1">Leave blank for no cap.</p>
              </div>
            </div>

            {/* Validity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpn-from" className={labelClass()}>Valid from</label>
                <input id="cpn-from" type="date" value={form.valid_from} onChange={handleField('valid_from')} className={inputClass()} />
              </div>
              <div>
                <label htmlFor="cpn-until" className={labelClass()}>Valid until</label>
                <input id="cpn-until" type="date" value={form.valid_until} onChange={handleField('valid_until')} className={inputClass()} />
              </div>
            </div>

            {/* Usage limit */}
            <div>
              <label htmlFor="cpn-limit" className={labelClass()}>Usage limit</label>
              <input id="cpn-limit" type="number" min="0" value={form.usage_limit} onChange={handleField('usage_limit')} className={inputClass()} placeholder="Unlimited if blank" />
            </div>

            {/* Active */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={handleCheckbox('is_active')} className="w-4 h-4 rounded border-admin-border text-gold focus:ring-gold/40" />
              <span className="text-sm text-cocoa font-body">Active</span>
            </label>

            {error && (
              <p role="alert" className="text-sm text-error font-body bg-error/5 border border-error/20 rounded px-4 py-3">{error}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving || !form.code || !form.value}
                className="px-6 py-2.5 bg-cocoa text-parchment text-sm font-semibold font-body rounded-pill hover:bg-cocoa/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Coupon'}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-cocoa/60 font-body hover:text-cocoa transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}