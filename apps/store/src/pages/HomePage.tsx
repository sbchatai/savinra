import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Leaf, RotateCcw, Truck, MessageCircle, Star, Instagram } from 'lucide-react'
import { PRESS_MENTIONS } from '@/data/placeholder'
import LiveProductCard from '@/components/product/LiveProductCard'
import { useCollections } from '@/hooks/useCollections'
import { useProducts } from '@/hooks/useProducts'

const OCCASIONS = [
  { label: 'Festive', emoji: '\u2728', href: '/shop?occasion=festive' },
  { label: 'Wedding', emoji: '\uD83D\uDC8D', href: '/shop?occasion=wedding' },
  { label: 'Casual', emoji: '\u2600\uFE0F', href: '/shop?occasion=casual' },
  { label: 'Work', emoji: '\uD83D\uDCBC', href: '/shop?occasion=work' },
  { label: 'Party', emoji: '\uD83C\uDF19', href: '/shop?occasion=party' },
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
          <motion.h1 variants={fadeUp} className="savinra-shine-animated font-heading font-bold text-7xl sm:text-8xl lg:text-9xl leading-none mb-4">
            SAVINRA
          </motion.h1>
          <motion.p variants={fadeUp} className="font-heading italic text-xl sm:text-2xl text-white/90 mb-8">
            House of Refined Living
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-gold-accessible text-white font-body font-medium text-sm px-8 py-3.5 rounded-pill hover:bg-cocoa transition-all duration-300 hover:scale-105">
              Explore Collection <ArrowRight size={16} />
            </Link>
            <Link to="/collections" className="inline-flex items-center gap-2 glass-dark text-white font-body font-medium text-sm px-8 py-3.5 rounded-pill hover:bg-white/10 transition-all duration-300">
              Our Collections
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
        <div className="flex flex-wrap justify-center gap-3">
          {OCCASIONS.map((occ, i) => (
            <motion.div key={occ.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link
                to={occ.href}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-pill border border-gold/30 bg-ivory font-body text-sm text-cocoa hover:bg-gold-accessible hover:text-white hover:border-gold-accessible transition-all duration-200 hover:scale-105"
              >
                <span>{occ.emoji}</span> {occ.label}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="aspect-[4/5] bg-ivory rounded-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-card shadow-card cursor-pointer"
              >
                <Link to={`/collections/${col.slug}`}>
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={col.cover_image ?? FALLBACK_IMAGE}
                      alt={col.name}
                      width={400}
                      height={500}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading text-2xl font-semibold text-white mb-1.5">{col.name}</h3>
                    <p className="font-body text-sm text-white/80 mb-4 line-clamp-2">{col.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-gold-highlight text-sm font-body font-medium group-hover:gap-3 transition-all">
                      Explore Collection <ArrowRight size={14} />
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
                Savinra was born from a belief that India's extraordinary textile traditions deserve a place in the modern wardrobe. We work directly with master artisans across Varanasi, Rajasthan, Chanderi, and Kutch &mdash; preserving centuries-old craft while creating silhouettes for today.
              </p>
              <p className="font-body text-base text-white/70 leading-relaxed mb-8">
                Every piece carries a story &mdash; of the hands that made it, the technique that shaped it, and the tradition that lives in its threads.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 glass-gold text-gold-highlight font-body text-sm font-medium px-6 py-3 rounded-pill hover:bg-gold/20 transition-all">
                Our Craft Philosophy <ArrowRight size={14} />
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
