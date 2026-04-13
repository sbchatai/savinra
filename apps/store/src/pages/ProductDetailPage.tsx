import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react'
import { PRODUCTS } from '@/data/placeholder'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatPrice } from '@/lib/utils'
import ProductCard from '@/components/product/ProductCard'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const product = PRODUCTS.find(p => p.slug === slug)
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const [selectedSize, setSelectedSize] = useState('')
  const [mainImage, setMainImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [descOpen, setDescOpen] = useState(true)
  const [fabricOpen, setFabricOpen] = useState(false)
  const [careOpen, setCareOpen] = useState(false)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl text-cocoa mb-4">Product not found</h1>
        <Link to="/shop" className="text-gold-accessible font-body font-medium hover:underline">
          Back to Shop
        </Link>
      </div>
    )
  }

  const wishlisted = has(product.id)
  const others = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3)

  const handleAddToBag = () => {
    const size = selectedSize || product.sizes[Math.floor(product.sizes.length / 2)]
    addItem(product, size, qty)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-body text-cocoa/60 mb-8">
        <Link to="/" className="hover:text-gold-accessible">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gold-accessible">Shop</Link>
        <span>/</span>
        <Link to={`/collections/${product.collectionSlug}`} className="hover:text-gold-accessible">{product.collection}</Link>
        <span>/</span>
        <span className="text-cocoa">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="aspect-[3/4] overflow-hidden rounded-card mb-4">
            <img
              src={product.images[mainImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(i)}
                className={`w-20 h-24 overflow-hidden rounded-card border-2 transition-colors ${
                  i === mainImage ? 'border-gold-accessible' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {/* Badges */}
          <div className="flex gap-2 mb-3">
            {product.isNew && (
              <span className="bg-gold-accessible text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-pill">New</span>
            )}
            {product.isBestseller && (
              <span className="bg-sage text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-pill">Bestseller</span>
            )}
          </div>

          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-cocoa mb-2">{product.name}</h1>
          <p className="font-body text-sm text-sage mb-4">{product.collection}</p>

          {/* Price */}
          <div className="flex items-center gap-3 mb-8">
            <span className="font-heading text-3xl font-medium text-cocoa">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="font-body text-lg text-cocoa/40 line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="bg-success/10 text-success text-xs font-bold px-2 py-1 rounded-pill">
                  {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-sm font-medium text-cocoa">Size</span>
              <button className="font-body text-xs text-gold-accessible hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] px-4 py-2 rounded-pill text-sm font-body font-medium border transition-colors ${
                    selectedSize === size
                      ? 'bg-gold-accessible text-white border-gold-accessible'
                      : 'border-cocoa/20 text-cocoa hover:border-gold-accessible'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <span className="font-body text-sm font-medium text-cocoa mb-3 block">Quantity</span>
            <div className="inline-flex items-center border border-cocoa/20 rounded-pill">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center text-cocoa hover:text-gold-accessible"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-body text-sm">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 flex items-center justify-center text-cocoa hover:text-gold-accessible"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToBag}
              className="flex-1 bg-gold-accessible text-white font-body font-medium text-sm py-3.5 rounded-pill hover:bg-cocoa transition-colors"
            >
              Add to Bag
            </button>
            <button
              onClick={() => toggle(product.id)}
              className={`w-14 h-14 flex items-center justify-center rounded-pill border-2 transition-colors ${
                wishlisted ? 'border-error bg-error/5' : 'border-cocoa/20 hover:border-gold-accessible'
              }`}
            >
              <Heart size={20} className={wishlisted ? 'fill-error text-error' : 'text-cocoa'} />
            </button>
          </div>

          {/* Stock */}
          {product.stockCount <= 5 && (
            <p className="text-warning text-sm font-body mb-6">Only {product.stockCount} left in stock</p>
          )}

          {/* Accordions */}
          <div className="border-t border-ivory">
            {/* Description */}
            <button
              onClick={() => setDescOpen(!descOpen)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-body text-sm font-medium text-cocoa">Description</span>
              {descOpen ? <ChevronUp size={18} className="text-cocoa/60" /> : <ChevronDown size={18} className="text-cocoa/60" />}
            </button>
            {descOpen && (
              <p className="font-body text-sm text-cocoa/70 leading-relaxed pb-4">{product.description}</p>
            )}

            {/* Fabric */}
            <div className="border-t border-ivory">
              <button
                onClick={() => setFabricOpen(!fabricOpen)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="font-body text-sm font-medium text-cocoa">Fabric & Material</span>
                {fabricOpen ? <ChevronUp size={18} className="text-cocoa/60" /> : <ChevronDown size={18} className="text-cocoa/60" />}
              </button>
              {fabricOpen && (
                <p className="font-body text-sm text-cocoa/70 leading-relaxed pb-4">
                  Material: {product.fabric}. Handcrafted in India with ethically sourced materials. Each piece may have slight variations due to the artisan process.
                </p>
              )}
            </div>

            {/* Care */}
            <div className="border-t border-ivory">
              <button
                onClick={() => setCareOpen(!careOpen)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="font-body text-sm font-medium text-cocoa">Care Instructions</span>
                {careOpen ? <ChevronUp size={18} className="text-cocoa/60" /> : <ChevronDown size={18} className="text-cocoa/60" />}
              </button>
              {careOpen && (
                <p className="font-body text-sm text-cocoa/70 leading-relaxed pb-4">
                  Dry clean recommended. Store in a cool, dry place away from direct sunlight. Iron on low heat with a pressing cloth.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look */}
      <section className="mt-20 mb-12">
        <h2 className="font-heading text-3xl font-semibold text-cocoa mb-8">Complete the Look</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {others.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
