import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LiveProductCard from '@/components/product/LiveProductCard'
import { useCollections } from '@/hooks/useCollections'
import { useProducts } from '@/hooks/useProducts'
import SEOHead from '@/components/layout/SEOHead'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=800&auto=format&fit=crop&q=80'

export default function CollectionDetailPage() {
  const { slug } = useParams()
  const { collections, isLoading: collectionsLoading } = useCollections()
  const { products, isLoading: productsLoading } = useProducts({ collection_slug: slug })

  const collection = collections.find(c => c.slug === slug)

  if (collectionsLoading) {
    return (
      <div>
        <SEOHead title="Collection" canonical={slug ? `/collections/${slug}` : undefined} />
        <div className="h-[50vh] min-h-[320px] bg-ivory animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="h-6 w-48 bg-ivory rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-ivory rounded-card animate-pulse h-80" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <SEOHead title="Collection Not Found" noIndex />
        <h1 className="font-heading text-3xl text-cocoa mb-4">Collection not found</h1>
        <Link to="/collections" className="text-gold-accessible font-body font-medium hover:underline">
          View all collections
        </Link>
      </div>
    )
  }

  return (
    <div>
      <SEOHead
        title={collection.name}
        description={collection.description || `Shop the ${collection.name} collection at Savinra.`}
        canonical={`/collections/${collection.slug}`}
        ogImage={collection.cover_image || undefined}
      />
      {/* Banner */}
      <div className="relative h-[50vh] min-h-[320px]">
        <img
          src={collection.cover_image ?? FALLBACK_IMAGE}
          alt={collection.name}
          width={1200}
          height={600}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="font-body text-sm uppercase tracking-[0.3em] text-white/80 mb-3">Collection</p>
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-3">{collection.name}</h1>
            <p className="font-body text-white/80 max-w-lg mx-auto">{collection.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <p className="font-body text-sm text-cocoa/60 mb-8">
          {productsLoading ? 'Loading...' : `${products.length} pieces in this collection`}
        </p>
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-ivory rounded-card animate-pulse h-80" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <LiveProductCard product={p} />
              </motion.div>
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
