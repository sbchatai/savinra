import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { COLLECTIONS } from '@/data/placeholder'

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="font-heading text-5xl font-semibold text-cocoa mb-4">Our Collections</h1>
        <p className="font-body text-cocoa/60 max-w-xl mx-auto">
          Each collection is a narrative — a celebration of craft, colour, and the modern Indian woman.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COLLECTIONS.map(col => (
          <Link
            key={col.id}
            to={`/collections/${col.slug}`}
            className="group relative overflow-hidden rounded-card shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={col.coverImage}
                alt={col.name}
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
        ))}
      </div>
    </div>
  )
}
