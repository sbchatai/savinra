import { Link } from 'react-router-dom'
import { PRODUCTS, COLLECTIONS } from '@/data/placeholder'
import ProductCard from '@/components/product/ProductCard'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1400&q=80')" }}
        />
        <div className="absolute inset-0 bg-cocoa/25" />
        <div className="relative text-center px-4">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-white/90 mb-4">New Collection</p>
          <h1 className="savinra-shine-on-dark font-heading text-6xl sm:text-7xl lg:text-8xl font-bold mb-4">
            SAVINRA
          </h1>
          <p className="font-body text-lg text-white/90 mb-8 tracking-wide">House of Refined Living</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gold-accessible text-white font-body font-medium text-sm px-8 py-3 rounded-pill hover:bg-cocoa transition-colors"
          >
            Explore Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Collection spotlight */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="font-heading text-4xl font-semibold text-cocoa text-center mb-4">Our Collections</h2>
        <p className="text-center font-body text-cocoa/60 mb-12 max-w-xl mx-auto">
          Curated collections that celebrate the beauty of Indian craftsmanship
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COLLECTIONS.map(col => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              className="group relative overflow-hidden rounded-card shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={col.coverImage}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-2xl font-semibold text-white mb-1">{col.name}</h3>
                <p className="font-body text-sm text-white/80 mb-3">{col.description}</p>
                <span className="inline-flex items-center gap-1 text-gold-highlight text-sm font-medium">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-ivory/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-4xl font-semibold text-cocoa text-center mb-4">Crafted for You</h2>
          <p className="text-center font-body text-cocoa/60 mb-12 max-w-xl mx-auto">
            Each piece tells a story of heritage, artistry, and modern elegance
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border-2 border-gold-accessible text-gold-accessible font-body font-medium text-sm px-8 py-3 rounded-pill hover:bg-gold-accessible hover:text-white transition-colors"
            >
              View All Pieces <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section id="story" className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading text-4xl font-semibold text-cocoa mb-6">The Savinra Story</h2>
        <p className="font-body text-cocoa/70 leading-relaxed mb-4">
          Born from a deep reverence for India's textile heritage, SAVINRA brings you indo-western fashion that bridges tradition and modernity. Every piece is crafted with intention — from hand-selected fabrics to artisan embroidery techniques passed down through generations.
        </p>
        <p className="font-body text-cocoa/70 leading-relaxed mb-8">
          We believe in slow fashion, fair wages, and clothes that make you feel extraordinary. Our collections are designed for the modern Indian woman who values both heritage and contemporary style.
        </p>
        <Link
          to="/help"
          className="text-gold-accessible font-body font-medium text-sm hover:underline inline-flex items-center gap-1"
        >
          Learn more about us <ArrowRight size={14} />
        </Link>
      </section>

      {/* Instagram preview */}
      <section className="bg-ivory/50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-semibold text-cocoa mb-2">@savinra.official</h2>
          <p className="font-body text-sm text-cocoa/60 mb-8">Follow us for styling inspiration</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRODUCTS.map(p => (
              <div key={p.id} className="aspect-square overflow-hidden rounded-card">
                <img src={p.images[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
