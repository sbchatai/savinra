import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, MessageCircle, ArrowRight, Package } from 'lucide-react'
import { PRODUCTS } from '@/data/placeholder'
import ProductCard from '@/components/product/ProductCard'
import SavinraHeader from '@/components/layout/SavinraHeader'
import SavinraFooter from '@/components/layout/SavinraFooter'

const ORDER_ID = 'ORD-2026-' + String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')

export default function OrderConfirmationPage() {
  return (
    <>
      <SavinraHeader />
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
          className="w-24 h-24 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center"
        >
          <CheckCircle size={48} className="text-success" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-heading text-4xl font-semibold text-cocoa mb-2">Order Confirmed!</h1>
          <p className="font-body text-cocoa/60 mb-1">Thank you for shopping with Savinra.</p>
          <p className="font-body text-sm text-gold-accessible font-medium mb-8">{ORDER_ID}</p>
        </motion.div>

        {/* Order card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass rounded-card p-6 text-left mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Package size={18} className="text-gold-accessible" />
            <h3 className="font-heading text-lg font-semibold text-cocoa">What happens next?</h3>
          </div>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Order confirmed', sub: 'You will receive a confirmation email shortly' },
              { step: '2', title: 'Processing (1-2 days)', sub: 'Our team prepares your order with care' },
              { step: '3', title: 'Shipped (5-7 days)', sub: 'Tracking details sent via WhatsApp & email' },
            ].map(item => (
              <div key={item.step} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-gold-accessible text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</div>
                <div>
                  <p className="font-body text-sm font-medium text-cocoa">{item.title}</p>
                  <p className="font-body text-xs text-cocoa/55">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* WhatsApp note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-card p-4 mb-8 text-left"
        >
          <MessageCircle size={20} className="text-[#25D366] flex-shrink-0" />
          <div>
            <p className="font-body text-sm font-medium text-cocoa">Track on WhatsApp</p>
            <p className="font-body text-xs text-cocoa/60">We will send you live order updates on WhatsApp. No app needed.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link to="/orders" className="inline-flex items-center justify-center gap-2 bg-gold-accessible text-white font-body text-sm font-medium px-6 py-3 rounded-pill hover:bg-cocoa transition-colors">
            Track My Order <ArrowRight size={15} />
          </Link>
          <Link to="/shop" className="inline-flex items-center justify-center gap-2 border-2 border-gold-accessible text-gold-accessible font-body text-sm font-medium px-6 py-3 rounded-pill hover:bg-gold-accessible hover:text-white transition-all">
            Continue Shopping
          </Link>
        </motion.div>

        {/* Recommended */}
        <div className="border-t border-gold/20 pt-12 text-left">
          <h2 className="font-heading text-2xl font-semibold text-cocoa mb-6">You May Also Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRODUCTS.slice(0, 3).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <SavinraFooter />
    </>
  )
}
