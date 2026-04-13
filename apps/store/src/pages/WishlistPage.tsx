import { Link } from 'react-router-dom'
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
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-cocoa/20 mb-4" />
              <p className="font-heading text-xl text-cocoa mb-2">No saved pieces yet</p>
              <p className="font-body text-sm text-cocoa/60 mb-6">Browse our collection and save the pieces you love.</p>
              <Link
                to="/shop"
                className="inline-flex items-center bg-gold-accessible text-white font-body font-medium text-sm px-8 py-3 rounded-pill hover:bg-cocoa transition-colors"
              >
                Explore the Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
