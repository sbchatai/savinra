import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronRight, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCategories } from '@/hooks/useCategories'
import { cn } from '@/lib/utils'
import UserMenu from '@/components/auth/UserMenu'

const STATIC_NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
]

export default function SavinraHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null)

  const { itemCount } = useCart()
  const { ids } = useWishlist()
  const { categories } = useCategories()
  const location = useLocation()
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const shopBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu and mega-menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setMegaMenuOpen(false)
    setMobileCategoriesOpen(false)
    setMobileExpandedCategory(null)
  }, [location])

  // Close mega-menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(e.target as Node) &&
        shopBtnRef.current &&
        !shopBtnRef.current.contains(e.target as Node)
      ) {
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isShopActive = location.pathname.startsWith('/shop')

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
            : 'bg-parchment/90 backdrop-blur-sm border-b border-gold/20',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src="/savinra-logo.svg" alt="SAVINRA" className="h-9 w-auto" />
            </Link>

            {/* Center Nav (desktop) */}
            <nav className="hidden md:flex items-center gap-8">

              {/* Shop dropdown */}
              <div className="relative">
                <button
                  ref={shopBtnRef}
                  onClick={() => setMegaMenuOpen(v => !v)}
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  className={cn(
                    'flex items-center gap-1 font-body text-sm font-medium tracking-wide transition-colors',
                    isShopActive || megaMenuOpen
                      ? 'text-gold-accessible'
                      : 'text-cocoa hover:text-gold-accessible',
                  )}
                >
                  Shop
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform duration-200', megaMenuOpen && 'rotate-180')}
                  />
                </button>
              </div>

              {/* Collections */}
              <Link
                to="/collections"
                className={cn(
                  'font-body text-sm font-medium tracking-wide transition-colors',
                  location.pathname === '/collections'
                    ? 'text-gold-accessible'
                    : 'text-cocoa hover:text-gold-accessible',
                )}
              >
                Collections
              </Link>

              {STATIC_NAV_LINKS.slice(1).map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'font-body text-sm font-medium tracking-wide transition-colors',
                    location.pathname === link.href
                      ? 'text-gold-accessible'
                      : 'text-cocoa hover:text-gold-accessible',
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

              {/* Account */}
              <UserMenu />

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

        {/* Mega-menu (desktop) */}
        <AnimatePresence>
          {megaMenuOpen && categories.length > 0 && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              onMouseLeave={() => setMegaMenuOpen(false)}
              className="hidden md:block absolute left-0 right-0 top-full bg-parchment border-t border-gold/20 shadow-xl z-50"
            >
              <div className="max-w-7xl mx-auto px-6 py-8">
                {/* "All products" link */}
                <div className="mb-6 flex items-center justify-between">
                  <Link
                    to="/shop"
                    className="font-heading text-sm font-semibold text-cocoa uppercase tracking-widest hover:text-gold-accessible transition-colors"
                  >
                    Browse All →
                  </Link>
                </div>

                {/* Category columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {categories.map(cat => (
                    <div key={cat.slug}>
                      {/* Category heading */}
                      <Link
                        to={`/shop/${cat.slug}`}
                        className="block font-body text-sm font-semibold text-cocoa mb-3 hover:text-gold-accessible transition-colors uppercase tracking-wide"
                      >
                        {cat.name}
                      </Link>

                      {/* Subcategory links */}
                      {cat.subcategories.length > 0 && (
                        <ul className="space-y-2">
                          {cat.subcategories.map(sub => (
                            <li key={sub.slug}>
                              <Link
                                to={`/shop/${cat.slug}/${sub.slug}`}
                                className="font-body text-sm text-cocoa/70 hover:text-gold-accessible transition-colors"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              className="fixed left-0 top-0 bottom-0 w-72 bg-parchment z-50 md:hidden flex flex-col overflow-y-auto"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between p-5 border-b border-gold/20 shrink-0">
                <img src="/savinra-logo.svg" alt="SAVINRA" className="h-7 w-auto" />
                <button onClick={() => setMobileOpen(false)}><X size={20} className="text-cocoa" /></button>
              </div>

              <nav className="flex-1 p-5 flex flex-col gap-1">
                {/* Shop with categories accordion */}
                <div>
                  <button
                    onClick={() => setMobileCategoriesOpen(v => !v)}
                    className={cn(
                      'w-full flex items-center justify-between py-3 font-body text-base border-b border-gold/10 transition-colors',
                      isShopActive ? 'text-gold-accessible' : 'text-cocoa hover:text-gold-accessible',
                    )}
                  >
                    <span>Shop</span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        'text-sage transition-transform duration-200',
                        mobileCategoriesOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileCategoriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-3 pl-3 space-y-1">
                          {/* All products */}
                          <Link
                            to="/shop"
                            className="block py-2 font-body text-sm text-gold-accessible font-medium"
                          >
                            Browse All →
                          </Link>

                          {categories.map(cat => (
                            <div key={cat.slug}>
                              {/* Category row */}
                              <div className="flex items-center justify-between">
                                <Link
                                  to={`/shop/${cat.slug}`}
                                  className="flex-1 py-2 font-body text-sm font-semibold text-cocoa hover:text-gold-accessible transition-colors"
                                >
                                  {cat.name}
                                </Link>
                                {cat.subcategories.length > 0 && (
                                  <button
                                    onClick={() =>
                                      setMobileExpandedCategory(prev =>
                                        prev === cat.slug ? null : cat.slug,
                                      )
                                    }
                                    className="p-1"
                                  >
                                    <ChevronRight
                                      size={14}
                                      className={cn(
                                        'text-cocoa/40 transition-transform duration-200',
                                        mobileExpandedCategory === cat.slug && 'rotate-90',
                                      )}
                                    />
                                  </button>
                                )}
                              </div>

                              {/* Subcategories */}
                              <AnimatePresence>
                                {mobileExpandedCategory === cat.slug &&
                                  cat.subcategories.length > 0 && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                      className="overflow-hidden pl-3"
                                    >
                                      {cat.subcategories.map(sub => (
                                        <Link
                                          key={sub.slug}
                                          to={`/shop/${cat.slug}/${sub.slug}`}
                                          className="block py-1.5 font-body text-sm text-cocoa/70 hover:text-gold-accessible transition-colors"
                                        >
                                          {sub.name}
                                        </Link>
                                      ))}
                                    </motion.div>
                                  )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Collections */}
                <Link
                  to="/collections"
                  className="flex items-center justify-between py-3 font-body text-base text-cocoa border-b border-gold/10 hover:text-gold-accessible transition-colors"
                >
                  Collections <ChevronRight size={16} className="text-sage" />
                </Link>

                {/* Static nav links (About, Help) */}
                {STATIC_NAV_LINKS.slice(1).map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center justify-between py-3 font-body text-base text-cocoa border-b border-gold/10 hover:text-gold-accessible transition-colors"
                  >
                    {link.label} <ChevronRight size={16} className="text-sage" />
                  </Link>
                ))}
              </nav>

              <div className="p-5 border-t border-gold/20 shrink-0">
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
