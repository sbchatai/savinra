import { useEffect, useState } from 'react'
import { supabase, assertSupabase } from '@/lib/supabase'

// Guard: prevent runtime crash when Supabase env vars are missing


interface Customer {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  total_orders: number
  total_spent: number
  created_at: string
}

function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    setIsLoading(true)
    try {
      const { data } = await supabase
        .from('customers')
        .select('id, full_name, email, phone, total_orders, total_spent, created_at')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(200)

      setCustomers(data ?? [])
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      (c.full_name ?? '').toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q)
    )
  })

  return (
    <section aria-labelledby="customers-heading">
      <h2 id="customers-heading" className="sr-only">Customers</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 text-sm border border-admin-border rounded text-cocoa bg-parchment placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body w-80"
          aria-label="Search customers"
        />
      </div>

      {/* Table */}
      <div className="bg-parchment rounded-card shadow-card border border-admin-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Customers table">
            <thead>
              <tr className="border-b border-admin-border">
                {['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined'].map((col) => (
                  <th
                    key={col}
                    className={`px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body ${
                      col === 'Orders' || col === 'Total Spent' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-cocoa/40 font-body">
                    Loading customers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-cocoa/40 font-body">
                    {searchQuery ? 'No customers match your search.' : 'No customers yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((customer, i) => (
                  <tr
                    key={customer.id}
                    className={`border-b border-admin-border/50 hover:bg-ivory/40 transition-colors ${
                      i % 2 === 1 ? 'bg-parchment/60' : ''
                    }`}
                  >
                    <td className="px-6 py-3.5 font-body">
                      <p className="font-medium text-cocoa">{customer.full_name ?? '—'}</p>
                    </td>
                    <td className="px-6 py-3.5 text-cocoa/70 font-body text-sm">
                      {customer.email}
                    </td>
                    <td className="px-6 py-3.5 text-cocoa/60 font-body text-sm">
                      {customer.phone ?? '—'}
                    </td>
                    <td className="px-6 py-3.5 text-right text-cocoa font-body">
                      {customer.total_orders}
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium text-cocoa font-body">
                      {formatINR(customer.total_spent)}
                    </td>
                    <td className="px-6 py-3.5 text-cocoa/50 font-body">
                      {formatDate(customer.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-admin-border">
            <p className="text-xs text-cocoa/40 font-body">
              Showing {filtered.length} of {customers.length} customers
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
