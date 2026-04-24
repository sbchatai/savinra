import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: string
  from: 'bot' | 'user'
  text: string
  showWhatsApp?: boolean
}

const GREETING = 'Hi! Welcome to Savinra 👋 How can I help you today?'
const FALLBACK = "I'm not sure about that. Let me connect you with our team on WhatsApp!"
const WA_NUMBER = '919876543210'

const KB = [
  { keywords: ['shipping', 'delivery', 'ship', 'deliver'], answer: 'We offer free shipping on orders above ₹999. Standard delivery takes 5–7 business days across India.' },
  { keywords: ['return', 'exchange', 'refund'], answer: 'We have a hassle-free 15-day return policy. Items must be unworn and in original packaging.' },
  { keywords: ['size', 'sizing', 'fit', 'measurement'], answer: 'We offer sizes XS to XXL. Check our detailed size guide on each product page or in the Help section.' },
  { keywords: ['customise', 'customization', 'monogram', 'personalise', 'personalize'], answer: 'Many of our pieces can be personalised with monograms or custom details. Look for the customisation option on each product page.' },
  { keywords: ['payment', 'pay', 'cod', 'cash', 'upi', 'card'], answer: 'We accept UPI, credit/debit cards, net banking, and Cash on Delivery (COD) up to ₹5000.' },
  { keywords: ['track', 'order', 'status'], answer: 'Log into your account and go to My Orders to track your order in real-time.' },
  { keywords: ['fabric', 'material', 'cotton', 'silk', 'linen'], answer: 'We use premium natural fibres — organic cotton, pure silk, linen, and handwoven fabrics sourced from certified artisan cooperatives.' },
]

function getBotReply(text: string): { answer: string; showWhatsApp: boolean } {
  const lower = text.toLowerCase()
  for (const entry of KB) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return { answer: entry.answer, showWhatsApp: false }
    }
  }
  return { answer: FALLBACK, showWhatsApp: true }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [greeted, setGreeted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && !greeted) {
      setMessages([{ id: '0', from: 'bot', text: GREETING }])
      setGreeted(true)
    }
  }, [open, greeted])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: input.trim() }
    const { answer, showWhatsApp } = getBotReply(input)
    const botMsg: Message = { id: (Date.now() + 1).toString(), from: 'bot', text: answer, showWhatsApp }
    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gold-accessible text-white rounded-full shadow-lg flex items-center justify-center hover:bg-cocoa transition-all duration-300 motion-safe:hover:scale-110"
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open
            ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle size={22} />
              </motion.span>
            )
          }
        </AnimatePresence>
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 bg-parchment rounded-2xl shadow-2xl border border-gold/20 overflow-hidden z-50 flex flex-col"
            style={{ maxHeight: '480px' }}
            role="dialog"
            aria-label="Savinra Chat"
            aria-modal="true"
          >
            {/* Header */}
            <div className="bg-cocoa text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-heading text-base font-semibold">Chat with Savinra</h3>
                <p className="text-white/60 text-xs font-body">Typically replies within minutes</p>
              </div>
              <div className="flex items-center gap-2">
                {/* WhatsApp icon — opens WhatsApp in new tab */}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=Hi%2C+I+need+help+with+my+Savinra+order`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1ebe5d] transition-colors"
                  aria-label="Open WhatsApp"
                  title="Chat on WhatsApp"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ minHeight: '200px' }}
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.from === 'user' ? 'bg-gold-accessible text-white' : 'bg-ivory text-cocoa'}`}>
                    <p className="font-body text-sm leading-relaxed">{msg.text}</p>
                    {msg.showWhatsApp && (
                      <a
                        href={`https://wa.me/${WA_NUMBER}?text=Hi%2C+I+need+help+with+my+Savinra+order`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-1.5 text-xs font-body font-medium text-[#25D366] hover:underline"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Continue on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gold/20 p-3 flex gap-2 flex-shrink-0 bg-parchment">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask us anything..."
                aria-label="Type your message"
                className="flex-1 bg-ivory border border-cocoa/10 rounded-full px-4 py-2 text-sm font-body text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-gold-accessible"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-9 h-9 flex-shrink-0 bg-gold-accessible text-white rounded-full flex items-center justify-center hover:bg-cocoa transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
