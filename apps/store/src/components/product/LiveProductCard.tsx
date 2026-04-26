import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import type { ProductCard } from '@/hooks/useProducts'
import type { Product } from '@/data/placeholder'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { cn, formatPrice } from '@/lib/utils'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1067&auto=format&fit=crop&q=80'

type QuickAddState = 'idle' | 'sizing' | 'added'

export default function LiveProductCard({ product }: { product: ProductCard }) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const wishlisted = has(product.id)
  const [qaState, setQaState] = useState<QuickAddState>('idle')

  const imageSrc = product.primary_image ?? FALLBACK_IMAGE

  // Unique sizes with stock > 0
  const availableSizes = Array.from(
    new Map(
      (product.variants ?? [])
        .filter((v) => v.stock_count > 0)
        .map((v) => [v.size, v])
    ).values()
  )

  function doAddToCart(size: string) {
    const cartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price / 100,
      images: [imageSrc],
      sizes: availableSizes.map((v) => v.size),
    } as unknown as Product
    addItem(cartProduct, size, 1)
    setQaState('added')
    setTimeout(() => setQaState('idle'), 1800)
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (availableSizes.length === 0) {
      doAddToCart('M')
    } else if (availableSizes.length === 1) {
      doAddToCart(availableSizes[0].size)
    } else {
      setQaState('sizing')
    }
  }

  function handleSizeClick(e: React.MouseEvent, size: string) {
    e.preventDefault()
    e.stopPropagation()
    doAddToCart(size)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'tween', duration: 0.22 }}
      className="group bg-ivory rounded-card shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden relative"
    >
      {/* Out of stock overlay */}
      {!product.in_stock && (
        <div className="absolute inset-0 z-10 bg-cocoa/40 flex items-center justify-center rounded-card pointer-events-none">
          <span className="bg-cocoa text-parchment font-body text-xs uppercase tracking-widest px-4 py-2 rounded-pill">
            Out of Stock
          </span>
        </div>
      )}

      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          width={400}
          height={533}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="glass-gold font-body text-[10px] uppercase tracking-wider text-gold-accessible font-semibold px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-gold-accessible text-white font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">
              Bestseller
            </span>
          )}
          {product.customizable && (
            <span className="bg-sage/80 text-white font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">
              Customisable
            </span>
          )}
        </div>

        {/* Wishlist */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={e => { e.preventDefault(); toggle(product.id) }}
          className={cn(
            'absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full glass transition-colors',
            wishlisted ? 'text-error' : 'text-cocoa/60 hover:text-error'
          )}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Quick Add overlay — slides up on group hover */}
        {product.in_stock && (
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <AnimatePresence mode="wait">
              {qaState === 'idle' && (
                <motion.button
                  key="idle"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleQuickAdd}
                  className="w-full flex items-center justify-center gap-2 glass-dark text-white font-body text-sm font-medium py-2.5 rounded-pill"
                >
                  <ShoppingBag size={15} /> Quick Add
                </motion.button>
              )}

              {qaState === 'sizing' && (
                <motion.div
                  key="sizing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="glass-dark rounded-2xl p-2.5"
                >
                  <p className="text-white/60 font-body text-[10px] uppercase tracking-wider text-center mb-2">Select size</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {availableSizes.map((v) => (
                      <motion.button
                        key={v.size}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleSizeClick(e, v.size)}
                        className="min-w-[36px] h-8 px-2 bg-white/15 hover:bg-gold-accessible text-white text-xs font-body font-medium rounded-lg transition-colors"
                      >
                        {v.size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {qaState === 'added' && (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center justify-center gap-2 bg-sage/90 backdrop-blur text-white font-body text-sm font-medium py-2.5 rounded-pill"
                >
                  <Check size={15} strokeWidth={2.5} /> Added to cart
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-cocoa mb-1 hover:text-gold-accessible transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-xl font-medium text-cocoa">
            {formatPrice(product.price / 100)}
          </span>
          {product.compare_at_price && (
            <span className="font-body text-sm text-sage line-through">
              {formatPrice(product.compare_at_price / 100)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
