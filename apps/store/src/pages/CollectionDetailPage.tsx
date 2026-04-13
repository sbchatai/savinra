import { useParams, Link } from 'react-router-dom'
import { PRODUCTS, COLLECTIONS } from '@/data/placeholder'
import ProductCard from '@/components/product/ProductCard'

export default function CollectionDetailPage() {
  const { slug } = useParams()
  const collection = COLLECTIONS.find(c => c.slug === slug)
  const products = PRODUCTS.filter(p => p.collectionSlug === slug)

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl text-cocoa mb-4">Collection not found</h1>
        <Link to="/collections" className="text-gold-accessible font-body font-medium hover:underline">
          View all collections
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-[50vh] min-h-[320px]">
        <img
          src={collection.coverImage}
          alt={collection.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cocoa/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <p className="font-body text-sm uppercase tracking-[0.3em] text-white/80 mb-3">Collection</p>
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-3">{collection.name}</h1>
            <p className="font-body text-white/80 max-w-lg mx-auto">{collection.description}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <p className="font-body text-sm text-cocoa/60 mb-8">{products.length} pieces in this collection</p>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-heading text-2xl text-cocoa mb-4">More pieces coming soon</p>
            <Link to="/shop" className="text-gold-accessible font-body font-medium hover:underline">
              Browse all products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
