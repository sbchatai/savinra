import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useCollections } from '@/hooks/useCollections'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=800&auto=format&fit=crop&q=80'

export default function CollectionsPage() {
  const { collections, isLoading } = useCollections()

  return (
    <div>
      {/* Hero */}
      <section className="bg-ivory border-b border-gold/20 py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-accessible mb-3">Curated for You</p>
          <h1 className="font-heading text-5xl font-semibold text-cocoa mb-4">Our Collections</h1>
          <p className="font-body text-base text-cocoa/60 max-w-xl mx-auto">Three worlds of craft, each telling a different story of Indian textile heritage.</p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map(i => (
              <div key={i} className="aspect-[3/4] bg-ivory rounded-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Link
                  to={`/collections/${col.slug}`}
                  className="group relative overflow-hidden rounded-card shadow-card hover:shadow-card-hover transition-all block"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={col.cover_image ?? FALLBACK_IMAGE}
                      alt={col.name}
                      width={600}
                      height={800}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h2 className="font-heading text-3xl font-semibold text-white mb-2">{col.name}</h2>
                    <p className="font-body text-sm text-white/80 mb-4 leading-relaxed">{col.description}</p>
                    <span className="inline-flex items-center gap-2 bg-gold-accessible/90 text-white font-body font-medium text-sm px-6 py-2.5 rounded-pill group-hover:bg-gold transition-colors">
                      Explore Collection <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
