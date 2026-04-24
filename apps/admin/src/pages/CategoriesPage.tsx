import React, { useEffect, useRef, useState } from 'react'
import { supabase, assertSupabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────

interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  sort_order: number
  is_active: boolean
  subcategories: Subcategory[]
}

// ── Shared style helpers ──────────────────────────────────────

function inputClass() {
  return 'w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body'
}

function labelClass() {
  return 'block text-sm font-medium text-cocoa/70 font-body mb-1.5'
}

// ── Slug helper ───────────────────────────────────────────────

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── CategoryFormModal ─────────────────────────────────────────

interface CategoryFormModalProps {
  initial?: Category | null
  onClose: () => void
  onSaved: () => void
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  cover_image: string
  sort_order: string
  is_active: boolean
  meta_title: string
  meta_desc: string
}

const EMPTY_CATEGORY: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  cover_image: '',
  sort_order: '0',
  is_active: true,
  meta_title: '',
  meta_desc: '',
}

function CategoryFormModal({ initial, onClose, onSaved }: CategoryFormModalProps) {
  assertSupabase()
  const isEditing = Boolean(initial)

  const [form, setForm] = useState<CategoryFormData>(
    initial
      ? {
          name: initial.name,
          slug: initial.slug,
          description: initial.description ?? '',
          cover_image: initial.cover_image ?? '',
          sort_order: String(initial.sort_order ?? 0),
          is_active: initial.is_active,
          meta_title: '',
          meta_desc: '',
        }
      : EMPTY_CATEGORY
  )
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing)
  const [coverUploading, setCoverUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load meta fields when editing
  useEffect(() => {
    if (!initial) return
    supabase
      .from('categories')
      .select('meta_title, meta_desc')
      .eq('id', initial.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm((prev) => ({
            ...prev,
            meta_title: data.meta_title ?? '',
            meta_desc: data.meta_desc ?? '',
          }))
        }
      })
  }, [initial])

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : toSlug(name),
    }))
  }

  function handleField(field: keyof CategoryFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleCheckbox(field: keyof CategoryFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.checked }))
    }
  }

  async function uploadCover(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const path = `categories/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
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
      cover_image: form.cover_image || null,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
      meta_title: form.meta_title || null,
      meta_desc: form.meta_desc || null,
    }

    try {
      if (isEditing && initial) {
        const { error: err } = await supabase!
          .from('categories')
          .update(payload)
          .eq('id', initial.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase!.from('categories').insert(payload)
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
      aria-labelledby="category-modal-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-parchment rounded-card shadow-xl border border-admin-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-admin-border">
          <h2 id="category-modal-title" className="font-heading text-lg font-medium text-cocoa">
            {isEditing ? 'Edit Category' : 'New Category'}
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
                  <div
                    className="w-full h-full flex items-center justify-center text-cocoa/20 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
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
                <p className="text-xs text-cocoa/30 font-body mt-1">Recommended: 800x600px, JPG or PNG</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="cat-name" className={labelClass()}>
              Name <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="cat-name"
              type="text"
              required
              value={form.name}
              onChange={handleNameChange}
              className={inputClass()}
              placeholder="e.g. Kurtas & Suits"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="cat-slug" className={labelClass()}>
              URL slug <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="cat-slug"
              type="text"
              required
              value={form.slug}
              onChange={(e) => { setSlugManuallyEdited(true); handleField('slug')(e) }}
              className={`${inputClass()} font-mono`}
              placeholder="kurtas-suits"
            />
          </div>

          {/* Sort order + active */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cat-sort" className={labelClass()}>Sort order</label>
              <input
                id="cat-sort"
                type="number"
                min="0"
                value={form.sort_order}
                onChange={handleField('sort_order')}
                className={inputClass()}
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleCheckbox('is_active')}
                  className="w-4 h-4 rounded border-admin-border text-gold focus:ring-gold/40"
                />
                <span className="text-sm text-cocoa font-body">Active</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="cat-desc" className={labelClass()}>Description</label>
            <textarea
              id="cat-desc"
              rows={3}
              value={form.description}
              onChange={handleField('description')}
              className={`${inputClass()} resize-y`}
              placeholder="Elegant kurtas and coordinated suits for every occasion…"
            />
          </div>

          {/* SEO */}
          <div className="space-y-3 border-t border-admin-border pt-4">
            <h3 className="text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">SEO</h3>
            <div>
              <label htmlFor="cat-meta-title" className={labelClass()}>Meta title</label>
              <input
                id="cat-meta-title"
                type="text"
                value={form.meta_title}
                onChange={handleField('meta_title')}
                className={inputClass()}
                placeholder="Kurtas & Suits — SAVINRA"
              />
            </div>
            <div>
              <label htmlFor="cat-meta-desc" className={labelClass()}>Meta description</label>
              <textarea
                id="cat-meta-desc"
                rows={2}
                value={form.meta_desc}
                onChange={handleField('meta_desc')}
                className={`${inputClass()} resize-y`}
                placeholder="Shop elegant kurtas and coordinated suits…"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-error font-body bg-error/5 border border-error/20 rounded px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving || !form.name || !form.slug}
              className="px-6 py-2.5 bg-cocoa text-parchment text-sm font-semibold font-body rounded-pill hover:bg-cocoa/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-cocoa/60 font-body hover:text-cocoa transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── SubcategoryFormModal ──────────────────────────────────────

interface SubcategoryFormModalProps {
  categoryId: string
  categoryName: string
  initial?: Subcategory | null
  onClose: () => void
  onSaved: () => void
}

interface SubcategoryFormData {
  name: string
  slug: string
  description: string
  sort_order: string
  is_active: boolean
}

const EMPTY_SUBCATEGORY: SubcategoryFormData = {
  name: '',
  slug: '',
  description: '',
  sort_order: '0',
  is_active: true,
}

function SubcategoryFormModal({
  categoryId,
  categoryName,
  initial,
  onClose,
  onSaved,
}: SubcategoryFormModalProps) {
  assertSupabase()
  const isEditing = Boolean(initial)

  const [form, setForm] = useState<SubcategoryFormData>(
    initial
      ? {
          name: initial.name,
          slug: initial.slug,
          description: initial.description ?? '',
          sort_order: String(initial.sort_order ?? 0),
          is_active: initial.is_active,
        }
      : EMPTY_SUBCATEGORY
  )
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : toSlug(name),
    }))
  }

  function handleField(field: keyof SubcategoryFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleCheckbox(field: keyof SubcategoryFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.checked }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    const payload = {
      category_id: categoryId,
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description || null,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    }

    try {
      if (isEditing && initial) {
        const { error: err } = await supabase!
          .from('subcategories')
          .update(payload)
          .eq('id', initial.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase!.from('subcategories').insert(payload)
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
      aria-labelledby="subcategory-modal-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-parchment rounded-card shadow-xl border border-admin-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-admin-border">
          <div>
            <h2 id="subcategory-modal-title" className="font-heading text-lg font-medium text-cocoa">
              {isEditing ? 'Edit Subcategory' : 'New Subcategory'}
            </h2>
            <p className="text-xs text-cocoa/50 font-body mt-0.5">in {categoryName}</p>
          </div>
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

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="subcat-name" className={labelClass()}>
              Name <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="subcat-name"
              type="text"
              required
              value={form.name}
              onChange={handleNameChange}
              className={inputClass()}
              placeholder="e.g. Straight Kurtas"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="subcat-slug" className={labelClass()}>
              URL slug <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="subcat-slug"
              type="text"
              required
              value={form.slug}
              onChange={(e) => { setSlugManuallyEdited(true); handleField('slug')(e) }}
              className={`${inputClass()} font-mono`}
              placeholder="straight-kurtas"
            />
          </div>

          {/* Sort order + active */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="subcat-sort" className={labelClass()}>Sort order</label>
              <input
                id="subcat-sort"
                type="number"
                min="0"
                value={form.sort_order}
                onChange={handleField('sort_order')}
                className={inputClass()}
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleCheckbox('is_active')}
                  className="w-4 h-4 rounded border-admin-border text-gold focus:ring-gold/40"
                />
                <span className="text-sm text-cocoa font-body">Active</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="subcat-desc" className={labelClass()}>Description</label>
            <textarea
              id="subcat-desc"
              rows={2}
              value={form.description}
              onChange={handleField('description')}
              className={`${inputClass()} resize-y`}
              placeholder="Brief description of this subcategory…"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-error font-body bg-error/5 border border-error/20 rounded px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving || !form.name || !form.slug}
              className="px-6 py-2.5 bg-cocoa text-parchment text-sm font-semibold font-body rounded-pill hover:bg-cocoa/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Subcategory'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-cocoa/60 font-body hover:text-cocoa transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── CategoriesPage ────────────────────────────────────────────

type ModalState =
  | { type: 'none' }
  | { type: 'new-category' }
  | { type: 'edit-category'; category: Category }
  | { type: 'new-subcategory'; categoryId: string; categoryName: string }
  | { type: 'edit-subcategory'; categoryId: string; categoryName: string; subcategory: Subcategory }

export default function CategoriesPage() {
  assertSupabase()

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>({ type: 'none' })

  useEffect(() => { loadCategories() }, [])

  async function loadCategories() {
    setIsLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*, subcategories(id, category_id, name, slug, description, sort_order, is_active)')
      .order('sort_order', { ascending: true })

    setCategories(
      (data ?? []).map((c: any) => ({
        ...c,
        subcategories: (c.subcategories ?? []).sort(
          (a: Subcategory, b: Subcategory) => a.sort_order - b.sort_order
        ),
      }))
    )
    setIsLoading(false)
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function deleteCategory(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"? All subcategories will be removed and products will be uncategorised.`)) return
    setDeletingId(cat.id)
    await supabase!.from('categories').delete().eq('id', cat.id)
    setCategories((prev) => prev.filter((c) => c.id !== cat.id))
    setDeletingId(null)
  }

  async function deleteSubcategory(sub: Subcategory) {
    if (!confirm(`Delete subcategory "${sub.name}"?`)) return
    setDeletingId(sub.id)
    await supabase!.from('subcategories').delete().eq('id', sub.id)
    setCategories((prev) =>
      prev.map((c) =>
        c.id === sub.category_id
          ? { ...c, subcategories: c.subcategories.filter((s) => s.id !== sub.id) }
          : c
      )
    )
    setDeletingId(null)
  }

  function closeModal() { setModal({ type: 'none' }) }
  function onSaved() { loadCategories(); closeModal() }

  return (
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="sr-only">Categories</h2>

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-cocoa/60 font-body">
          {isLoading ? 'Loading…' : `${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`}
        </p>
        <button
          onClick={() => setModal({ type: 'new-category' })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 transition-colors"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Categories list */}
      <div className="bg-parchment rounded-card shadow-card border border-admin-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-cocoa/40 font-body">Loading categories…</div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-cocoa/40 font-body">
            No categories yet.
            <button
              onClick={() => setModal({ type: 'new-category' })}
              className="mt-3 text-gold hover:text-gold/80 font-medium text-sm transition-colors"
            >
              Create your first category
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-admin-border/50">
            {categories.map((cat) => {
              const isExpanded = expandedIds.has(cat.id)
              return (
                <li key={cat.id}>
                  {/* Category row */}
                  <div className="flex items-center gap-3 px-5 py-4 hover:bg-ivory/60 transition-colors group">
                    {/* Expand toggle */}
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className="text-cocoa/40 hover:text-cocoa transition-colors flex-shrink-0"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                    >
                      {isExpanded ? (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      )}
                    </button>

                    {/* Cover thumbnail */}
                    <div className="w-10 h-10 rounded-card overflow-hidden bg-admin-border/20 flex-shrink-0">
                      {cat.cover_image ? (
                        <img src={cat.cover_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cocoa/20">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-cocoa font-body text-sm">{cat.name}</span>
                        {!cat.is_active && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 font-body">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-cocoa/40 font-mono">{cat.slug}</span>
                        <span className="text-xs text-cocoa/40 font-body">
                          {cat.subcategories.length} subcategor{cat.subcategories.length === 1 ? 'y' : 'ies'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          setModal({
                            type: 'new-subcategory',
                            categoryId: cat.id,
                            categoryName: cat.name,
                          })
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-admin-border rounded text-cocoa bg-white hover:bg-ivory transition-colors font-body"
                        title="Add subcategory"
                      >
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add sub
                      </button>
                      <button
                        onClick={() => setModal({ type: 'edit-category', category: cat })}
                        className="p-1.5 text-cocoa/50 hover:text-cocoa transition-colors rounded"
                        aria-label={`Edit ${cat.name}`}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteCategory(cat)}
                        disabled={deletingId === cat.id}
                        className="p-1.5 text-error/50 hover:text-error transition-colors rounded disabled:opacity-50"
                        aria-label={`Delete ${cat.name}`}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Subcategories accordion */}
                  {isExpanded && (
                    <div className="bg-ivory/40 border-t border-admin-border/30">
                      {cat.subcategories.length === 0 ? (
                        <div className="pl-16 pr-5 py-3 text-xs text-cocoa/40 font-body italic">
                          No subcategories yet.{' '}
                          <button
                            onClick={() =>
                              setModal({
                                type: 'new-subcategory',
                                categoryId: cat.id,
                                categoryName: cat.name,
                              })
                            }
                            className="text-gold hover:text-gold/80 not-italic font-medium transition-colors"
                          >
                            Add one
                          </button>
                        </div>
                      ) : (
                        <ul className="divide-y divide-admin-border/20">
                          {cat.subcategories.map((sub) => (
                            <li
                              key={sub.id}
                              className="flex items-center gap-3 pl-16 pr-5 py-2.5 hover:bg-ivory/80 transition-colors group/sub"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-cocoa font-body">{sub.name}</span>
                                  {!sub.is_active && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500 font-body">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-cocoa/40 font-mono">{sub.slug}</span>
                              </div>
                              <div className="flex items-center gap-1.5 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                <button
                                  onClick={() =>
                                    setModal({
                                      type: 'edit-subcategory',
                                      categoryId: cat.id,
                                      categoryName: cat.name,
                                      subcategory: sub,
                                    })
                                  }
                                  className="p-1.5 text-cocoa/50 hover:text-cocoa transition-colors rounded"
                                  aria-label={`Edit ${sub.name}`}
                                >
                                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteSubcategory(sub)}
                                  disabled={deletingId === sub.id}
                                  className="p-1.5 text-error/50 hover:text-error transition-colors rounded disabled:opacity-50"
                                  aria-label={`Delete ${sub.name}`}
                                >
                                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                                  </svg>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Modals */}
      {modal.type === 'new-category' && (
        <CategoryFormModal onClose={closeModal} onSaved={onSaved} />
      )}
      {modal.type === 'edit-category' && (
        <CategoryFormModal
          initial={modal.category}
          onClose={closeModal}
          onSaved={onSaved}
        />
      )}
      {modal.type === 'new-subcategory' && (
        <SubcategoryFormModal
          categoryId={modal.categoryId}
          categoryName={modal.categoryName}
          onClose={closeModal}
          onSaved={onSaved}
        />
      )}
      {modal.type === 'edit-subcategory' && (
        <SubcategoryFormModal
          categoryId={modal.categoryId}
          categoryName={modal.categoryName}
          initial={modal.subcategory}
          onClose={closeModal}
          onSaved={onSaved}
        />
      )}
    </section>
  )
}
