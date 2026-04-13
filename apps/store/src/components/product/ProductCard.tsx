import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { Product } from '@/data/placeholder'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggle, has } = useWishlist()
  const { addItem } = useCart()
  const wishlisted = has(product.id)

  return (
    <div className="group bg-ivory rounded-card shadow-card hover:shadow-card-hover transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-card">
        <Link to={`/products/${product.slug}`}>
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        </Link>

        {/* Wishlist button */}
        <button
          onClick={() => toggle(product.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-parchment/80 backdrop-blur-sm flex items-center justify-center hover:bg-parchment transition-colors"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={18}
            className={wishlisted ? 'fill-error text-error' : 'text-cocoa'}
          />
        </button>

        {/* Badge */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-gold-accessible text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-pill">
            New
          </span>
        )}
        {product.isBestseller && !product.isNew && (
          <span className="absolute top-3 left-3 bg-sage text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-pill">
            Bestseller
          </span>
        )}

        {/* Add to bag overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:block hidden">
          <button
            onClick={() => addItem(product, product.sizes[Math.floor(product.sizes.length / 2)])}
            className="w-full bg-gold-accessible text-white font-body font-medium text-sm py-2.5 rounded-pill hover:bg-cocoa transition-colors"
          >
            Add to Bag
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-cocoa leading-tight mb-1 hover:text-gold-accessible transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="font-body text-xs text-sage mb-2">{product.collection}</p>
        <div className="flex items-center gap-2">
          <span className="font-heading text-xl font-medium text-cocoa">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="font-body text-sm text-cocoa/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Mobile add to bag */}
        <button
          onClick={() => addItem(product, product.sizes[Math.floor(product.sizes.length / 2)])}
          className="sm:hidden mt-3 w-full bg-gold-accessible text-white font-body font-medium text-sm py-2.5 rounded-pill"
        >
          Add to Bag
        </button>
      </div>
    </div>
  )
}
