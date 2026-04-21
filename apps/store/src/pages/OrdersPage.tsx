import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { formatPrice } from '@/lib/utils'
import AccountSidebar from '@/components/account/AccountSidebar'
import { Package, ChevronRight } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gold/20 text-gold-accessible',
  confirmed: 'bg-info/10 text-info',
  processing: 'bg-info text-white',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-success text-white',
  cancelled: 'bg-error text-white',
}

interface OrderItem {
  product_name: string
  variant_size: string | null
  image_url: string | null
}

interface Order {
  id: string
  order_number: string
  created_at: string
  status: string
  total: number
  order_items: OrderItem[]
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    async function fetchOrders() {
      setIsLoading(true)
      setFetchError(null)

      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, created_at, status, total, order_items(product_name, variant_size, image_url)')
        .eq('customer_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) {
        setFetchError('Could not load your orders. Please try again.')
      } else {
        setOrders((data ?? []) as Order[])
      }

      setIsLoading(false)
    }

    fetchOrders()
  }, [user])

  function formatOrderDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-semibold text-cocoa mb-8">My Orders</h1>

          {isLoading && (
            <div className="space-y-4" aria-label="Loading orders" aria-busy="true">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-ivory rounded-card p-5 shadow-card animate-pulse"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-cocoa/10 rounded" />
                      <div className="h-3 w-24 bg-cocoa/10 rounded" />
                    </div>
                    <div className="h-6 w-20 bg-cocoa/10 rounded-pill" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-[72px] bg-cocoa/10 rounded-card shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-40 bg-cocoa/10 rounded" />
                    </div>
                    <div className="h-6 w-20 bg-cocoa/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && fetchError && (
            <div className="text-center py-16">
              <p className="font-body text-sm text-error mb-4">{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-gold-accessible font-body text-sm font-medium hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !fetchError && orders.length === 0 && (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-cocoa/20 mb-4" />
              <p className="font-heading text-xl text-cocoa mb-2">No orders yet</p>
              <Link to="/shop" className="text-gold-accessible font-body text-sm font-medium hover:underline">
                Start shopping
              </Link>
            </div>
          )}

          {!isLoading && !fetchError && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Link
                    to={`/orders/${order.id}`}
                    className="block bg-ivory rounded-card p-5 shadow-card hover:shadow-card-hover transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-body text-sm font-medium text-cocoa">{order.order_number}</p>
                        <p className="font-body text-xs text-cocoa/50">{formatOrderDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-body font-medium px-3 py-1 rounded-pill capitalize ${
                            STATUS_STYLES[order.status] ?? 'bg-cocoa/10 text-cocoa'
                          }`}
                        >
                          {order.status}
                        </span>
                        <ChevronRight size={16} className="text-cocoa/30" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.order_items.map((item, i) => (
                        <img
                          key={i}
                          src={item.image_url ?? '/savinra-logo.svg'}
                          alt={item.product_name}
                          width={56}
                          height={72}
                          className="w-14 h-[72px] object-cover rounded-card shrink-0"
                        />
                      ))}
                      <div className="flex-1 ml-2">
                        {order.order_items.map((item, i) => (
                          <p key={i} className="font-body text-sm text-cocoa">
                            {item.product_name}
                            {item.variant_size ? ` \u00b7 ${item.variant_size}` : ''}
                          </p>
                        ))}
                      </div>
                      <p className="font-heading text-lg font-medium text-cocoa">
                        {formatPrice(order.total / 100)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
