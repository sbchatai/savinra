import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, MessageCircle } from 'lucide-react'

export default function SavinraFooter() {
  return (
    <footer className="bg-cocoa text-parchment">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3 className="savinra-shine-on-dark font-heading text-3xl font-bold mb-2">SAVINRA</h3>
          <p className="savinra-shine-on-dark font-heading text-base mb-4">House of Refined Living</p>
          <p className="text-parchment/70 text-sm leading-relaxed">
            Sustainably crafted indo-western fashion that honours heritage craft while embracing contemporary elegance.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-heading text-lg font-semibold mb-4 text-gold-highlight">Quick Links</h4>
          <nav className="flex flex-col gap-2">
            {[
              { label: 'Shop All', href: '/shop' },
              { label: 'Collections', href: '/collections' },
              { label: 'My Orders', href: '/orders' },
              { label: 'Help & FAQ', href: '/help' },
              { label: 'Size Guide', href: '/help' },
            ].map(link => (
              <Link
                key={link.href + link.label}
                to={link.href}
                className="text-parchment/70 hover:text-gold-highlight text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact & newsletter */}
        <div>
          <h4 className="font-heading text-lg font-semibold mb-4 text-gold-highlight">Stay Connected</h4>
          <div className="flex flex-col gap-3 mb-6">
            <a href="mailto:hello@savinra.com" className="flex items-center gap-2 text-parchment/70 hover:text-gold-highlight text-sm transition-colors">
              <Mail size={16} /> hello@savinra.com
            </a>
            <a href="https://wa.me/919876543210" className="flex items-center gap-2 text-parchment/70 hover:text-gold-highlight text-sm transition-colors">
              <MessageCircle size={16} /> WhatsApp Support
            </a>
          </div>
          <div className="flex gap-4 mb-6">
            <a href="#" className="text-parchment/70 hover:text-gold-highlight transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-parchment/70 hover:text-gold-highlight transition-colors"><Facebook size={20} /></a>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-parchment/10 border border-parchment/20 rounded-pill px-4 py-2 text-sm text-parchment placeholder:text-parchment/40 focus:outline-none focus:border-gold"
            />
            <button className="bg-gold text-cocoa font-body font-medium text-sm px-5 py-2 rounded-pill hover:bg-gold-highlight transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-parchment/10 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-parchment/50">
          <p>&copy; 2026 SAVINRA. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold-highlight transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-highlight transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
