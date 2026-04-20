import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, assertSupabase } from '@/lib/supabase'

// Guard: prevent runtime crash when Supabase env vars are missing


interface Order {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  customer_name: string
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true)
      try {
        let query = supabase
          .from('orders')
          .select('id, order_number, status, total, created_at, customer_id')
          .order('created_at', { ascending: false })
          .limit(100)

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter)
        }

        const { data } = await query

        setOrders(
          (data ?? []).map((o) => ({
            id: o.id,
            order_number: o.order_number ?? o.id.slice(0, 8).toUpperCase(),
            status: o.status,
            total: o.total,
            created_at: o.created_at,
            customer_name: '—',
          }))
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [statusFilter])

  const statuses = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

  return (
    <section aria-labelledby="orders-heading">
      <h2 id="orders-heading" className="sr-only">Orders</h2>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-pill border capitalize transition-colors font-body ${
              statusFilter === s
                ? 'bg-cocoa text-parchment border-cocoa'
                : 'bg-parchment text-cocoa/60 border-admin-border hover:border-cocoa/30'
            }`}
          >
            {s === 'all' ? 'All orders' : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-parchment rounded-card shadow-card border border-admin-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Orders table">
            <thead>
              <tr className="border-b border-admin-border">
                {['Order #', 'Customer', 'Status', 'Total', 'Date', 'Actions'].map((col) => (
                  <th
                    key={col}
                    className={`px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body ${
                      col === 'Total' || col === 'Actions' ? 'text-right' : 'text-left'
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
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-cocoa/40 font-body">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-admin-border/50 hover:bg-ivory/40 transition-colors ${
                      i % 2 === 1 ? 'bg-parchment/60' : ''
                    }`}
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-cocoa font-medium">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-3.5 text-cocoa/70 font-body">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${
                          STATUS_BADGE[order.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-body text-cocoa">
                      {formatINR(order.total)}
                    </td>
                    <td className="px-6 py-3.5 text-cocoa/50 font-body">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-xs text-gold-accessible hover:text-gold font-body font-medium transition-colors"
                        aria-label={`View order #${order.order_number}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
