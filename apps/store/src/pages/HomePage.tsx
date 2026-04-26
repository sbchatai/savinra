import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Leaf, RotateCcw, Truck, MessageCircle, Star, Instagram } from 'lucide-react'
import { PRESS_MENTIONS } from '@/data/placeholder'
import LiveProductCard from '@/components/product/LiveProductCard'
import { useCollections } from '@/hooks/useCollections'
import { useProducts } from '@/hooks/useProducts'
import SEOHead from '@/components/layout/SEOHead'

const OCCASIONS = [
  { label: 'Festive', emoji: '✨', href: '/shop?occasion=festive', bg: 'from-amber-50 to-yellow-100', border: 'border-amber-200', text: 'text-amber-900' },
  { label: 'Wedding', emoji: '💍', href: '/shop?occasion=wedding', bg: 'from-rose-50 to-pink-100', border: 'border-rose-200', text: 'text-rose-900' },
  { label: 'Casual', emoji: '☀️', href: '/shop?occasion=casual', bg: 'from-sky-50 to-blue-100', border: 'border-sky-200', text: 'text-sky-900' },
  { label: 'Work', emoji: '💼', href: '/shop?occasion=work', bg: 'from-slate-50 to-gray-100', border: 'border-slate-200', text: 'text-slate-900' },
  { label: 'Party', emoji: '🌙', href: '/shop?occasion=party', bg: 'from-violet-50 to-purple-100', border: 'border-violet-200', text: 'text-violet-900' },
]

const TRUST_ITEMS = [
  { icon: Truck, title: 'Free Shipping', sub: 'On orders above \u20b9999' },
  { icon: RotateCcw, title: 'Easy Returns', sub: '15-day hassle-free returns' },
  { icon: Star, title: '4.9\u2605 Rated', sub: '15,000+ happy customers' },
  { icon: MessageCircle, title: 'WhatsApp Support', sub: 'Response within 2 hours' },
]

const INSTAGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=400&h=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&h=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=400&h=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&auto=format&fit=crop&q=80',
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=800&auto=format&fit=crop&q=80'

export default function HomePage() {
  const { collections, isLoading: collectionsLoading } = useCollections()
  const { products: bestsellers, isLoading: bestsellersLoading } = useProducts({ is_bestseller: true, limit: 4 })
  const { products: newArrivals, isLoading: newArrivalsLoading } = useProducts({ is_new: true, limit: 4 })

  return (
    <div className="overflow-x-hidden">
      <SEOHead
        title="Handcrafted Indo-Western Fashion"
        description="Shop premium handcrafted Indo-Western clothing at Savinra — kurtas, suits & festive wear. Free shipping above ₹999, easy 15-day returns."
        canonical="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Savinra',
          url: 'https://savinra.in',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://savinra.in/shop?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* Hero */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&h=1000&auto=format&fit=crop&q=85')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cocoa/30 via-cocoa/20 to-cocoa/60" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
          className="relative text-center px-6 max-w-3xl"
        >
          <motion.p variants={fadeUp} className="font-body text-xs uppercase tracking-[0.4em] text-gold-highlight mb-5">
            Spring &middot; Summer 2026
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading font-bold text-7xl sm:text-8xl lg:text-9xl leading-none mb-4 flex items-center justify-center">
            <span className="savinra-shine-animated">SAVINR</span>
            <span className="savinra-shine-animated relative" style={{ display: 'inline-block' }}>
              A
              <svg
                viewBox="0 0 12 14"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: '0.26em',
                  height: '0.26em',
                  top: '-0.32em',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <defs>
                  <linearGradient id="leafGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8C7A2E" />
                    <stop offset="30%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#F5E6A3" />
                    <stop offset="70%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#8C7A2E" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#leafGold)"
                  d="M6 0 C2.5 1.5 0 5 0 8 a6 6 0 0 0 12 0 C12 5 9.5 1.5 6 0z M5.5 2 L5.5 13.5"
                  strokeWidth="0"
                />
              </svg>
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="font-heading italic text-xl sm:text-2xl text-white/90 mb-8">
            House of Refined Living
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-gold-accessible text-white font-body font-medium text-sm px-8 py-3.5 rounded-pill hover:bg-cocoa transition-all duration-300 hover:scale-105">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 glass-dark text-white font-body font-medium text-sm px-8 py-3.5 rounded-pill hover:bg-white/10 transition-all duration-300">
              Our Story
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/80"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="bg-ivory border-y border-gold/20 py-5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <item.icon size={20} className="text-gold-accessible flex-shrink-0" />
              <div>
                <p className="font-body text-sm font-medium text-cocoa">{item.title}</p>
                <p className="font-body text-xs text-cocoa/60">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-accessible mb-3">Discover</p>
          <h2 className="font-heading text-4xl font-semibold text-cocoa">Shop by Occasion</h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {OCCASIONS.map((occ, i) => (
            <motion.div
              key={occ.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                to={occ.href}
                className={`group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${occ.bg} border ${occ.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 aspect-square`}
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{occ.emoji}</span>
                <span className={`font-body font-semibold text-xs ${occ.text} uppercase tracking-widest`}>{occ.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-accessible mb-3">Curated</p>
          <h2 className="font-heading text-4xl font-semibold text-cocoa">Our Collections</h2>
        </motion.div>
        {collectionsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[0, 1, 2].map(i => (
              <div key={i} className="aspect-[3/4] bg-ivory rounded-card animate-pulse" />
            ))}
          </div>
        ) : collections.length <= 3 ? (
          /* Grid layout for 1–3 collections — no scroll needed */
          <div className={`grid gap-5 ${
            collections.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            collections.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto' :
            'grid-cols-1 sm:grid-cols-3'
          }`}>
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-card shadow-card cursor-pointer"
              >
                <Link to={`/collections/${col.slug}`}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={col.cover_image ?? FALLBACK_IMAGE}
                      alt={col.name}
                      width={320}
                      height={427}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-heading text-xl font-semibold text-white mb-1">{col.name}</h3>
                    <p className="font-body text-xs text-white/75 mb-3 line-clamp-2">{col.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-gold-highlight text-xs font-body font-medium group-hover:gap-2.5 transition-all">
                      Explore <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Horizontal scroll for 4+ collections */
          <div
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="min-w-[200px] sm:min-w-[240px] flex-shrink-0 snap-start group relative overflow-hidden rounded-card shadow-card cursor-pointer"
              >
                <Link to={`/collections/${col.slug}`}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={col.cover_image ?? FALLBACK_IMAGE}
                      alt={col.name}
                      width={240}
                      height={320}
                      loading={i < 3 ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading text-lg font-semibold text-white mb-1">{col.name}</h3>
                    <span className="inline-flex items-center gap-1.5 text-gold-highlight text-xs font-body font-medium group-hover:gap-2.5 transition-all">
                      Explore <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products — Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-accessible mb-3">Handpicked</p>
            <h2 className="font-heading text-4xl font-semibold text-cocoa">Crafted for You</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1.5 font-body text-sm text-gold-accessible hover:text-cocoa transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </motion.div>
        {bestsellersLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="bg-ivory rounded-card animate-pulse h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestsellers.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <LiveProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Brand Story */}
      <section className="bg-cocoa py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-sage mb-4">Our Story</p>
              <h2 className="savinra-shine-on-dark font-heading text-4xl sm:text-5xl font-semibold mb-6 leading-tight">
                Where Heritage<br />Meets Now
              </h2>
              <p className="font-body text-base text-white/70 leading-relaxed mb-6">
                Savinra is where India's extraordinary textile heritage meets modern design sensibility. We design for the woman who moves fluidly between tradition and modernity — who wears a hand-block printed kurta to a board meeting and a silk co-ord to a wedding.
              </p>
              <p className="font-body text-base text-white/70 leading-relaxed mb-8">
                Our pieces are designed in India, crafted with natural fibres, and shaped by silhouettes that feel entirely of this moment. Not ethnic wear. Not Western wear. Indo-Western — a category we believe should have its own identity.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 glass-gold text-gold-highlight font-body text-sm font-medium px-6 py-3 rounded-pill hover:bg-gold/20 transition-all">
                Our Story <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-3 gap-4 text-center">
              {[{ num: '200+', label: 'Unique Designs' }, { num: '15,000+', label: 'Happy Customers' }, { num: '8', label: 'Artisan Clusters' }].map((stat, i) => (
                <div key={i} className="glass-gold rounded-card p-5">
                  <p className="savinra-shine-on-dark font-heading text-3xl font-bold mb-1">{stat.num}</p>
                  <p className="font-body text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="bg-ivory py-14 px-4 border-y border-gold/15">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
          <Leaf size={28} className="mx-auto text-sage mb-4" />
          <h3 className="font-heading text-2xl font-semibold text-cocoa mb-3">Crafted Consciously</h3>
          <p className="font-body text-sm text-cocoa/65 leading-relaxed">
            We use natural fibres &mdash; organic cotton, pure silk, linen, and handwoven fabrics &mdash; sourced responsibly from certified artisan cooperatives. Our packaging is 100% plastic-free. Every purchase supports a living wage for Indian craftspeople.
          </p>
        </motion.div>
      </section>

      {/* Press */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-accessible text-center mb-10">As seen in</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESS_MENTIONS.map((press, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-card p-6 text-center"
              >
                <p className="font-heading text-lg font-semibold text-gold-accessible mb-2">{press.name}</p>
                <p className="font-body text-sm italic text-cocoa/70 leading-relaxed">{press.quote}</p>
                <p className="font-body text-xs text-sage mt-3">{press.issue}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-14 px-4 bg-ivory">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-accessible mb-2">Follow us</p>
            <h3 className="font-heading text-2xl font-semibold text-cocoa">@savinra.official</h3>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {INSTAGRAM_IMAGES.map((src, i) => (
              <motion.a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group relative aspect-square overflow-hidden rounded-card"
              >
                <img src={src} alt="Savinra on Instagram" width={200} height={200} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-cocoa/0 group-hover:bg-cocoa/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
