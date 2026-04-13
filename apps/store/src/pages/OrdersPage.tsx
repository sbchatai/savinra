import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ORDERS } from '@/data/placeholder'
import { formatPrice } from '@/lib/utils'
import AccountSidebar from '@/components/account/AccountSidebar'
import { Package, ChevronRight } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  delivered: 'bg-success text-white',
  processing: 'bg-info text-white',
  shipped: 'bg-info/10 text-info',
  cancelled: 'bg-error text-white',
}

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-semibold text-cocoa mb-8">My Orders</h1>
          {ORDERS.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-cocoa/20 mb-4" />
              <p className="font-heading text-xl text-cocoa mb-2">No orders yet</p>
              <Link to="/shop" className="text-gold-accessible font-body text-sm font-medium hover:underline">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ORDERS.map((order, idx) => (
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
                        <p className="font-body text-sm font-medium text-cocoa">{order.id}</p>
                        <p className="font-body text-xs text-cocoa/50">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-body font-medium px-3 py-1 rounded-pill capitalize ${STATUS_STYLES[order.status] || ''}`}>
                          {order.status}
                        </span>
                        <ChevronRight size={16} className="text-cocoa/30" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.items.map((item, i) => (
                        <img key={i} src={item.image} alt={item.name} className="w-14 h-18 object-cover rounded-card" />
                      ))}
                      <div className="flex-1 ml-2">
                        {order.items.map((item, i) => (
                          <p key={i} className="font-body text-sm text-cocoa">{item.name} &middot; {item.size}</p>
                        ))}
                      </div>
                      <p className="font-heading text-lg font-medium text-cocoa">{formatPrice(order.total)}</p>
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
