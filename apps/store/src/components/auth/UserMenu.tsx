import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, ChevronDown, ShoppingBag, Heart, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export default function UserMenu() {
  const { user, customer, signOut, openAuthModal } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal('signin')}
        className="font-body text-sm text-cocoa/70 hover:text-cocoa transition-colors hidden sm:block"
      >
        Sign In
      </button>
    )
  }

  // Initials avatar
  const initials = customer?.full_name
    ? customer.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 group"
      >
        <span className="w-8 h-8 rounded-full bg-gold-accessible text-white font-body text-xs font-semibold flex items-center justify-center">
          {initials}
        </span>
        <ChevronDown size={14} className={cn('text-cocoa/50 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-cocoa/10 py-1 z-50">
          <div className="px-4 py-2.5 border-b border-cocoa/8">
            <p className="font-body text-xs font-semibold text-cocoa truncate">
              {customer?.full_name || 'My Account'}
            </p>
            <p className="font-body text-xs text-cocoa/50 truncate">{user.email}</p>
          </div>

          <Link
            to="/account/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-cocoa hover:bg-parchment transition-colors"
          >
            <ShoppingBag size={15} className="text-cocoa/50" />
            My Orders
          </Link>
          <Link
            to="/account/wishlist"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-cocoa hover:bg-parchment transition-colors"
          >
            <Heart size={15} className="text-cocoa/50" />
            Wishlist
          </Link>
          <Link
            to="/account/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-cocoa hover:bg-parchment transition-colors"
          >
            <User size={15} className="text-cocoa/50" />
            My Profile
          </Link>

          <div className="border-t border-cocoa/8 mt-1">
            <button
              onClick={() => { signOut(); setOpen(false) }}
              className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
