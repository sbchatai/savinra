import { useEffect, useState } from 'react'
import { supabase, assertSupabase } from '@/lib/supabase'

interface KbEntry {
  id: string
  keywords: string[]
  answer: string
}

interface ChatbotSettings {
  is_enabled: boolean
  greeting_message: string
  fallback_message: string
  handoff_message: string
  whatsapp_number: string
  knowledge_base: KbEntry[]
}

const DEFAULT: ChatbotSettings = {
  is_enabled: true,
  greeting_message: 'Hi! Welcome to Savinra \uD83D\uDC4B How can I help you today?',
  fallback_message: "I'm not sure about that. Let me connect you with our team on WhatsApp!",
  handoff_message: 'Chat with us directly for personalised assistance.',
  whatsapp_number: '919876543210',
  knowledge_base: [],
}

function inputCls() {
  return 'w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body'
}

function labelCls() {
  return 'block text-sm font-medium text-cocoa/70 font-body mb-1.5'
}

// ─── Inline SVG icons (lucide-react not in project deps) ──────────────────────

function IconPlus() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

function IconSave() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

export default function ChatbotPage() {
  const [settings, setSettings] = useState<ChatbotSettings>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newEntry, setNewEntry] = useState({ keywords: '', answer: '' })

  useEffect(() => {
    assertSupabase()
    async function load() {
      // chatbot_settings is not yet in the generated Database types — cast through any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any).from('chatbot_settings').select('*').eq('id', 1).single()
      if (data) {
        setSettings({
          is_enabled: data.is_enabled,
          greeting_message: data.greeting_message,
          fallback_message: data.fallback_message,
          handoff_message: data.handoff_message,
          whatsapp_number: data.whatsapp_number,
          knowledge_base: Array.isArray(data.knowledge_base) ? data.knowledge_base : [],
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const save = async () => {
    assertSupabase()
    setSaving(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('chatbot_settings').update({
      is_enabled: settings.is_enabled,
      greeting_message: settings.greeting_message,
      fallback_message: settings.fallback_message,
      handoff_message: settings.handoff_message,
      whatsapp_number: settings.whatsapp_number,
      knowledge_base: settings.knowledge_base,
      updated_at: new Date().toISOString(),
    }).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const addEntry = () => {
    if (!newEntry.keywords.trim() || !newEntry.answer.trim()) return
    const entry: KbEntry = {
      id: Date.now().toString(),
      keywords: newEntry.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean),
      answer: newEntry.answer.trim(),
    }
    setSettings(s => ({ ...s, knowledge_base: [...s.knowledge_base, entry] }))
    setNewEntry({ keywords: '', answer: '' })
  }

  const removeEntry = (id: string) => {
    setSettings(s => ({ ...s, knowledge_base: s.knowledge_base.filter(e => e.id !== id) }))
  }

  const updateEntry = (id: string, field: 'keywords' | 'answer', value: string) => {
    setSettings(s => ({
      ...s,
      knowledge_base: s.knowledge_base.map(e =>
        e.id === id
          ? {
              ...e,
              [field]: field === 'keywords'
                ? value.split(',').map(k => k.trim().toLowerCase()).filter(Boolean)
                : value,
            }
          : e
      ),
    }))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl space-y-8">

      {/* Enable toggle */}
      <div className="bg-white border border-admin-border rounded-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-semibold text-cocoa">Chatbot Status</h2>
            <p className="font-body text-sm text-cocoa/50 mt-1">Toggle the chat widget on the store on or off.</p>
          </div>
          <button
            onClick={() => setSettings(s => ({ ...s, is_enabled: !s.is_enabled }))}
            aria-pressed={settings.is_enabled}
            aria-label={settings.is_enabled ? 'Disable chatbot' : 'Enable chatbot'}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.is_enabled ? 'bg-gold-accessible' : 'bg-cocoa/20'}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${settings.is_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white border border-admin-border rounded-card p-6 space-y-4">
        <h2 className="font-heading text-base font-semibold text-cocoa mb-2">Bot Messages</h2>

        <div>
          <label htmlFor="greeting_message" className={labelCls()}>Greeting (shown when chat opens)</label>
          <textarea
            id="greeting_message"
            rows={2}
            value={settings.greeting_message}
            onChange={e => setSettings(s => ({ ...s, greeting_message: e.target.value }))}
            className={`${inputCls()} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="fallback_message" className={labelCls()}>Fallback (when no KB match found)</label>
          <textarea
            id="fallback_message"
            rows={2}
            value={settings.fallback_message}
            onChange={e => setSettings(s => ({ ...s, fallback_message: e.target.value }))}
            className={`${inputCls()} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="handoff_message" className={labelCls()}>Handoff message (shown above WhatsApp button on fallback)</label>
          <input
            id="handoff_message"
            type="text"
            value={settings.handoff_message}
            onChange={e => setSettings(s => ({ ...s, handoff_message: e.target.value }))}
            className={inputCls()}
          />
        </div>

        <div>
          <label htmlFor="whatsapp_number" className={labelCls()}>WhatsApp number (digits only, with country code)</label>
          <input
            id="whatsapp_number"
            type="text"
            value={settings.whatsapp_number}
            onChange={e => setSettings(s => ({ ...s, whatsapp_number: e.target.value }))}
            placeholder="919876543210"
            className={inputCls()}
          />
          <p className="mt-1 text-xs text-cocoa/40 font-body">E.g. 919876543210 for +91 98765 43210</p>
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="bg-white border border-admin-border rounded-card p-6 space-y-4">
        <div>
          <h2 className="font-heading text-base font-semibold text-cocoa mb-1">Knowledge Base</h2>
          <p className="font-body text-sm text-cocoa/50">When a customer message contains any of the keywords, the bot replies with the answer.</p>
        </div>

        {/* Existing entries */}
        <div className="space-y-3">
          {settings.knowledge_base.map((entry) => (
            <div key={entry.id} className="border border-admin-border rounded-card p-4 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor={`kb-keywords-${entry.id}`} className={labelCls()}>Keywords (comma-separated)</label>
                  <input
                    id={`kb-keywords-${entry.id}`}
                    type="text"
                    value={entry.keywords.join(', ')}
                    onChange={e => updateEntry(entry.id, 'keywords', e.target.value)}
                    className={inputCls()}
                    placeholder="shipping, delivery, deliver"
                  />
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="self-end mb-0.5 p-2 text-error/60 hover:text-error transition-colors"
                  aria-label="Remove entry"
                  title="Remove"
                >
                  <IconTrash />
                </button>
              </div>
              <div>
                <label htmlFor={`kb-answer-${entry.id}`} className={labelCls()}>Bot answer</label>
                <textarea
                  id={`kb-answer-${entry.id}`}
                  rows={2}
                  value={entry.answer}
                  onChange={e => updateEntry(entry.id, 'answer', e.target.value)}
                  className={`${inputCls()} resize-y`}
                />
              </div>
            </div>
          ))}
          {settings.knowledge_base.length === 0 && (
            <p className="text-sm text-cocoa/40 font-body text-center py-6">No entries yet. Add your first Q&amp;A below.</p>
          )}
        </div>

        {/* Add new entry */}
        <div className="border-t border-admin-border pt-4 space-y-3">
          <p className="font-body text-sm font-medium text-cocoa/70">Add new entry</p>
          <div>
            <label htmlFor="new_entry_keywords" className={labelCls()}>Keywords (comma-separated)</label>
            <input
              id="new_entry_keywords"
              type="text"
              value={newEntry.keywords}
              onChange={e => setNewEntry(n => ({ ...n, keywords: e.target.value }))}
              placeholder="returns, refund, exchange"
              className={inputCls()}
            />
          </div>
          <div>
            <label htmlFor="new_entry_answer" className={labelCls()}>Bot answer</label>
            <textarea
              id="new_entry_answer"
              rows={2}
              value={newEntry.answer}
              onChange={e => setNewEntry(n => ({ ...n, answer: e.target.value }))}
              placeholder="We have a 15-day return policy..."
              className={`${inputCls()} resize-y`}
            />
          </div>
          <button
            onClick={addEntry}
            disabled={!newEntry.keywords.trim() || !newEntry.answer.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-ivory border border-admin-border rounded text-sm font-body font-medium text-cocoa hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconPlus /> Add entry
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gold-accessible text-white text-sm font-body font-medium rounded hover:bg-cocoa transition-colors disabled:opacity-60"
        >
          <IconSave />
          {saving ? 'Saving\u2026' : saved ? '\u2713 Saved' : 'Save Changes'}
        </button>
        {saved && <p className="text-sm text-success font-body">All changes saved.</p>}
      </div>
    </div>
  )
}
