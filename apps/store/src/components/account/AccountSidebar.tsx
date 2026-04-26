import { Link, useLocation } from 'react-router-dom'
import { Package, Heart, User, RotateCcw } from 'lucide-react'

const LINKS = [
  { label: 'Profile', href: '/account', icon: User },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'My Orders', href: '/orders', icon: Package },
  { label: 'Returns', href: '/returns', icon: RotateCcw },
]

export default function AccountSidebar() {
  const { pathname } = useLocation()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <nav className="sticky top-24 flex flex-col gap-1">
          {LINKS.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-card text-sm font-body font-medium transition-colors ${
                  active
                    ? 'text-gold-accessible bg-ivory border-l-2 border-gold-accessible'
                    : 'text-cocoa hover:text-gold-accessible hover:bg-ivory/60'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile horizontal tabs */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-ivory">
        {LINKS.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-body font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-gold-accessible text-white'
                  : 'bg-ivory text-cocoa hover:bg-gold-highlight'
              }`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          )
        })}
      </div>
    </>
  )
}
