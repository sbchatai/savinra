import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@savinra/shared'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'store' | 'shipping' | 'announcements' | 'faqs' | 'notifications'

const TABS: { id: TabId; label: string }[] = [
  { id: 'store', label: 'Store Info' },
  { id: 'shipping', label: 'Shipping & Payments' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'notifications', label: 'Notifications' },
]

interface StoreSettings {
  id: number
  store_name: string | null
  store_email: string | null
  store_phone: string | null
  support_whatsapp: string | null
  instagram_handle: string | null
  facebook_url: string | null
  meta_title: string | null
  meta_desc: string | null
  free_shipping_above: number | null
  flat_shipping_rate: number | null
  cod_enabled: boolean | null
  cod_max_order_value: number | null
  gst_rate_percent: number | null
}

interface Announcement {
  id: string
  created_at: string
  updated_at: string
  message: string
  link_text: string | null
  link_url: string | null
  bg_color: string
  text_color: string
  is_active: boolean
  show_from: string
  show_until: string | null
  sort_order: number
}

interface FaqItem {
  id: string
  question: string
  answer: string
  sort_order: number
  is_active: boolean
}

interface WhatsappLog {
  id: string
  template_name: string | null
  phone: string
  status: string
  created_at: string
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function inputClass() {
  return 'w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body'
}

function labelClass() {
  return 'block text-sm font-medium text-cocoa/70 font-body mb-1.5'
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  hint,
  rows,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  rows?: number
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass()}>
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass()} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass()}
        />
      )}
      {hint && <p className="mt-1 text-xs text-cocoa/40 font-body">{hint}</p>}
    </div>
  )
}

function SaveButton({
  onClick,
  saving,
  saved,
}: {
  onClick: () => void
  saving: boolean
  saved: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="px-5 py-2.5 bg-cocoa text-parchment text-sm font-medium font-body rounded-pill hover:bg-cocoa/80 transition-colors disabled:opacity-50"
    >
      {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
    </button>
  )
}

function useSaveState() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function flash() {
    setSaved(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setSaved(false), 2000)
  }

  return { saving, setSaving, saved, flash, error, setError }
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2 font-body">
      {message}
    </div>
  )
}

// ─── Tab 1 — Store Info ───────────────────────────────────────────────────────

function StoreInfoTab({ settings, reload }: { settings: StoreSettings | null; reload: () => void }) {
  const [storeName, setStoreName] = useState(settings?.store_name ?? '')
  const [email, setEmail] = useState(settings?.store_email ?? '')
  const [phone, setPhone] = useState(settings?.store_phone ?? '')
  const [whatsapp, setWhatsapp] = useState(settings?.support_whatsapp ?? '')
  const [instagram, setInstagram] = useState(settings?.instagram_handle ?? '')
  const [facebook, setFacebook] = useState(settings?.facebook_url ?? '')
  const [metaTitle, setMetaTitle] = useState(settings?.meta_title ?? '')
  const [metaDesc, setMetaDesc] = useState(settings?.meta_desc ?? '')
  const { saving, setSaving, saved, flash, error, setError } = useSaveState()

  useEffect(() => {
    if (!settings) return
    setStoreName(settings.store_name ?? '')
    setEmail(settings.store_email ?? '')
    setPhone(settings.store_phone ?? '')
    setWhatsapp(settings.support_whatsapp ?? '')
    setInstagram(settings.instagram_handle ?? '')
    setFacebook(settings.facebook_url ?? '')
    setMetaTitle(settings.meta_title ?? '')
    setMetaDesc(settings.meta_desc ?? '')
  }, [settings])

  async function save() {
    setSaving(true)
    setError(null)
    const { error: err } = await (supabase.from('store_settings') as any).upsert({
      id: 1,
      store_name: storeName,
      store_email: email,
      store_phone: phone,
      support_whatsapp: whatsapp,
      instagram_handle: instagram,
      facebook_url: facebook,
      meta_title: metaTitle,
      meta_desc: metaDesc,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    flash()
    reload()
  }

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <Field id="store-name" label="Store name" value={storeName} onChange={setStoreName} placeholder="SAVINRA" />
      <Field id="support-email" label="Support email" type="email" value={email} onChange={setEmail} placeholder="support@savinra.com" hint="Displayed on order confirmations and invoices." />
      <Field id="support-phone" label="Support phone" type="tel" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
      <Field id="whatsapp-number" label="WhatsApp number" type="tel" value={whatsapp} onChange={setWhatsapp} placeholder="+91 98765 43210" hint="Used for WhatsApp order notifications." />
      <div className="grid grid-cols-2 gap-4">
        <Field id="instagram-url" label="Instagram URL" value={instagram} onChange={setInstagram} placeholder="https://instagram.com/savinra" />
        <Field id="facebook-url" label="Facebook URL" value={facebook} onChange={setFacebook} placeholder="https://facebook.com/savinra" />
      </div>
      <div className="border-t border-admin-border pt-4">
        <h3 className="font-heading text-sm font-semibold text-cocoa/60 uppercase tracking-wider mb-3">SEO</h3>
        <div className="space-y-3">
          <Field id="meta-title" label="Meta title" value={metaTitle} onChange={setMetaTitle} placeholder="SAVINRA — Indo-Western Fashion" hint="Recommended: 50–60 characters." />
          <Field id="meta-description" label="Meta description" value={metaDesc} onChange={setMetaDesc} placeholder="Discover curated indo-western fashion..." hint="Recommended: 150–160 characters." rows={3} />
        </div>
      </div>
      <div className="pt-2">
        <SaveButton onClick={save} saving={saving} saved={saved} />
      </div>
    </div>
  )
}

// ─── Tab 2 — Shipping & Payments ──────────────────────────────────────────────

function ShippingTab({ settings, reload }: { settings: StoreSettings | null; reload: () => void }) {
  const [freeAbove, setFreeAbove] = useState(String((settings?.free_shipping_above ?? 0) / 100))
  const [flatRate, setFlatRate] = useState(String((settings?.flat_shipping_rate ?? 0) / 100))
  const [codEnabled, setCodEnabled] = useState(settings?.cod_enabled ?? true)
  const [codMax, setCodMax] = useState(String((settings?.cod_max_order_value ?? 0) / 100))
  const [gstRate, setGstRate] = useState(String(settings?.gst_rate_percent ?? 0))
  const { saving, setSaving, saved, flash, error, setError } = useSaveState()

  useEffect(() => {
    if (!settings) return
    setFreeAbove(String((settings.free_shipping_above ?? 0) / 100))
    setFlatRate(String((settings.flat_shipping_rate ?? 0) / 100))
    setCodEnabled(settings.cod_enabled ?? true)
    setCodMax(String((settings.cod_max_order_value ?? 0) / 100))
    setGstRate(String(settings.gst_rate_percent ?? 0))
  }, [settings])

  async function save() {
    setSaving(true)
    setError(null)
    const { error: err } = await (supabase.from('store_settings') as any).upsert({
      id: 1,
      free_shipping_above: Math.round(parseFloat(freeAbove || '0') * 100),
      flat_shipping_rate: Math.round(parseFloat(flatRate || '0') * 100),
      cod_enabled: codEnabled,
      cod_max_order_value: Math.round(parseFloat(codMax || '0') * 100),
      gst_rate_percent: parseFloat(gstRate || '0'),
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    flash()
    reload()
  }

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} />}

      <div className="space-y-4">
        <h3 className="font-heading text-sm font-semibold text-cocoa/60 uppercase tracking-wider">Shipping</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field id="free-shipping-above" label="Free shipping above (₹)" type="number" value={freeAbove} onChange={setFreeAbove} placeholder="999" hint="Orders at or above this value ship free." />
          <Field id="flat-shipping-rate" label="Flat shipping rate (₹)" type="number" value={flatRate} onChange={setFlatRate} placeholder="99" hint="Applied to orders below the free threshold." />
        </div>
      </div>

      <div className="border-t border-admin-border pt-4 space-y-4">
        <h3 className="font-heading text-sm font-semibold text-cocoa/60 uppercase tracking-wider">Cash on Delivery</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={codEnabled}
            onChange={(e) => setCodEnabled(e.target.checked)}
            className="w-4 h-4 rounded border-admin-border text-gold focus:ring-gold/40"
          />
          <span className="text-sm text-cocoa font-body">Cash on Delivery enabled</span>
        </label>
        <Field id="cod-max-order" label="Max order value for COD (₹)" type="number" value={codMax} onChange={setCodMax} placeholder="5000" hint="Orders above this value are not eligible for COD." />
      </div>

      <div className="border-t border-admin-border pt-4 space-y-4">
        <h3 className="font-heading text-sm font-semibold text-cocoa/60 uppercase tracking-wider">Tax</h3>
        <Field id="gst-rate" label="GST rate (%)" type="number" value={gstRate} onChange={setGstRate} placeholder="5" hint="e.g. 5 for 5% GST. Applied to all taxable orders." />
      </div>

      <div className="pt-2">
        <SaveButton onClick={save} saving={saving} saved={saved} />
      </div>
    </div>
  )
}

// ─── Tab 3 — Announcements ────────────────────────────────────────────────────

function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [newActive, setNewActive] = useState(true)
  const [newStartsAt, setNewStartsAt] = useState('')
  const [newEndsAt, setNewEndsAt] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setIsLoading(true)
    const { data, error: err } = await supabase
      .from('store_announcements')
      .select('*')
      .order('created_at', { ascending: false })
    setIsLoading(false)
    if (err) { setError(err.message); return }
    setAnnouncements(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('store_announcements').update({ is_active: !current }).eq('id', id)
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: !current } : a))
    )
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm('Delete this announcement?')) return
    const { error: err } = await supabase.from('store_announcements').delete().eq('id', id)
    if (err) { setError(err.message); return }
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }

  async function addAnnouncement() {
    if (!newMessage.trim()) return
    setSaving(true)
    const { error: err } = await supabase.from('store_announcements').insert({
      message: newMessage.trim(),
      is_active: newActive,
      show_from: newStartsAt ? new Date(newStartsAt).toISOString() : new Date().toISOString(),
      show_until: newEndsAt ? new Date(newEndsAt).toISOString() : null,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setNewMessage('')
    setNewActive(true)
    setNewStartsAt('')
    setNewEndsAt('')
    setShowForm(false)
    load()
  }

  function formatDateRange(show_from: string, show_until: string | null) {
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    if (show_until) return `${fmt(show_from)} – ${fmt(show_until)}`
    return `From ${fmt(show_from)}`
  }

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex items-center justify-between">
        <p className="text-sm text-cocoa/60 font-body">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 transition-colors"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Announcement
        </button>
      </div>

      {showForm && (
        <div className="border border-admin-border rounded-card p-4 space-y-3 bg-ivory/30">
          <h3 className="text-sm font-semibold text-cocoa font-body">New Announcement</h3>
          <div>
            <label htmlFor="ann-message" className={labelClass()}>Message</label>
            <input
              id="ann-message"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="e.g. Free shipping on orders above ₹999"
              className={inputClass()}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ann-starts" className={labelClass()}>Show from (optional)</label>
              <input id="ann-starts" type="date" value={newStartsAt} onChange={(e) => setNewStartsAt(e.target.value)} className={inputClass()} />
            </div>
            <div>
              <label htmlFor="ann-ends" className={labelClass()}>Show until (optional)</label>
              <input id="ann-ends" type="date" value={newEndsAt} onChange={(e) => setNewEndsAt(e.target.value)} className={inputClass()} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={newActive} onChange={(e) => setNewActive(e.target.checked)} className="w-4 h-4 rounded border-admin-border text-gold focus:ring-gold/40" />
            <span className="text-sm text-cocoa font-body">Active immediately</span>
          </label>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={addAnnouncement}
              disabled={saving || !newMessage.trim()}
              className="px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Announcement'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-cocoa/50 hover:text-cocoa font-body transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-cocoa/40 font-body py-8 text-center">Loading announcements…</p>
      ) : announcements.length === 0 ? (
        <p className="text-sm text-cocoa/40 font-body py-8 text-center">No announcements yet.</p>
      ) : (
        <ul className="space-y-2">
          {announcements.map((ann) => (
            <li key={ann.id} className="flex items-start justify-between gap-4 p-4 rounded-card border border-admin-border bg-white">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-cocoa font-body">{ann.message}</p>
                <p className="text-xs text-cocoa/40 font-body mt-0.5">{formatDateRange(ann.show_from, ann.show_until)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(ann.id, ann.is_active)}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                    ann.is_active
                      ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                      : 'bg-admin-border/30 text-cocoa/50 border-admin-border hover:bg-admin-border/50'
                  }`}
                  aria-label={ann.is_active ? 'Deactivate announcement' : 'Activate announcement'}
                >
                  {ann.is_active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="text-xs text-error/60 hover:text-error font-body transition-colors"
                  aria-label="Delete announcement"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Tab 4 — FAQs ─────────────────────────────────────────────────────────────

function FaqsTab() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuestion, setEditQuestion] = useState('')
  const [editAnswer, setEditAnswer] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setIsLoading(true)
    const { data, error: err } = await supabase
      .from('faq_items')
      .select('*')
      .order('sort_order', { ascending: true })
    setIsLoading(false)
    if (err) { setError(err.message); return }
    setFaqs(data ?? [])
  }

  useEffect(() => { load() }, [])

  function startEdit(faq: FaqItem) {
    setEditingId(faq.id)
    setEditQuestion(faq.question)
    setEditAnswer(faq.answer)
  }

  async function saveEdit(id: string) {
    setSaving(true)
    const { error: err } = await supabase
      .from('faq_items')
      .update({ question: editQuestion, answer: editAnswer })
      .eq('id', id)
    setSaving(false)
    if (err) { setError(err.message); return }
    setEditingId(null)
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, question: editQuestion, answer: editAnswer } : f))
    )
  }

  async function deleteFaq(id: string) {
    if (!confirm('Delete this FAQ?')) return
    const { error: err } = await supabase.from('faq_items').delete().eq('id', id)
    if (err) { setError(err.message); return }
    setFaqs((prev) => prev.filter((f) => f.id !== id))
  }

  async function addFaq() {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    setSaving(true)
    const maxOrder = faqs.reduce((m, f) => Math.max(m, f.sort_order), 0)
    const { error: err } = await supabase.from('faq_items').insert({
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      sort_order: maxOrder + 1,
      is_active: true,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setNewQuestion('')
    setNewAnswer('')
    setShowAddForm(false)
    load()
  }

  async function moveOrder(id: string, direction: 'up' | 'down') {
    const idx = faqs.findIndex((f) => f.id === id)
    if (idx < 0) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= faqs.length) return
    const a = faqs[idx]
    const b = faqs[swapIdx]
    await Promise.all([
      supabase.from('faq_items').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('faq_items').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    load()
  }

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex items-center justify-between">
        <p className="text-sm text-cocoa/60 font-body">{faqs.length} FAQ{faqs.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 transition-colors"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add FAQ
        </button>
      </div>

      {showAddForm && (
        <div className="border border-admin-border rounded-card p-4 space-y-3 bg-ivory/30">
          <h3 className="text-sm font-semibold text-cocoa font-body">New FAQ</h3>
          <div>
            <label htmlFor="faq-question" className={labelClass()}>Question</label>
            <input id="faq-question" type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="e.g. What is your return policy?" className={inputClass()} />
          </div>
          <div>
            <label htmlFor="faq-answer" className={labelClass()}>Answer</label>
            <textarea id="faq-answer" rows={3} value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="Write the answer here..." className={`${inputClass()} resize-y`} />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button onClick={addFaq} disabled={saving || !newQuestion.trim() || !newAnswer.trim()} className="px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : 'Save FAQ'}
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-cocoa/50 hover:text-cocoa font-body transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-cocoa/40 font-body py-8 text-center">Loading FAQs…</p>
      ) : faqs.length === 0 ? (
        <p className="text-sm text-cocoa/40 font-body py-8 text-center">No FAQs yet.</p>
      ) : (
        <ul className="space-y-2">
          {faqs.map((faq, idx) => (
            <li key={faq.id} className="rounded-card border border-admin-border bg-white">
              {editingId === faq.id ? (
                <div className="p-4 space-y-3">
                  <div>
                    <label htmlFor={`edit-q-${faq.id}`} className={labelClass()}>Question</label>
                    <input id={`edit-q-${faq.id}`} type="text" value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} className={inputClass()} />
                  </div>
                  <div>
                    <label htmlFor={`edit-a-${faq.id}`} className={labelClass()}>Answer</label>
                    <textarea id={`edit-a-${faq.id}`} rows={3} value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} className={`${inputClass()} resize-y`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => saveEdit(faq.id)} disabled={saving} className="px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 transition-colors disabled:opacity-50">
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-cocoa/50 hover:text-cocoa font-body transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4">
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => moveOrder(faq.id, 'up')}
                      disabled={idx === 0}
                      className="w-6 h-6 flex items-center justify-center text-cocoa/40 hover:text-cocoa disabled:opacity-20 transition-colors"
                      aria-label="Move up"
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
                    </button>
                    <button
                      onClick={() => moveOrder(faq.id, 'down')}
                      disabled={idx === faqs.length - 1}
                      className="w-6 h-6 flex items-center justify-center text-cocoa/40 hover:text-cocoa disabled:opacity-20 transition-colors"
                      aria-label="Move down"
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-cocoa font-body">{faq.question}</p>
                    <p className="text-sm text-cocoa/60 font-body mt-1">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(faq)}
                      className="text-xs text-gold-accessible hover:text-gold font-body font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="text-xs text-error/60 hover:text-error font-body transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Tab 5 — Notifications ────────────────────────────────────────────────────

function NotificationsTab() {
  const [logs, setLogs] = useState<WhatsappLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase
        .from('whatsapp_logs')
        .select('id, template_name, phone, status, created_at')
        .order('created_at', { ascending: false })
        .limit(20)
      setIsLoading(false)
      if (err) { setError(err.message); return }
      setLogs(data ?? [])
    }
    load()
  }, [])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const statusStyles: Record<WhatsappLog['status'], string> = {
    sent: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    queued: 'bg-admin-border/40 text-cocoa/60 border-admin-border',
  }

  return (
    <div>
      {error && <ErrorBanner message={error} />}
      <div className="bg-white rounded-card border border-admin-border overflow-x-auto mt-4">
        <table className="w-full text-sm" aria-label="WhatsApp notification logs">
          <thead>
            <tr className="border-b border-admin-border">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Template</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Recipient</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Sent at</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-cocoa/40 font-body">Loading logs…</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-cocoa/40 font-body">No notification logs yet.</td></tr>
            ) : (
              logs.map((log, i) => (
                <tr key={log.id} className={`border-b border-admin-border/50 ${i % 2 === 1 ? 'bg-parchment/40' : ''}`}>
                  <td className="px-5 py-3.5 font-body text-cocoa font-mono text-xs">{log.template_name}</td>
                  <td className="px-5 py-3.5 font-body text-cocoa/70">{log.phone}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[log.status]}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-body text-cocoa/60 text-xs whitespace-nowrap">{formatDate(log.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Root page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('store')
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  async function loadSettings() {
    const { data } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single()
    setSettings(data as StoreSettings | null)
    setIsLoadingSettings(false)
  }

  useEffect(() => { loadSettings() }, [])

  return (
    <section aria-labelledby="settings-heading" className="max-w-3xl">
      <h2 id="settings-heading" className="sr-only">Settings</h2>

      {/* Tab bar */}
      <div
        className="flex flex-wrap gap-1 mb-6 bg-admin-border/30 p-1 rounded-card w-fit"
        role="tablist"
        aria-label="Settings sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium font-body rounded transition-colors ${
              activeTab === tab.id
                ? 'bg-parchment text-cocoa shadow-card'
                : 'text-cocoa/50 hover:text-cocoa'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {TABS.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="bg-parchment rounded-card shadow-card border border-admin-border p-6"
        >
          {activeTab === tab.id && (
            <>
              {tab.id === 'store' && (
                isLoadingSettings
                  ? <p className="text-sm text-cocoa/40 font-body py-8 text-center">Loading…</p>
                  : <StoreInfoTab settings={settings} reload={loadSettings} />
              )}
              {tab.id === 'shipping' && (
                isLoadingSettings
                  ? <p className="text-sm text-cocoa/40 font-body py-8 text-center">Loading…</p>
                  : <ShippingTab settings={settings} reload={loadSettings} />
              )}
              {tab.id === 'announcements' && <AnnouncementsTab />}
              {tab.id === 'faqs' && <FaqsTab />}
              {tab.id === 'notifications' && <NotificationsTab />}
            </>
          )}
        </div>
      ))}
    </section>
  )
}
