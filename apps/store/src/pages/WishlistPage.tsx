import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { PRODUCTS } from '@/data/placeholder'
import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/product/ProductCard'
import AccountSidebar from '@/components/account/AccountSidebar'

export default function WishlistPage() {
  const { ids } = useWishlist()
  const wishlistProducts = PRODUCTS.filter(p => ids.has(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-semibold text-cocoa mb-2">Saved Pieces</h1>
          <p className="font-body text-sm text-cocoa/60 mb-8">{wishlistProducts.length} items</p>

          {wishlistProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-24 h-24 mx-auto bg-ivory rounded-full flex items-center justify-center mb-6"
              >
                <Heart size={40} className="text-gold-accessible" />
              </motion.div>
              <p className="font-heading text-xl text-cocoa mb-2">No saved pieces yet</p>
              <p className="font-body text-sm text-cocoa/60 mb-6">Browse our collection and save the pieces you love.</p>
              <Link
                to="/shop"
                className="inline-flex items-center bg-gold-accessible text-white font-body font-medium text-sm px-8 py-3 rounded-pill hover:bg-cocoa transition-colors"
              >
                Explore the Collection
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
