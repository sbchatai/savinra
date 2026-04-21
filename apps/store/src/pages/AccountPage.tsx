import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit3, MapPin, LogOut, Plus, X, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import AccountSidebar from '@/components/account/AccountSidebar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Address {
  id: string
  customer_id: string
  label: string
  full_name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  is_default: boolean
}

const INDIAN_STATES = [
  'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal',
  'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'Kerala', 'Telangana',
  'Punjab', 'Haryana', 'Madhya Pradesh', 'Bihar', 'Odisha',
  'Assam', 'Jharkhand', 'Uttarakhand', 'Himachal Pradesh', 'Goa',
  'Chhattisgarh', 'Jammu & Kashmir', 'Tripura', 'Meghalaya',
  'Manipur', 'Nagaland', 'Arunachal Pradesh', 'Mizoram', 'Sikkim',
]

const EMPTY_ADDRESS_FORM = {
  label: 'Home',
  full_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({
  enabled,
  onToggle,
  label,
  disabled = false,
}: {
  enabled: boolean
  onToggle: () => void
  label: string
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="font-body text-sm text-cocoa">{label}</span>
      <button
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={enabled}
        aria-label={label}
        className={cn(
          'w-10 h-6 rounded-full transition-colors relative disabled:opacity-50',
          enabled ? 'bg-gold-accessible' : 'bg-cocoa/20',
        )}
      >
        <div
          className={cn(
            'w-4 h-4 rounded-full bg-white absolute top-1 transition-transform',
            enabled ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const { user, customer, signOut } = useAuth()
  const navigate = useNavigate()

  // ── Profile state ─────────────────────────────────────────────────────────
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [editingField, setEditingField] = useState<'name' | 'phone' | null>(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileDirty, setProfileDirty] = useState(false)

  // ── Address state ─────────────────────────────────────────────────────────
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addrLoading, setAddrLoading] = useState(true)
  const [addrError, setAddrError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addrForm, setAddrForm] = useState(EMPTY_ADDRESS_FORM)
  const [addrSaving, setAddrSaving] = useState(false)
  const [addrFormError, setAddrFormError] = useState<string | null>(null)

  // ── Comm-prefs state ──────────────────────────────────────────────────────
  const [whatsapp, setWhatsapp] = useState(false)
  const [emailNotif, setEmailNotif] = useState(false)
  const [prefsSaving, setPrefsSaving] = useState(false)

  // ── Sync profile from customer ────────────────────────────────────────────
  useEffect(() => {
    if (!customer) return
    setName(customer.full_name ?? '')
    setPhone(customer.phone ?? '')
    setWhatsapp(customer.whatsapp_opted_in)
    setEmailNotif(customer.email_opted_in)
    setProfileDirty(false)
  }, [customer])

  // ── Fetch addresses ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    fetchAddresses()
  }, [user])

  async function fetchAddresses() {
    if (!user) return
    setAddrLoading(true)
    setAddrError(null)
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('customer_id', user.id)
      .order('is_default', { ascending: false })
    if (error) {
      setAddrError('Could not load addresses. Please refresh.')
    } else {
      setAddresses((data ?? []) as Address[])
    }
    setAddrLoading(false)
  }

  // ── Profile handlers ──────────────────────────────────────────────────────
  function handleNameChange(v: string) {
    setName(v)
    setProfileDirty(true)
  }

  function handlePhoneChange(v: string) {
    setPhone(v)
    setProfileDirty(true)
  }

  async function saveProfile() {
    if (!user) return
    setProfileSaving(true)
    setProfileError(null)
    setProfileSuccess(false)
    const { error } = await supabase
      .from('customers')
      .update({ full_name: name, phone })
      .eq('id', user.id)
    if (error) {
      setProfileError('Failed to save. Please try again.')
    } else {
      setProfileSuccess(true)
      setProfileDirty(false)
      setEditingField(null)
      setTimeout(() => setProfileSuccess(false), 3000)
    }
    setProfileSaving(false)
  }

  // ── Address handlers ──────────────────────────────────────────────────────
  async function setDefaultAddress(addrId: string) {
    if (!user) return
    // Optimistic UI: mark default locally first
    setAddresses(prev =>
      prev.map(a => ({ ...a, is_default: a.id === addrId })),
    )
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addrId)
    if (error) {
      // Revert on failure
      await fetchAddresses()
    }
  }

  async function deleteAddress(addrId: string) {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addrId)
    if (!error) {
      await fetchAddresses()
    }
  }

  function updateAddrForm(field: string, val: string) {
    setAddrForm(f => ({ ...f, [field]: val }))
  }

  async function saveNewAddress() {
    if (!user) return
    const required = ['full_name', 'phone', 'line1', 'city', 'state', 'pincode'] as const
    for (const key of required) {
      if (!addrForm[key].trim()) {
        setAddrFormError(`Please fill in all required fields.`)
        return
      }
    }
    if (!/^\d{6}$/.test(addrForm.pincode)) {
      setAddrFormError('PIN code must be 6 digits.')
      return
    }

    setAddrSaving(true)
    setAddrFormError(null)
    const { error } = await supabase.from('addresses').insert({
      customer_id: user.id,
      label: addrForm.label,
      full_name: addrForm.full_name,
      phone: addrForm.phone,
      line1: addrForm.line1,
      line2: addrForm.line2 || null,
      city: addrForm.city,
      state: addrForm.state,
      pincode: addrForm.pincode,
      is_default: addresses.length === 0,
    })
    if (error) {
      setAddrFormError('Failed to save address. Please try again.')
    } else {
      setShowAddForm(false)
      setAddrForm(EMPTY_ADDRESS_FORM)
      await fetchAddresses()
    }
    setAddrSaving(false)
  }

  // ── Comm-pref handlers ────────────────────────────────────────────────────
  async function toggleWhatsapp() {
    if (!user || prefsSaving) return
    const next = !whatsapp
    setWhatsapp(next)
    setPrefsSaving(true)
    const { error } = await supabase
      .from('customers')
      .update({ whatsapp_opted_in: next })
      .eq('id', user.id)
    if (error) setWhatsapp(!next) // revert
    setPrefsSaving(false)
  }

  async function toggleEmailNotif() {
    if (!user || prefsSaving) return
    const next = !emailNotif
    setEmailNotif(next)
    setPrefsSaving(true)
    const { error } = await supabase
      .from('customers')
      .update({ email_opted_in: next })
      .eq('id', user.id)
    if (error) setEmailNotif(!next) // revert
    setPrefsSaving(false)
  }

  // ── Sign-out ──────────────────────────────────────────────────────────────
  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const inputCls =
    'font-body text-sm text-cocoa bg-ivory border border-gold-accessible rounded-card px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gold-accessible'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        <AccountSidebar />
        <div className="flex-1 max-w-2xl">
          <h1 className="font-heading text-3xl font-semibold text-cocoa mb-8">My Profile</h1>

          {/* ── Personal Information ─────────────────────────────────────── */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-6">
            <h2 className="font-heading text-lg font-semibold text-cocoa mb-4">
              Personal Information
            </h2>

            {/* Name */}
            <div className="flex items-center justify-between py-3 border-b border-ivory">
              <div className="flex-1 min-w-0 mr-3">
                <p className="font-body text-xs text-cocoa/50 mb-0.5">Full Name</p>
                {editingField === 'name' ? (
                  <input
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    autoFocus
                    aria-label="Full name"
                    className={inputCls}
                  />
                ) : (
                  <p className="font-body text-sm text-cocoa">{name || '—'}</p>
                )}
              </div>
              <button
                onClick={() => setEditingField(editingField === 'name' ? null : 'name')}
                aria-label="Edit full name"
                className="text-gold-accessible hover:text-cocoa transition-colors p-1 shrink-0"
              >
                <Edit3 size={14} />
              </button>
            </div>

            {/* Email — read-only */}
            <div className="flex items-start justify-between py-3 border-b border-ivory">
              <div>
                <p className="font-body text-xs text-cocoa/50 mb-0.5">Email</p>
                <p className="font-body text-sm text-cocoa">{customer?.email ?? user?.email ?? '—'}</p>
                <p className="font-body text-xs text-cocoa/40 mt-0.5">(contact support to change)</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between py-3">
              <div className="flex-1 min-w-0 mr-3">
                <p className="font-body text-xs text-cocoa/50 mb-0.5">Phone</p>
                {editingField === 'phone' ? (
                  <input
                    value={phone}
                    onChange={e => handlePhoneChange(e.target.value)}
                    autoFocus
                    type="tel"
                    aria-label="Phone number"
                    className={inputCls}
                  />
                ) : (
                  <p className="font-body text-sm text-cocoa">{phone || '—'}</p>
                )}
              </div>
              <button
                onClick={() => setEditingField(editingField === 'phone' ? null : 'phone')}
                aria-label="Edit phone number"
                className="text-gold-accessible hover:text-cocoa transition-colors p-1 shrink-0"
              >
                <Edit3 size={14} />
              </button>
            </div>

            {/* Save / feedback row */}
            {profileDirty && (
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-ivory">
                <button
                  onClick={saveProfile}
                  disabled={profileSaving}
                  className="bg-gold-accessible text-white font-body text-sm font-medium px-5 py-1.5 rounded-pill hover:bg-cocoa transition-colors disabled:opacity-60"
                >
                  {profileSaving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setName(customer?.full_name ?? '')
                    setPhone(customer?.phone ?? '')
                    setProfileDirty(false)
                    setEditingField(null)
                  }}
                  className="font-body text-sm text-cocoa/50 hover:text-cocoa transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            {profileSuccess && (
              <p className="flex items-center gap-1.5 font-body text-xs text-success mt-2">
                <Check size={13} /> Profile updated
              </p>
            )}
            {profileError && (
              <p className="font-body text-xs text-error mt-2">{profileError}</p>
            )}
          </div>

          {/* ── Saved Addresses ──────────────────────────────────────────── */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-cocoa">Saved Addresses</h2>
              <button
                onClick={() => {
                  setShowAddForm(v => !v)
                  setAddrFormError(null)
                }}
                className="flex items-center gap-1 text-gold-accessible font-body text-xs font-medium hover:underline"
              >
                <Plus size={13} />
                {showAddForm ? 'Cancel' : 'Add New'}
              </button>
            </div>

            {addrLoading && (
              <p className="font-body text-sm text-cocoa/50">Loading addresses…</p>
            )}
            {addrError && (
              <p className="font-body text-xs text-error mb-3">{addrError}</p>
            )}

            {!addrLoading && addresses.length === 0 && !showAddForm && (
              <p className="font-body text-sm text-cocoa/50">No saved addresses yet.</p>
            )}

            {/* Address cards */}
            <div className="flex flex-col gap-3">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className={cn(
                    'border rounded-card p-4 flex items-start gap-3',
                    addr.is_default ? 'border-gold-accessible' : 'border-gold/30',
                  )}
                >
                  <MapPin size={18} className="text-gold-accessible shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-body text-sm font-medium text-cocoa">{addr.label}</p>
                      {addr.is_default && (
                        <span className="font-body text-[10px] bg-gold-accessible/10 text-gold-accessible px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-cocoa/70">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city} — {addr.pincode}
                    </p>
                    <p className="font-body text-xs text-cocoa/50 mt-0.5">
                      {addr.full_name} &middot; {addr.phone}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      {!addr.is_default && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="font-body text-xs text-gold-accessible hover:underline"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="font-body text-xs text-error hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new address inline form */}
            {showAddForm && (
              <div className="mt-4 border border-gold/30 rounded-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-heading text-sm font-semibold text-cocoa">New Address</p>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setAddrForm(EMPTY_ADDRESS_FORM)
                      setAddrFormError(null)
                    }}
                    aria-label="Close address form"
                    className="text-cocoa/40 hover:text-cocoa transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Label */}
                  <div>
                    <label className="font-body text-xs text-cocoa/60 mb-1 block">Label</label>
                    <select
                      value={addrForm.label}
                      onChange={e => updateAddrForm('label', e.target.value)}
                      className="w-full px-3 py-2 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible appearance-none"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Full name + Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-body text-xs text-cocoa/60 mb-1 block">
                        Full Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={addrForm.full_name}
                        onChange={e => updateAddrForm('full_name', e.target.value)}
                        placeholder="Priya Sharma"
                        className="w-full px-3 py-2 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-cocoa/60 mb-1 block">
                        Phone <span className="text-error">*</span>
                      </label>
                      <input
                        type="tel"
                        value={addrForm.phone}
                        onChange={e => updateAddrForm('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible"
                      />
                    </div>
                  </div>

                  {/* Line 1 */}
                  <div>
                    <label className="font-body text-xs text-cocoa/60 mb-1 block">
                      Address Line 1 <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={addrForm.line1}
                      onChange={e => updateAddrForm('line1', e.target.value)}
                      placeholder="Flat/House No., Building, Street"
                      className="w-full px-3 py-2 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible"
                    />
                  </div>

                  {/* Line 2 */}
                  <div>
                    <label className="font-body text-xs text-cocoa/60 mb-1 block">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={addrForm.line2}
                      onChange={e => updateAddrForm('line2', e.target.value)}
                      placeholder="Area, Landmark"
                      className="w-full px-3 py-2 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible"
                    />
                  </div>

                  {/* City + State */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-body text-xs text-cocoa/60 mb-1 block">
                        City <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={addrForm.city}
                        onChange={e => updateAddrForm('city', e.target.value)}
                        placeholder="New Delhi"
                        className="w-full px-3 py-2 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-cocoa/60 mb-1 block">
                        State <span className="text-error">*</span>
                      </label>
                      <select
                        value={addrForm.state}
                        onChange={e => updateAddrForm('state', e.target.value)}
                        className="w-full px-3 py-2 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible appearance-none"
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="font-body text-xs text-cocoa/60 mb-1 block">
                      PIN Code <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={addrForm.pincode}
                      onChange={e => updateAddrForm('pincode', e.target.value.replace(/\D/g, ''))}
                      placeholder="110001"
                      className="w-full px-3 py-2 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-card focus:outline-none focus:border-gold-accessible"
                    />
                  </div>
                </div>

                {addrFormError && (
                  <p className="font-body text-xs text-error mt-2">{addrFormError}</p>
                )}

                <button
                  onClick={saveNewAddress}
                  disabled={addrSaving}
                  className="mt-4 w-full bg-gold-accessible text-white font-body text-sm font-medium py-2.5 rounded-pill hover:bg-cocoa transition-colors disabled:opacity-60"
                >
                  {addrSaving ? 'Saving…' : 'Save Address'}
                </button>
              </div>
            )}
          </div>

          {/* ── Communication Preferences ────────────────────────────────── */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-6">
            <h2 className="font-heading text-lg font-semibold text-cocoa mb-4">
              Communication Preferences
            </h2>
            <Toggle
              enabled={whatsapp}
              onToggle={toggleWhatsapp}
              label="WhatsApp order updates"
              disabled={prefsSaving}
            />
            <Toggle
              enabled={emailNotif}
              onToggle={toggleEmailNotif}
              label="Email newsletter & offers"
              disabled={prefsSaving}
            />
          </div>

          {/* ── Security ─────────────────────────────────────────────────── */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-6">
            <h2 className="font-heading text-lg font-semibold text-cocoa mb-4">Security</h2>
            <button className="text-gold-accessible font-body text-sm font-medium hover:underline">
              Change Password
            </button>
          </div>

          {/* ── Sign out ──────────────────────────────────────────────────── */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-error font-body text-sm font-medium hover:underline"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
