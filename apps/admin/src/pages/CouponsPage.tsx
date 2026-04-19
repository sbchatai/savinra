import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import CouponFormModal from '@/components/CouponFormModal'

interface Coupon {
  id: string
  code: string
  description: string | null
  type: 'percentage' | 'fixed'
  value: number
  min_order_value: number
  max_discount: number | null
  usage_limit: number | null
  usage_count: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
}

function formatPaise(p: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p / 100)
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
      type === 'percentage'
        ? 'bg-blue-100 text-blue-700 border-blue-200'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200'
    }`}>
      {type}
    </span>
  )
}

function ExpiryStatus({ valid_until }: { valid_until: string | null }) {
  if (!valid_until) return <span className="text-xs text-cocoa/40 font-body">Never expires</span>
  const now = Date.now()
  const until = new Date(valid_until).getTime()
  const daysLeft = Math.ceil((until - now) / 86400000)
  if (daysLeft < 0) return <span className="text-xs text-error font-body">Expired</span>
  if (daysLeft <= 7) return <span className="text-xs text-amber-600 font-body">Expires in {daysLeft}d</span>
  return <span className="text-xs text-cocoa/50 font-body">{new Date(valid_until).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { loadCoupons() }, [])

  async function loadCoupons() {
    setIsLoading(true)
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    setCoupons((data ?? []).map((c: any) => ({ ...c, type: c.type as 'percentage' | 'fixed' })))
    setIsLoading(false)
  }

  async function toggleActive(coupon: Coupon) {
    await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id)
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !c.is_active } : c)))
  }

  async function deleteCoupon(coupon: Coupon) {
    if (!confirm(`Delete coupon "${coupon.code}"? This cannot be undone.`)) return
    await supabase.from('coupons').delete().eq('id', coupon.id)
    setCoupons((prev) => prev.filter((c) => c.id !== coupon.id))
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {})
  }

  const filtered = coupons.filter((c) =>
    !searchQuery ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  function openEdit(id: string) { setEditId(id); setShowModal(true) }
  function openNew() { setEditId(null); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditId(null) }
  function onSaved() { loadCoupons(); closeModal() }

  return (
    <section aria-labelledby="coupons-heading">
      <h2 id="coupons-heading" className="sr-only">Coupons</h2>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <input
          type="search"
          placeholder="Search coupons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 text-sm border border-admin-border rounded text-cocoa bg-parchment placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body w-64"
          aria-label="Search coupons"
        />
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 transition-colors"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Coupon
        </button>
      </div>

      <div className="bg-parchment rounded-card shadow-card border border-admin-border overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-cocoa/40 font-body">Loading coupons…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-cocoa/40 font-body">
            {searchQuery ? 'No coupons match your search.' : 'No coupons yet.'}
            {!searchQuery && (
              <button onClick={openNew} className="mt-3 text-gold hover:text-gold/80 font-medium text-sm transition-colors">
                Create your first coupon →
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm" aria-label="Coupons table">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Code</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Description</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Discount</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Min order</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Max cap</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Used / Limit</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Expires</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Type</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((coupon, i) => (
                <tr
                  key={coupon.id}
                  className={`border-b border-admin-border/50 hover:bg-ivory/40 transition-colors ${i % 2 === 1 ? 'bg-parchment/60' : ''} ${!coupon.is_active ? 'opacity-60' : ''}`}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="font-mono text-cocoa font-semibold text-sm hover:text-gold transition-colors font-body"
                        title="Copy code"
                        aria-label={`Copy code ${coupon.code}`}
                      >
                        {coupon.code}
                      </button>
                      {!coupon.is_active && (
                        <span className="text-[10px] text-cocoa/40 font-body bg-admin-border/40 px-1.5 py-0.5 rounded">inactive</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-cocoa/70 font-body max-w-[200px] truncate">
                    {coupon.description ?? '—'}
                  </td>
                  <td className="px-6 py-3.5 text-right font-body">
                    <span className="font-medium text-cocoa">
                      {coupon.type === 'percentage' ? `${coupon.value / 100}%` : formatPaise(coupon.value)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-body text-cocoa/60">
                    {coupon.min_order_value > 0 ? formatPaise(coupon.min_order_value) : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-right font-body text-cocoa/60">
                    {coupon.max_discount ? formatPaise(coupon.max_discount) : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-right font-body text-cocoa/60">
                    {coupon.usage_limit
                      ? `${coupon.usage_count} / ${coupon.usage_limit}`
                      : `${coupon.usage_count} / ∞`}
                  </td>
                  <td className="px-6 py-3.5">
                    <ExpiryStatus valid_until={coupon.valid_until} />
                  </td>
                  <td className="px-6 py-3.5">
                    <TypeBadge type={coupon.type} />
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => toggleActive(coupon)}
                        className="text-xs font-body transition-colors"
                        style={{ color: coupon.is_active ? '#f59e0b' : '#9ca3af' }}
                      >
                        {coupon.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => openEdit(coupon.id)}
                        className="text-xs text-gold-accessible hover:text-gold font-body font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon)}
                        className="text-xs text-error/60 hover:text-error font-body transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <CouponFormModal
          couponId={editId}
          onClose={closeModal}
          onSaved={onSaved}
        />
      )}
    </section>
  )
}