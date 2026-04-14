import React, { useState } from 'react'

type TabId = 'store' | 'shipping' | 'payments'

const TABS: { id: TabId; label: string }[] = [
  { id: 'store', label: 'Store Info' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payments', label: 'Payments' },
]

function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  defaultValue,
  hint,
}: {
  id: string
  label: string
  type?: string
  placeholder?: string
  defaultValue?: string
  hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body"
      />
      {hint && <p className="mt-1 text-xs text-cocoa/40 font-body">{hint}</p>}
    </div>
  )
}

function StoreInfoTab() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <FormField
        id="store-name"
        label="Store name"
        defaultValue="SAVINRA"
        placeholder="Your store name"
      />
      <FormField
        id="store-email"
        label="Support email"
        type="email"
        placeholder="support@savinra.com"
        hint="Displayed on order confirmations and invoices."
      />
      <FormField
        id="store-phone"
        label="Support phone"
        type="tel"
        placeholder="+91 98765 43210"
      />
      <div>
        <label htmlFor="store-address" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
          Business address
        </label>
        <textarea
          id="store-address"
          rows={3}
          className="w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body resize-y"
          placeholder="Full registered address..."
        />
      </div>
      <FormField
        id="store-gstin"
        label="GSTIN"
        placeholder="22AAAAA0000A1Z5"
        hint="Required for GST invoices."
      />
      <div className="pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-cocoa text-parchment text-sm font-medium font-body rounded-pill hover:bg-cocoa/80 transition-colors"
        >
          Save Store Info
        </button>
      </div>
    </form>
  )
}

function ShippingTab() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <FormField
        id="shipping-free-threshold"
        label="Free shipping threshold (INR)"
        type="number"
        defaultValue="999"
        hint="Orders above this amount qualify for free shipping."
      />
      <FormField
        id="shipping-flat-rate"
        label="Flat shipping rate (INR)"
        type="number"
        defaultValue="99"
        hint="Applied to orders below the free shipping threshold."
      />
      <FormField
        id="shipping-cod-charge"
        label="COD handling charge (INR)"
        type="number"
        defaultValue="49"
        hint="Additional fee for cash-on-delivery orders."
      />
      <div>
        <label htmlFor="shipping-zones" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
          Serviceable states
        </label>
        <textarea
          id="shipping-zones"
          rows={3}
          className="w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body resize-y"
          placeholder="Enter comma-separated state names..."
        />
        <p className="mt-1 text-xs text-cocoa/40 font-body">Leave blank to ship pan-India.</p>
      </div>
      <div className="pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-cocoa text-parchment text-sm font-medium font-body rounded-pill hover:bg-cocoa/80 transition-colors"
        >
          Save Shipping Settings
        </button>
      </div>
    </form>
  )
}

function PaymentsTab() {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-4">
        <h3 className="font-heading text-base font-medium text-cocoa">Razorpay</h3>
        <FormField
          id="razorpay-key-id"
          label="Key ID"
          placeholder="rzp_live_..."
          hint="Razorpay dashboard → API Keys."
        />
        <div>
          <label htmlFor="razorpay-key-secret" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
            Key secret
          </label>
          <input
            id="razorpay-key-secret"
            type="password"
            placeholder="••••••••••••••••"
            className="w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body"
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-cocoa/40 font-body">
            Stored securely. Never displayed after saving.
          </p>
        </div>
      </div>

      <div className="border-t border-admin-border pt-4 space-y-3">
        <h3 className="font-heading text-base font-medium text-cocoa">Cash on Delivery</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 rounded border-admin-border text-gold focus:ring-gold/40"
          />
          <span className="text-sm text-cocoa font-body">Enable COD for all orders</span>
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-cocoa text-parchment text-sm font-medium font-body rounded-pill hover:bg-cocoa/80 transition-colors"
        >
          Save Payment Settings
        </button>
      </div>
    </form>
  )
}

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  store: <StoreInfoTab />,
  shipping: <ShippingTab />,
  payments: <PaymentsTab />,
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('store')

  return (
    <section aria-labelledby="settings-heading" className="max-w-2xl">
      <h2 id="settings-heading" className="sr-only">Settings</h2>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 bg-admin-border/30 p-1 rounded-card w-fit"
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
          {activeTab === tab.id && TAB_CONTENT[tab.id]}
        </div>
      ))}
    </section>
  )
}
