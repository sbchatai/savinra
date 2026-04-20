import React, { useEffect, useRef, useState } from 'react'
import { supabase, assertSupabase } from '@/lib/supabase'

// Guard: prevent runtime crash when Supabase env vars are missing


interface CollectionFormData {
  name: string
  slug: string
  description: string
  occasion: string
  cover_image: string
  sort_order: string
  is_active: boolean
  meta_title: string
  meta_desc: string
}

interface Props {
  collectionId: string | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY_FORM: CollectionFormData = {
  name: '',
  slug: '',
  description: '',
  occasion: '',
  cover_image: '',
  sort_order: '0',
  is_active: true,
  meta_title: '',
  meta_desc: '',
}

const OCCASIONS = ['', 'festive', 'wedding', 'casual', 'work', 'party']

function inputClass() {
  return 'w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body'
}

function labelClass() {
  return 'block text-sm font-medium text-cocoa/70 font-body mb-1.5'
}

export default function CollectionFormModal({ collectionId, onClose, onSaved }: Props) {
  const isEditing = Boolean(collectionId)

  const [form, setForm] = useState<CollectionFormData>(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!collectionId) return
    supabase
      .from('collections')
      .select('*')
      .eq('id', collectionId)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            name: data.name,
            slug: data.slug,
            description: data.description ?? '',
            occasion: data.occasion ?? '',
            cover_image: data.cover_image ?? '',
            sort_order: String(data.sort_order ?? 0),
            is_active: data.is_active,
            meta_title: data.meta_title ?? '',
            meta_desc: data.meta_desc ?? '',
          })
          setSlugManuallyEdited(true)
        }
        setIsLoading(false)
      })
  }, [collectionId])

  function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((prev) => ({ ...prev, name, slug: slugManuallyEdited ? prev.slug : slugify(name) }))
  }

  function handleField(field: keyof CollectionFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleCheckbox(field: keyof CollectionFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.checked }))
    }
  }

  async function uploadCover(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const path = `collections/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: err } = await supabase!.storage
      .from('brand-assets')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (err) { console.error('Upload error:', err.message); return null }
    const { data } = supabase!.storage.from('brand-assets').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    const url = await uploadCover(file)
    setCoverUploading(false)
    if (url) setForm((prev) => ({ ...prev, cover_image: url }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description || null,
      occasion: form.occasion || null,
      cover_image: form.cover_image || null,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
      meta_title: form.meta_title || null,
      meta_desc: form.meta_desc || null,
    }

    try {
      if (isEditing && collectionId) {
        const { error: err } = await supabase!.from('collections').update(payload).eq('id', collectionId)
        if (err) throw err
      } else {
        const { error: err } = await supabase!.from('collections').insert(payload)
        if (err) throw err
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-parchment rounded-card shadow-xl border border-admin-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-admin-border">
          <h2 id="collection-modal-title" className="font-heading text-lg font-medium text-cocoa">
            {isEditing ? 'Edit Collection' : 'New Collection'}
          </h2>
          <button
            onClick={onClose}
            className="text-cocoa/40 hover:text-cocoa transition-colors"
            aria-label="Close modal"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-cocoa/40 font-body">Loading…</div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
            {/* Cover image */}
            <div>
              <label className={labelClass()}>Cover image</label>
              <div className="flex items-start gap-3">
                <div className="w-24 h-24 rounded-card border-2 border-dashed border-admin-border bg-ivory flex-shrink-0 overflow-hidden relative">
                  {coverUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
                    </div>
                  ) : form.cover_image ? (
                    <img src={form.cover_image} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cocoa/20" onClick={() => fileInputRef.current?.click()}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={coverUploading}
                    className="px-3 py-1.5 text-xs border border-admin-border rounded text-cocoa bg-white hover:bg-ivory transition-colors font-body disabled:opacity-50"
                  >
                    {coverUploading ? 'Uploading…' : form.cover_image ? 'Change image' : 'Upload cover'}
                  </button>
                  {form.cover_image && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, cover_image: '' }))}
                      className="ml-2 text-xs text-error/60 hover:text-error font-body transition-colors"
                    >
                      Remove
                    </button>
                  )}
                  <p className="text-xs text-cocoa/30 font-body mt-1">Recommended: 800×600px, JPG or PNG</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="col-name" className={labelClass()}>Name <span className="text-error" aria-hidden="true">*</span></label>
              <input id="col-name" type="text" required value={form.name} onChange={handleNameChange} className={inputClass()} placeholder="e.g. Festive Edit" />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="col-slug" className={labelClass()}>URL slug <span className="text-error" aria-hidden="true">*</span></label>
              <input
                id="col-slug" type="text" required value={form.slug}
                onChange={(e) => { setSlugManuallyEdited(true); handleField('slug')(e) }}
                className={`${inputClass()} font-mono`}
                placeholder="festive-edit"
              />
            </div>

            {/* Occasion + Sort */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="col-occasion" className={labelClass()}>Occasion</label>
                <select id="col-occasion" value={form.occasion} onChange={handleField('occasion')} className={inputClass()}>
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>{o ? o.charAt(0).toUpperCase() + o.slice(1) : '— None —'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="col-sort" className={labelClass()}>Sort order</label>
                <input id="col-sort" type="number" min="0" value={form.sort_order} onChange={handleField('sort_order')} className={inputClass()} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="col-desc" className={labelClass()}>Description</label>
              <textarea id="col-desc" rows={3} value={form.description} onChange={handleField('description')} className={`${inputClass()} resize-y`} placeholder="Curated pieces for the festive season…" />
            </div>

            {/* SEO */}
            <div className="space-y-3 border-t border-admin-border pt-4">
              <h3 className="text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">SEO</h3>
              <div>
                <label htmlFor="col-meta-title" className={labelClass()}>Meta title</label>
                <input id="col-meta-title" type="text" value={form.meta_title} onChange={handleField('meta_title')} className={inputClass()} placeholder="Festive Edit — SAVINRA" />
              </div>
              <div>
                <label htmlFor="col-meta-desc" className={labelClass()}>Meta description</label>
                <textarea id="col-meta-desc" rows={2} value={form.meta_desc} onChange={handleField('meta_desc')} className={`${inputClass()} resize-y`} placeholder="Handcrafted festive pieces…" />
              </div>
            </div>

            {/* Active */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={handleCheckbox('is_active')} className="w-4 h-4 rounded border-admin-border text-gold focus:ring-gold/40" />
              <span className="text-sm text-cocoa font-body">Active (visible in store)</span>
            </label>

            {error && (
              <p role="alert" className="text-sm text-error font-body bg-error/5 border border-error/20 rounded px-4 py-3">{error}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving || !form.name || !form.slug}
                className="px-6 py-2.5 bg-cocoa text-parchment text-sm font-semibold font-body rounded-pill hover:bg-cocoa/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Collection'}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-cocoa/60 font-body hover:text-cocoa transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}