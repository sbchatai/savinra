import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/#story' },
  { label: 'Help', href: '/help' },
]

export default function SavinraHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { itemCount } = useCart()
  const { ids } = useWishlist()
  const location = useLocation()
  const wishCount = ids.size

  return (
    <header className="sticky top-0 z-50 bg-parchment border-b border-gold/30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-cocoa"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-gold text-lg">&loz;</span>
          <span className="savinra-shine font-heading text-2xl font-bold tracking-wide">
            SAVINRA
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-body text-sm font-medium transition-colors hover:text-gold-accessible ${
                location.pathname === link.href ? 'text-gold-accessible' : 'text-cocoa'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Link to="/shop" className="hidden sm:block text-cocoa hover:text-gold-accessible transition-colors">
            <Search size={20} />
          </Link>
          <Link to="/wishlist" className="relative text-cocoa hover:text-gold-accessible transition-colors">
            <Heart size={20} />
            {wishCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold-accessible text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </Link>
          <Link to="/account" className="hidden sm:block text-cocoa hover:text-gold-accessible transition-colors">
            <User size={20} />
          </Link>
          <Link to="/cart" className="relative text-cocoa hover:text-gold-accessible transition-colors">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold-accessible text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-parchment border-t border-gold/20 px-4 py-4">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-base font-medium text-cocoa hover:text-gold-accessible py-2 border-b border-ivory"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/account"
              onClick={() => setMobileOpen(false)}
              className="font-body text-base font-medium text-cocoa hover:text-gold-accessible py-2"
            >
              My Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
