import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
]

export default function SavinraHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { itemCount } = useCart()
  const { ids } = useWishlist()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gold-accessible text-parchment text-xs font-body text-center py-2 px-4 tracking-wide">
        Free shipping on orders above ₹999 &nbsp;&middot;&nbsp; Easy 15-day returns &nbsp;&middot;&nbsp; WhatsApp support available
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass shadow-md'
            : 'bg-parchment/90 backdrop-blur-sm border-b border-gold/20'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="savinra-shine-animated font-heading font-bold text-2xl tracking-widest">
                SAVINRA
              </span>
            </Link>

            {/* Center Nav (desktop) */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'font-body text-sm font-medium tracking-wide transition-colors',
                    location.pathname === link.href
                      ? 'text-gold-accessible'
                      : 'text-cocoa hover:text-gold-accessible'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button className="p-2 text-cocoa hover:text-gold-accessible transition-colors rounded-full hover:bg-ivory" aria-label="Search">
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 text-cocoa hover:text-gold-accessible transition-colors rounded-full hover:bg-ivory" aria-label="Wishlist">
                <Heart size={20} />
                {ids.size > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-gold-accessible text-white text-[10px] font-body font-medium rounded-full">
                    {ids.size}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link to="/account" className="hidden sm:block p-2 text-cocoa hover:text-gold-accessible transition-colors rounded-full hover:bg-ivory" aria-label="Account">
                <User size={20} />
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-cocoa hover:text-gold-accessible transition-colors rounded-full hover:bg-ivory" aria-label="Cart">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-gold-accessible text-white text-[10px] font-body font-medium rounded-full"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-cocoa ml-1"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-cocoa/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-parchment z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-gold/20">
                <span className="savinra-shine font-heading font-bold text-xl tracking-widest">SAVINRA</span>
                <button onClick={() => setMobileOpen(false)}><X size={20} className="text-cocoa" /></button>
              </div>
              <nav className="flex-1 p-5 flex flex-col gap-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center justify-between py-3 font-body text-base text-cocoa border-b border-gold/10 hover:text-gold-accessible transition-colors"
                  >
                    {link.label} <ChevronRight size={16} className="text-sage" />
                  </Link>
                ))}
              </nav>
              <div className="p-5 border-t border-gold/20">
                <Link to="/account" className="flex items-center gap-2 text-sm font-body text-gold-accessible">
                  <User size={16} /> Sign in / My Account
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
