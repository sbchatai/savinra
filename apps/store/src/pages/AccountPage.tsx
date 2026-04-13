import { useState } from 'react'
import AccountSidebar from '@/components/account/AccountSidebar'
import { Edit3, MapPin, LogOut } from 'lucide-react'

export default function AccountPage() {
  const [name, setName] = useState('Priya Sharma')
  const [email, setEmail] = useState('priya.sharma@email.com')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [editingField, setEditingField] = useState<string | null>(null)
  const [whatsapp, setWhatsapp] = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)

  const ProfileField = ({ label, value, field, onChange }: { label: string; value: string; field: string; onChange: (v: string) => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-ivory">
      <div>
        <p className="font-body text-xs text-cocoa/50 mb-0.5">{label}</p>
        {editingField === field ? (
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            onBlur={() => setEditingField(null)}
            autoFocus
            className="font-body text-sm text-cocoa bg-ivory border border-gold-accessible rounded-card px-2 py-1 focus:outline-none"
          />
        ) : (
          <p className="font-body text-sm text-cocoa">{value}</p>
        )}
      </div>
      <button
        onClick={() => setEditingField(editingField === field ? null : field)}
        className="text-gold-accessible hover:text-cocoa transition-colors p-1"
      >
        <Edit3 size={14} />
      </button>
    </div>
  )

  const Toggle = ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className="font-body text-sm text-cocoa">{label}</span>
      <button
        onClick={onToggle}
        className={`w-10 h-6 rounded-full transition-colors relative ${enabled ? 'bg-gold-accessible' : 'bg-cocoa/20'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        <AccountSidebar />
        <div className="flex-1 max-w-2xl">
          <h1 className="font-heading text-3xl font-semibold text-cocoa mb-8">My Profile</h1>

          {/* Profile */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-6">
            <h2 className="font-heading text-lg font-semibold text-cocoa mb-4">Personal Information</h2>
            <ProfileField label="Full Name" value={name} field="name" onChange={setName} />
            <ProfileField label="Email" value={email} field="email" onChange={setEmail} />
            <ProfileField label="Phone" value={phone} field="phone" onChange={setPhone} />
          </div>

          {/* Addresses */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-cocoa">Saved Addresses</h2>
              <button className="text-gold-accessible font-body text-xs font-medium hover:underline">
                + Add New
              </button>
            </div>
            <div className="border border-gold/30 rounded-card p-4 flex items-start gap-3">
              <MapPin size={18} className="text-gold-accessible shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-sm font-medium text-cocoa">Home</p>
                <p className="font-body text-sm text-cocoa/70">12, Green Park Extension, New Delhi &mdash; 110016</p>
                <p className="font-body text-xs text-cocoa/50 mt-1">Priya Sharma &middot; +91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* Communication */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-6">
            <h2 className="font-heading text-lg font-semibold text-cocoa mb-4">Communication Preferences</h2>
            <Toggle enabled={whatsapp} onToggle={() => setWhatsapp(!whatsapp)} label="WhatsApp order updates" />
            <Toggle enabled={emailNotif} onToggle={() => setEmailNotif(!emailNotif)} label="Email newsletter & offers" />
          </div>

          {/* Change password */}
          <div className="bg-ivory rounded-card p-6 shadow-card mb-6">
            <h2 className="font-heading text-lg font-semibold text-cocoa mb-4">Security</h2>
            <button className="text-gold-accessible font-body text-sm font-medium hover:underline">
              Change Password
            </button>
          </div>

          {/* Sign out */}
          <button className="flex items-center gap-2 text-error font-body text-sm font-medium hover:underline">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
