import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import type { Product } from '@/data/placeholder'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { cn, formatPrice } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const wishlisted = has(product.id)
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'tween', duration: 0.22 }}
      className="group bg-ivory rounded-card shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
    >
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={533}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="glass-gold font-body text-[10px] uppercase tracking-wider text-gold-accessible font-semibold px-2.5 py-1 rounded-full">New</span>
          )}
          {product.isBestseller && (
            <span className="bg-gold-accessible text-white font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">Bestseller</span>
          )}
          {product.customizable && (
            <span className="bg-sage/80 text-white font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">Customisable</span>
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

        {/* Quick Add overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={e => { e.preventDefault(); addItem(product, product.sizes[0] || 'M') }}
            className="w-full flex items-center justify-center gap-2 glass-dark text-white font-body text-sm font-medium py-2.5 rounded-pill"
          >
            <ShoppingBag size={15} /> Quick Add
          </motion.button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="font-body text-[11px] uppercase tracking-widest text-sage mb-1">{product.collection}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-cocoa mb-1 hover:text-gold-accessible transition-colors line-clamp-1">{product.name}</h3>
        </Link>

        {/* Rating */}
        {avgRating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={11} className={s <= Math.round(avgRating) ? 'text-gold fill-gold' : 'text-cocoa/20'} fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="font-body text-[11px] text-cocoa/50">({product.reviews.length})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-xl font-medium text-cocoa">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="font-body text-sm text-sage line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
