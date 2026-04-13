import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, ChevronDown, ChevronRight, Truck, RotateCcw, Shield, Ruler, MapPin, Palette, Type } from 'lucide-react'
import { PRODUCTS } from '@/data/placeholder'
import ProductCard from '@/components/product/ProductCard'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { cn, formatPrice } from '@/lib/utils'

const SIZE_GUIDE = [
  { size: 'XS', chest: '32"', waist: '26"', hip: '36"', length: '52"' },
  { size: 'S', chest: '34"', waist: '28"', hip: '38"', length: '53"' },
  { size: 'M', chest: '36"', waist: '30"', hip: '40"', length: '54"' },
  { size: 'L', chest: '38"', waist: '32"', hip: '42"', length: '55"' },
  { size: 'XL', chest: '40"', waist: '34"', hip: '44"', length: '56"' },
  { size: 'XXL', chest: '42"', waist: '36"', hip: '46"', length: '57"' },
]

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = PRODUCTS.find(p => p.slug === slug) ?? PRODUCTS[0]
  const related = PRODUCTS.filter(p => p.id !== product.id && p.collectionSlug === product.collectionSlug).slice(0, 3)
  const more = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3)

  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>('description')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [pincode, setPincode] = useState('')
  const [pincodeChecked, setPincodeChecked] = useState(false)
  const [customizations, setCustomizations] = useState<Record<string, string>>({})
  const [addedToCart, setAddedToCart] = useState(false)

  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const wishlisted = has(product.id)
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 5

  function handleAddToCart() {
    if (!selectedSize) return
    addItem(product, selectedSize, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const ACCORDIONS = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'fabric', label: 'Fabric & Care', content: `Fabric: ${product.fabric}\n\n${product.care}` },
    { id: 'craft', label: 'Craft Story', content: product.craftStory },
    { id: 'shipping', label: 'Shipping & Returns', content: 'Free standard shipping on orders above \u20b9999. Standard delivery: 5\u20137 business days. Express: 2\u20133 days.\n\n15-day hassle-free returns. Items must be unworn with original tags. Customised pieces are non-returnable.' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 font-body text-xs text-cocoa/50 mb-8">
        <Link to="/" className="hover:text-gold-accessible transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/collections" className="hover:text-gold-accessible transition-colors">Collections</Link>
        <ChevronRight size={12} />
        <Link to={`/collections/${product.collectionSlug}`} className="hover:text-gold-accessible transition-colors">{product.collection}</Link>
        <ChevronRight size={12} />
        <span className="text-cocoa">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'flex-shrink-0 w-16 h-20 lg:w-20 lg:h-24 rounded-card overflow-hidden border-2 transition-all',
                  activeImage === i ? 'border-gold-accessible' : 'border-transparent hover:border-gold/40'
                )}
              >
                <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 relative rounded-card overflow-hidden bg-ivory aspect-[3/4]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={product.images[activeImage]}
                alt={product.name}
                width={600}
                height={800}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            {product.isNew && (
              <div className="absolute top-4 left-4 glass-gold px-3 py-1 rounded-full">
                <span className="font-body text-xs font-semibold text-gold-accessible uppercase tracking-wider">New Arrival</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          {/* Badge row */}
          <div className="flex items-center gap-2 mb-2">
            {product.isBestseller && <span className="bg-gold-accessible text-white font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">Bestseller</span>}
            {product.customizable && <span className="bg-sage text-white font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">Customisable</span>}
          </div>

          {/* Collection */}
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-accessible mb-2">{product.collection}</p>

          {/* Name */}
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-cocoa mb-3 leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= Math.round(avgRating) ? 'text-gold fill-gold' : 'text-cocoa/20'} fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'} />)}
            </div>
            <span className="font-body text-sm text-cocoa/60">{avgRating.toFixed(1)} ({product.reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-heading text-3xl font-medium text-cocoa">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="font-body text-lg text-sage line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="glass-gold font-body text-xs font-semibold text-success px-2 py-0.5 rounded-full">
                  {Math.round((1 - product.price / product.compareAtPrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Fabric line */}
          <p className="font-body text-sm text-cocoa/60 mb-6">Material: <span className="text-cocoa font-medium">{product.fabric}</span></p>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-body text-sm font-medium text-cocoa">Select Size</p>
              <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-1 font-body text-xs text-gold-accessible hover:underline">
                <Ruler size={12} /> Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'w-12 h-12 rounded-card font-body text-sm font-medium border-2 transition-all',
                    selectedSize === size
                      ? 'bg-gold-accessible text-white border-gold-accessible'
                      : 'bg-white text-cocoa border-cocoa/20 hover:border-gold-accessible'
                  )}
                >
                  {size}
                </motion.button>
              ))}
            </div>
            {!selectedSize && <p className="mt-2 font-body text-xs text-error">Please select a size</p>}
          </div>

          {/* Qty + Add to Cart */}
          <div className="flex gap-3 mb-4">
            <div className="flex items-center border border-cocoa/20 rounded-card">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-cocoa hover:text-gold-accessible transition-colors font-body text-lg">&minus;</button>
              <span className="px-4 py-2 font-body text-sm font-medium text-cocoa min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-cocoa hover:text-gold-accessible transition-colors font-body text-lg">+</button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 font-body text-sm font-medium py-3 rounded-pill transition-all duration-200',
                addedToCart
                  ? 'bg-success text-white'
                  : selectedSize
                    ? 'bg-gold-accessible text-white hover:bg-cocoa'
                    : 'bg-cocoa/20 text-cocoa/40 cursor-not-allowed'
              )}
            >
              <ShoppingBag size={16} />
              {addedToCart ? 'Added to Bag \u2713' : 'Add to Bag'}
            </motion.button>
          </div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => toggle(product.id)}
            className={cn(
              'w-full flex items-center justify-center gap-2 border-2 font-body text-sm font-medium py-3 rounded-pill transition-all mb-6',
              wishlisted
                ? 'border-error text-error bg-error/5'
                : 'border-cocoa/25 text-cocoa hover:border-gold-accessible hover:text-gold-accessible'
            )}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
          </motion.button>

          {/* Delivery Check */}
          <div className="glass rounded-card p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-gold-accessible" />
              <p className="font-body text-sm font-medium text-cocoa">Check Delivery</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter PIN code"
                value={pincode}
                onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setPincodeChecked(false) }}
                className="flex-1 px-3 py-2 text-sm font-body border border-cocoa/20 rounded-card bg-white focus:outline-none focus:border-gold-accessible"
              />
              <button
                onClick={() => pincode.length === 6 && setPincodeChecked(true)}
                className="px-4 py-2 bg-gold-accessible text-white font-body text-sm font-medium rounded-card hover:bg-cocoa transition-colors"
              >Check</button>
            </div>
            {pincodeChecked && <p className="mt-2 font-body text-xs text-success flex items-center gap-1"><Truck size={12} /> Delivery available &middot; Arrives in 5&ndash;7 business days</p>}
          </div>

          {/* Customisation */}
          {product.customizable && product.customizationOptions.length > 0 && (
            <div className="glass-gold rounded-card p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={16} className="text-gold-accessible" />
                <p className="font-body text-sm font-semibold text-cocoa">Personalise This Piece</p>
                <span className="ml-auto font-body text-xs text-gold-accessible">Optional</span>
              </div>
              <div className="flex flex-col gap-4">
                {product.customizationOptions.map(opt => (
                  <div key={opt.id}>
                    <label className="font-body text-xs font-medium text-cocoa/70 uppercase tracking-wide mb-1.5 block">{opt.label}</label>
                    {opt.type === 'text' && (
                      <input
                        type="text"
                        maxLength={opt.maxLength}
                        placeholder={`Max ${opt.maxLength} characters`}
                        value={customizations[opt.id] || ''}
                        onChange={e => setCustomizations(c => ({ ...c, [opt.id]: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2 text-sm font-body border border-cocoa/20 rounded-card bg-white/70 focus:outline-none focus:border-gold-accessible uppercase tracking-widest"
                      />
                    )}
                    {(opt.type === 'select' || opt.type === 'color') && opt.choices && (
                      <div className="flex flex-wrap gap-2">
                        {opt.choices.map(choice => (
                          <button
                            key={choice}
                            onClick={() => setCustomizations(c => ({ ...c, [opt.id]: choice }))}
                            className={cn(
                              'px-3 py-1.5 rounded-full font-body text-xs border transition-all',
                              customizations[opt.id] === choice
                                ? 'bg-gold-accessible text-white border-gold-accessible'
                                : 'border-cocoa/25 text-cocoa hover:border-gold-accessible'
                            )}
                          >
                            {choice}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <p className="font-body text-xs text-cocoa/50 flex items-center gap-1">
                  <Type size={11} /> Customised orders add 3&ndash;5 business days to delivery
                </p>
              </div>
            </div>
          )}

          {/* Trust icons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Truck, label: 'Free shipping above \u20b9999' },
              { icon: RotateCcw, label: '15-day easy returns' },
              { icon: Shield, label: '100% authentic' },
            ].map((t, i) => (
              <div key={i} className="text-center">
                <t.icon size={18} className="mx-auto text-sage mb-1" />
                <p className="font-body text-[10px] text-cocoa/60 leading-tight">{t.label}</p>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="border-t border-gold/20">
            {ACCORDIONS.map(acc => (
              <div key={acc.id} className="border-b border-gold/20">
                <button
                  onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                  className="w-full flex items-center justify-between py-4 font-body text-sm font-medium text-cocoa text-left"
                >
                  {acc.label}
                  <motion.div animate={{ rotate: openAccordion === acc.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-sage" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openAccordion === acc.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="font-body text-sm text-cocoa/70 leading-relaxed pb-4 whitespace-pre-line">{acc.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-cocoa/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-parchment rounded-card p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-semibold text-cocoa">Size Guide</h3>
                <button onClick={() => setShowSizeGuide(false)} className="text-cocoa/50 hover:text-cocoa">&times;</button>
              </div>
              <p className="font-body text-xs text-cocoa/60 mb-4">All measurements are in inches. Measure your body and match to the closest size.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead><tr className="bg-gold-accessible text-white"><th className="py-2 px-3 text-left">Size</th><th className="py-2 px-3">Chest</th><th className="py-2 px-3">Waist</th><th className="py-2 px-3">Hip</th><th className="py-2 px-3">Length</th></tr></thead>
                  <tbody>{SIZE_GUIDE.map((row, i) => (<tr key={row.size} className={i % 2 === 0 ? 'bg-ivory' : 'bg-white'}><td className="py-2 px-3 font-medium">{row.size}</td><td className="py-2 px-3 text-center">{row.chest}</td><td className="py-2 px-3 text-center">{row.waist}</td><td className="py-2 px-3 text-center">{row.hip}</td><td className="py-2 px-3 text-center">{row.length}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="font-body text-xs text-cocoa/60 mt-3">When between sizes, we recommend sizing up. Our garments have a relaxed, comfortable fit.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews */}
      <section className="mt-16 border-t border-gold/20 pt-12">
        <h2 className="font-heading text-3xl font-semibold text-cocoa mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {product.reviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-ivory rounded-card p-5 shadow-card">
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= review.rating ? 'text-gold fill-gold' : 'text-cocoa/20'} fill={s <= review.rating ? 'currentColor' : 'none'} />)}
              </div>
              <p className="font-body text-sm text-cocoa/80 leading-relaxed mb-3 italic">&ldquo;{review.body}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-xs font-semibold text-cocoa">{review.name}</p>
                  <p className="font-body text-[11px] text-sage">{review.location} &middot; {review.date}</p>
                </div>
                {review.verified && <span className="font-body text-[10px] text-success bg-success/10 px-2 py-0.5 rounded-full">Verified</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Complete the Look */}
      {(related.length > 0 || more.length > 0) && (
        <section className="mt-16 border-t border-gold/20 pt-12">
          <h2 className="font-heading text-3xl font-semibold text-cocoa mb-8">Complete the Look</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(related.length >= 3 ? related : more).slice(0, 3).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
