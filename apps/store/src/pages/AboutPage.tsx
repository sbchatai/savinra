import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Heart, Zap } from 'lucide-react'
import SEOHead from '@/components/layout/SEOHead'

const VALUES = [
  {
    icon: Leaf,
    title: 'Sustainability',
    desc: 'Natural fibres, low-impact dyes, and plastic-free packaging in every order.',
  },
  {
    icon: Heart,
    title: 'Craft First',
    desc: 'Every design goes through dozens of iterations. We never rush beauty.',
  },
  {
    icon: Zap,
    title: 'Fair Wages',
    desc: 'We pay artisans above market rate and maintain long-term relationships with our makers.',
  },
]

const STATS = [
  { num: '200+', label: 'Unique Designs' },
  { num: '15,000+', label: 'Happy Customers' },
  { num: '8', label: 'Artisan Clusters' },
  { num: '100%', label: 'Natural Fibres' },
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      <SEOHead
        title="About Savinra — Our Story & Design Philosophy"
        description="Savinra is a contemporary Indo-Western fashion brand blending India's textile heritage with modern design. Learn about our story, values, and craft philosophy."
        canonical="/about"
      />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end pb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=800&auto=format&fit=crop&q=85')" }}
          role="img"
          aria-label="Artisan at work with textile"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cocoa/10 via-cocoa/30 to-cocoa/80" />
        <div className="relative max-w-4xl mx-auto px-6 w-full">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-xs uppercase tracking-[0.4em] text-gold-highlight mb-3"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight"
          >
            Where India Meets Now
          </motion.h1>
        </div>
      </section>

      {/* Brand intro */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="space-y-6"
        >
          <motion.p variants={fadeUp} className="font-body text-lg text-cocoa/80 leading-relaxed">
            Savinra is a contemporary Indo-Western fashion brand born at the intersection of India's rich textile heritage and modern design sensibility.
          </motion.p>
          <motion.p variants={fadeUp} className="font-body text-base text-cocoa/70 leading-relaxed">
            We believe that Indian women deserve clothing that honours their roots while celebrating the woman they are today — confident, stylish, and unapologetically modern. Our collections blend traditional weaves, hand-block prints, and artisanal embroideries with contemporary cuts and silhouettes that move effortlessly between boardrooms, celebrations, and quiet afternoons.
          </motion.p>
          <motion.p variants={fadeUp} className="font-body text-base text-cocoa/70 leading-relaxed">
            Every Savinra piece is designed in India, crafted with intention, and built to last — because style should never come at the cost of the planet or the people who make it.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="bg-cocoa py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="savinra-shine-on-dark font-heading text-4xl font-bold mb-1">{stat.num}</p>
              <p className="font-body text-xs text-white/60 uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-accessible mb-3">Design</p>
          <h2 className="font-heading text-4xl font-semibold text-cocoa">Our Philosophy</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <p className="font-body text-base text-cocoa/70 leading-relaxed">
              Indian fabrics have centuries of wisdom woven into them. Chanderi's gossamer silk, Jaipur's bold block prints, Lucknow's delicate chikankari — these are not just textiles; they are living traditions.
            </p>
            <p className="font-body text-base text-cocoa/70 leading-relaxed">
              We work directly with regional artisans and weavers to bring these fabrics into contemporary shapes that feel entirely of this moment. The result: pieces that look like no one else's, feel extraordinary to wear, and carry a story worth telling.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden aspect-[4/3]"
          >
            <img
              src="https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=600&h=450&auto=format&fit=crop&q=80"
              alt="Artisan weaving handloom textile"
              width={600}
              height={450}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ivory py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-accessible mb-3">Principles</p>
            <h2 className="font-heading text-4xl font-semibold text-cocoa">What We Stand For</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 bg-white rounded-2xl shadow-sm"
              >
                <div className="w-12 h-12 bg-gold-highlight/30 rounded-full flex items-center justify-center mx-auto mb-5">
                  <v.icon size={22} className="text-gold-accessible" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-cocoa mb-2">{v.title}</h3>
                <p className="font-body text-sm text-cocoa/65 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl font-semibold text-cocoa mb-4">Ready to explore?</h2>
          <p className="font-body text-cocoa/60 mb-8 max-w-md mx-auto">
            Discover our latest collection — handcrafted pieces made to move with you.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gold-accessible text-white font-body font-medium text-sm px-8 py-3.5 rounded-pill hover:bg-cocoa transition-all duration-300"
          >
            Shop the Collection <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
