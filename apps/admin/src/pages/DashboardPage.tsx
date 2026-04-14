import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

interface StatCard {
  label: string
  value: string | number
  description: string
  color: string
}

interface RecentOrder {
  id: string
  order_number: string
  customer_name: string
  status: string
  total: number
  created_at: string
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
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    ordersToday: 0,
    revenueToday: 0,
    pendingOrders: 0,
    lowStock: 0,
  })

  useEffect(() => {
    async function loadDashboard() {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Fetch recent orders
        const { data: recentOrders } = await supabase
          .from('orders')
          .select('id, order_number, status, total, created_at, customer_id')
          .order('created_at', { ascending: false })
          .limit(10)

        // Fetch today's orders for stats
        const { data: todayOrders } = await supabase
          .from('orders')
          .select('total, status')
          .gte('created_at', today.toISOString())

        // Fetch pending orders count
        const { count: pendingCount } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending')

        // Fetch low stock variants (stock_count 1–5)
        const { count: lowStockCount } = await supabase
          .from('product_variants')
          .select('id', { count: 'exact', head: true })
          .lte('stock_count', 5)
          .gt('stock_count', 0)

        const todayRevenue = (todayOrders ?? [])
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.total ?? 0), 0)

        setStats({
          ordersToday: todayOrders?.length ?? 0,
          revenueToday: todayRevenue,
          pendingOrders: pendingCount ?? 0,
          lowStock: lowStockCount ?? 0,
        })

        // Map recent orders with placeholder customer name
        setOrders(
          (recentOrders ?? []).map((o) => ({
            id: o.id,
            order_number: o.order_number ?? o.id.slice(0, 8).toUpperCase(),
            customer_name: '—',
            status: o.status,
            total: o.total,
            created_at: o.created_at,
          }))
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const statCards: StatCard[] = [
    {
      label: 'Orders Today',
      value: stats.ordersToday,
      description: 'New orders placed today',
      color: 'border-l-info',
    },
    {
      label: 'Revenue Today',
      value: formatINR(stats.revenueToday),
      description: 'Gross revenue, excl. cancelled',
      color: 'border-l-success',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      description: 'Awaiting confirmation',
      color: 'border-l-warning',
    },
    {
      label: 'Low Stock',
      value: stats.lowStock,
      description: 'Variants with 5 or fewer units',
      color: 'border-l-error',
    },
  ]

  return (
    <section aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" className="sr-only">Dashboard overview</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-parchment rounded-card shadow-card border border-admin-border border-l-4 ${card.color} p-5 animate-fade-up`}
          >
            <p className="text-xs font-medium text-cocoa/50 font-body uppercase tracking-wider mb-1">
              {card.label}
            </p>
            {isLoading ? (
              <div className="skeleton h-7 w-24 rounded mb-1" />
            ) : (
              <p className="text-2xl font-semibold text-cocoa font-heading">{card.value}</p>
            )}
            <p className="text-xs text-cocoa/40 font-body mt-1">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Recent orders table */}
      <div className="bg-parchment rounded-card shadow-card border border-admin-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <h3 className="font-heading text-lg font-medium text-cocoa">Recent Orders</h3>
          <Link
            to="/orders"
            className="text-sm text-gold-accessible hover:text-gold font-body font-medium transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Recent orders">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="text-left px-6 py-3 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">
                  Order #
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">
                  Total
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">
                  Date
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-cocoa/40 font-body">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-cocoa/40 font-body">
                    No orders yet.
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
