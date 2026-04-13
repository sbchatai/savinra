import { useState, useMemo } from 'react'
import { FAQS } from '@/data/placeholder'
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, X } from 'lucide-react'

export default function HelpPage() {
  const categories = useMemo(() => [...new Set(FAQS.map(f => f.category))], [])
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [chatOpen, setChatOpen] = useState(false)

  const filteredFaqs = useMemo(() => {
    let faqs = FAQS
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      faqs = faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
    } else {
      faqs = faqs.filter(f => f.category === activeCategory)
    }
    return faqs
  }, [activeCategory, searchQuery])

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-heading text-5xl font-semibold text-cocoa mb-4">How can we help?</h1>
        <p className="font-body text-cocoa/60 mb-8">Search for answers or browse categories below</p>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/30" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-ivory border border-cocoa/10 rounded-pill pl-11 pr-4 py-3 font-body text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!searchQuery && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenFaq(null) }}
              className={`px-5 py-2 rounded-pill text-sm font-body font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-gold-accessible text-white'
                  : 'bg-ivory text-cocoa hover:bg-gold-highlight/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* FAQ Accordion */}
      <div className="space-y-3 mb-16">
        {filteredFaqs.map((faq, i) => (
          <div key={i} className="bg-ivory rounded-card shadow-card overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-body text-sm font-medium text-cocoa pr-4">{faq.question}</span>
              {openFaq === i
                ? <ChevronUp size={18} className="text-cocoa/40 shrink-0" />
                : <ChevronDown size={18} className="text-cocoa/40 shrink-0" />
              }
            </button>
            {openFaq === i && (
              <div className="px-5 pb-5 pt-0">
                <p className="font-body text-sm text-cocoa/70 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
        {filteredFaqs.length === 0 && (
          <p className="text-center font-body text-sm text-cocoa/50 py-8">No results found. Try a different search term.</p>
        )}
      </div>

      {/* Contact card */}
      <div className="bg-ivory rounded-card p-8 shadow-card text-center">
        <h2 className="font-heading text-2xl font-semibold text-cocoa mb-2">Still need help?</h2>
        <p className="font-body text-sm text-cocoa/60 mb-6">Our team is here for you</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/919876543210"
            className="inline-flex items-center justify-center gap-2 bg-success text-white font-body font-medium text-sm px-6 py-3 rounded-pill hover:bg-success/90 transition-colors"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
          <a
            href="mailto:support@savinra.com"
            className="inline-flex items-center justify-center gap-2 border-2 border-gold-accessible text-gold-accessible font-body font-medium text-sm px-6 py-3 rounded-pill hover:bg-gold-accessible hover:text-white transition-colors"
          >
            <Mail size={18} /> Email Support
          </a>
        </div>
      </div>

      {/* Floating chat bubble */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gold-accessible text-white rounded-full shadow-lg flex items-center justify-center hover:bg-cocoa transition-colors z-50"
      >
        {chatOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Mock chat panel */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-parchment rounded-card shadow-lg border border-gold/30 overflow-hidden z-50">
          <div className="bg-gold-accessible text-white p-4">
            <h3 className="font-heading text-lg font-semibold">Chat with us</h3>
            <p className="text-white/80 text-xs">Typically replies within minutes</p>
          </div>
          <div className="p-4 h-48 flex items-end">
            <div className="bg-ivory rounded-card p-3 max-w-[80%]">
              <p className="font-body text-sm text-cocoa">Hi! Welcome to SAVINRA. How can I help you today?</p>
              <p className="font-body text-[10px] text-cocoa/40 mt-1">Just now</p>
            </div>
          </div>
          <div className="border-t border-ivory p-3 flex gap-2">
            <input
              placeholder="Type a message..."
              className="flex-1 bg-ivory rounded-pill px-4 py-2 text-sm font-body text-cocoa placeholder:text-cocoa/40 focus:outline-none"
            />
            <button className="bg-gold-accessible text-white w-9 h-9 rounded-full flex items-center justify-center text-sm">
              &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
