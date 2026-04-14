import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, MessageCircle, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function SavinraFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="bg-cocoa text-parchment">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src="/savinra-logo.svg" alt="SAVINRA" className="h-8 w-auto mb-2 brightness-200" />
            <p className="savinra-shine-on-dark font-heading italic text-base mb-4">House of Refined Living</p>
            <p className="font-body text-xs text-parchment/50 leading-relaxed mb-6">
              Crafting sustainable indo-western fashion since 2020. Every piece tells the story of an artisan's hands.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-gold rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors" aria-label="Instagram">
                <Instagram size={16} className="text-gold-highlight" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-gold rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors" aria-label="Facebook">
                <Facebook size={16} className="text-gold-highlight" />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-gold rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors" aria-label="WhatsApp">
                <MessageCircle size={16} className="text-gold-highlight" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.2em] text-gold-highlight mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: 'Shop All', href: '/shop' },
                { label: 'Collections', href: '/collections' },
                { label: 'New Arrivals', href: '/shop?sort=newest' },
                { label: 'Bestsellers', href: '/shop?filter=bestseller' },
                { label: 'Customise', href: '/shop?filter=customizable' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="font-body text-sm text-parchment/65 hover:text-gold-highlight transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.2em] text-gold-highlight mb-5">Help</h4>
            <ul className="space-y-3">
              {[
                { label: 'FAQs', href: '/help' },
                { label: 'Shipping Info', href: '/help#shipping' },
                { label: 'Returns & Exchanges', href: '/returns' },
                { label: 'Size Guide', href: '/help#sizing' },
                { label: 'Track Order', href: '/orders' },
                { label: 'Contact Us', href: '/help#contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="font-body text-sm text-parchment/65 hover:text-gold-highlight transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.2em] text-gold-highlight mb-5">Stay Connected</h4>
            <p className="font-body text-sm text-parchment/60 mb-4 leading-relaxed">
              New collections, craft stories and exclusive offers — delivered to your inbox.
            </p>
            {subscribed ? (
              <p className="font-body text-sm text-sage">You're on the list!</p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm font-body bg-parchment/10 border border-parchment/20 rounded-card text-parchment placeholder:text-parchment/35 focus:outline-none focus:border-gold/40"
                />
                <button
                  onClick={() => email.includes('@') && setSubscribed(true)}
                  className="px-3 py-2.5 bg-gold text-cocoa rounded-card hover:bg-gold-highlight transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
            <div className="mt-6 flex items-center gap-2">
              <Mail size={13} className="text-sage" />
              <a href="mailto:hello@savinra.com" className="font-body text-xs text-parchment/50 hover:text-gold-highlight transition-colors">hello@savinra.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/15">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-parchment/35">&copy; 2026 Savinra. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="font-body text-xs text-parchment/35 hover:text-gold-highlight transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="font-body text-xs text-parchment/35 hover:text-gold-highlight transition-colors">Terms of Use</Link>
            <span className="font-body text-xs text-parchment/20">Made with love in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
