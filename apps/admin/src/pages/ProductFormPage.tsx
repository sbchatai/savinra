import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase, assertSupabase } from '@/lib/supabase'

// Guard: prevent runtime crash when Supabase env vars are missing


// ─── Form data types ──────────────────────────────────────────────────────────

interface ProductFormData {
  name: string
  slug: string
  price: string
  compare_at_price: string
  description: string
  fabric: string
  care_instructions: string
  craft_story: string
  is_active: boolean
  is_new: boolean
  is_bestseller: boolean
  in_stock: boolean
  customizable: boolean
  collection_ids: string[]
}

interface ImageEntry {
  id?: string
  url: string
  alt_text: string
  sort_order: number
  is_primary: boolean
  localFile?: File
  isUploading?: boolean
}

interface VariantEntry {
  id?: string
  size: string
  color: string
  sku: string
  stock_count: string
  price_delta: string
  is_active: boolean
}

interface Collection {
  id: string
  name: string
  slug: string
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const EMPTY_FORM: ProductFormData = {
  name: '',
  slug: '',
  price: '',
  compare_at_price: '',
  description: '',
  fabric: '',
  care_instructions: '',
  craft_story: '',
  is_active: true,
  is_new: false,
  is_bestseller: false,
  in_stock: true,
  customizable: false,
  collection_ids: [],
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ─── Shared primitives ─────────────────────────────────────────────────────────

function inputClass() {
  return 'w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body'
}

function labelClass(required?: boolean) {
  return `block text-sm font-medium text-cocoa/70 font-body mb-1.5${required ? '' : ''}`
}

// ─── Image upload component ───────────────────────────────────────────────────

function ImageUploader({
  images,
  onChange,
  disabled,
}: {
  images: ImageEntry[]
  onChange: (imgs: ImageEntry[] | ((prev: ImageEntry[]) => ImageEntry[])) => void
  disabled?: boolean
}) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase!.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) { console.error('Upload error:', error.message); return null }
    const { data } = supabase!.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleFiles(fileList: FileList) {
    const newEntries: ImageEntry[] = Array.from(fileList).map((file, i) => ({
      url: '',
      alt_text: '',
      sort_order: images.length + i,
      is_primary: images.length === 0 && i === 0,
      localFile: file,
      isUploading: true,
    }))
    const updated = [...images, ...newEntries]
    onChange(updated)

    for (let i = 0; i < newEntries.length; i++) {
      const entry = newEntries[i]
      if (!entry.localFile) continue
      const url = await uploadFile(entry.localFile)
      onChange((prev: ImageEntry[]) =>
        prev.map((p) =>
          p.localFile === entry.localFile
            ? { ...p, url: url ?? 'ERROR', isUploading: false }
            : p
        )
      )
    }
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx))
  }

  function setPrimary(idx: number) {
    onChange(images.map((img, i) => ({ ...img, is_primary: i === idx })))
  }

  function updateAlt(idx: number, alt_text: string) {
    onChange(images.map((img, i) => (i === idx ? { ...img, alt_text } : img)))
  }

  async function deleteStoredImage(img: ImageEntry) {
    if (!img.id) return
    await supabase!.from('product_images').delete().eq('id', img.id)
    if (img.url.includes('product-images')) {
      const path = img.url.split('/product-images/')[1]
      if (path) await supabase!.storage.from('product-images').remove([path])
    }
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-card p-6 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-gold bg-gold/5'
            : 'border-admin-border hover:border-gold/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
        }}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload product images"
        onKeyDown={(e) => e.key === 'Enter' && !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <svg className="mx-auto mb-2 text-cocoa/30" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <p className="text-sm text-cocoa/50 font-body">
          Drag & drop images here, or <span className="text-gold underline">click to browse</span>
        </p>
        <p className="text-xs text-cocoa/30 font-body mt-1">PNG, JPG, WEBP — up to 10MB each</p>
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-card border-2 overflow-hidden transition-colors ${
                img.is_primary ? 'border-gold' : 'border-admin-border'
              }`}
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-parchment relative">
                {img.isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  </div>
                ) : img.url ? (
                  <img src={img.url} alt={img.alt_text || `Product image ${idx + 1}`} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-cocoa/20">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}

                {/* Primary badge */}
                {img.is_primary && (
                  <span className="absolute top-1.5 left-1.5 bg-gold text-cocoa text-[10px] font-semibold px-1.5 py-0.5 rounded font-body">
                    Primary
                  </span>
                )}

                {/* Uploading overlay */}
                {img.isUploading && (
                  <div className="absolute inset-0 bg-parchment/70 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-2 space-y-1.5 bg-white">
                <input
                  type="text"
                  placeholder="Alt text"
                  value={img.alt_text}
                  onChange={(e) => updateAlt(idx, e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-admin-border rounded text-cocoa bg-parchment placeholder-cocoa/30 focus:outline-none focus:ring-1 focus:ring-gold/40 font-body"
                />
                <div className="flex gap-1">
                  {!img.is_primary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(idx)}
                      className="flex-1 text-[10px] text-gold hover:text-gold/80 font-body font-medium transition-colors"
                    >
                      Set primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteStoredImage(img)
                      removeImage(idx)
                    }}
                    className="flex-1 text-[10px] text-error/60 hover:text-error font-body transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-cocoa/40 font-body">
          {images.length} image{images.length !== 1 ? 's' : ''} — click an image to set as primary
        </p>
      )}
    </div>
  )
}

// ─── Variants editor ─────────────────────────────────────────────────────────

function VariantsEditor({
  variants,
  onChange,
}: {
  variants: VariantEntry[]
  onChange: (v: VariantEntry[]) => void
}) {
  function update(idx: number, field: keyof VariantEntry, value: string | boolean) {
    onChange(variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v)))
  }

  function addVariant() {
    onChange([
      ...variants,
      { size: 'M', color: '', sku: '', stock_count: '0', price_delta: '0', is_active: true },
    ])
  }

  function removeVariant(idx: number) {
    onChange(variants.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      {variants.length === 0 && (
        <p className="text-sm text-cocoa/40 font-body italic py-2">
          No variants yet. Add sizes or color options.
        </p>
      )}

      {variants.map((v, idx) => (
        <div key={idx} className="grid grid-cols-12 gap-2 items-start p-3 border border-admin-border rounded bg-white">
          <div className="col-span-2">
            <label htmlFor={`var-size-${idx}`} className="text-[11px] text-cocoa/50 font-body mb-1 block">Size</label>
            <select
              id={`var-size-${idx}`}
              value={v.size}
              onChange={(e) => update(idx, 'size', e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-admin-border rounded text-cocoa bg-parchment focus:outline-none focus:ring-1 focus:ring-gold/40 font-body"
            >
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              {!SIZES.includes(v.size) && <option value={v.size}>{v.size}</option>}
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor={`var-color-${idx}`} className="text-[11px] text-cocoa/50 font-body mb-1 block">Color</label>
            <input
              id={`var-color-${idx}`}
              type="text"
              value={v.color}
              onChange={(e) => update(idx, 'color', e.target.value)}
              placeholder="e.g. Ivory"
              className="w-full px-2 py-1.5 text-xs border border-admin-border rounded text-cocoa bg-parchment placeholder-cocoa/30 focus:outline-none focus:ring-1 focus:ring-gold/40 font-body"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor={`var-sku-${idx}`} className="text-[11px] text-cocoa/50 font-body mb-1 block">SKU</label>
            <input
              id={`var-sku-${idx}`}
              type="text"
              value={v.sku}
              onChange={(e) => update(idx, 'sku', e.target.value)}
              placeholder="SKU-001"
              className="w-full px-2 py-1.5 text-xs border border-admin-border rounded text-cocoa bg-parchment font-mono placeholder-cocoa/30 focus:outline-none focus:ring-1 focus:ring-gold/40 font-body"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor={`var-stock-${idx}`} className="text-[11px] text-cocoa/50 font-body mb-1 block">Stock</label>
            <input
              id={`var-stock-${idx}`}
              type="number"
              min="0"
              value={v.stock_count}
              onChange={(e) => update(idx, 'stock_count', e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-admin-border rounded text-cocoa bg-parchment focus:outline-none focus:ring-1 focus:ring-gold/40 font-body"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor={`var-delta-${idx}`} className="text-[11px] text-cocoa/50 font-body mb-1 block">Price delta (₹)</label>
            <input
              id={`var-delta-${idx}`}
              type="number"
              step="1"
              value={v.price_delta}
              onChange={(e) => update(idx, 'price_delta', e.target.value)}
              placeholder="0"
              className="w-full px-2 py-1.5 text-xs border border-admin-border rounded text-cocoa bg-parchment focus:outline-none focus:ring-1 focus:ring-gold/40 font-body"
            />
          </div>
          <div className="col-span-1 flex items-center justify-center pt-4">
            <label className="flex items-center gap-1 cursor-pointer" title={v.is_active ? 'Active' : 'Inactive'}>
              <input
                type="checkbox"
                checked={v.is_active}
                onChange={(e) => update(idx, 'is_active', e.target.checked)}
                className="w-4 h-4 rounded border-admin-border text-gold focus:ring-gold/40"
              />
            </label>
          </div>
          <div className="col-span-2 flex items-end pb-1">
            <button
              type="button"
              onClick={() => removeVariant(idx)}
              className="text-error/60 hover:text-error transition-colors text-xs font-body"
              aria-label="Remove variant"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addVariant}
        className="inline-flex items-center gap-2 px-3 py-1.5 border border-dashed border-admin-border rounded text-xs text-cocoa/50 hover:text-gold hover:border-gold transition-colors font-body"
      >
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add variant
      </button>
    </div>
  )
}

// ─── Collection selector ───────────────────────────────────────────────────────

function CollectionSelector({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (ids: string[]) => void
}) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('collections')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setCollections(data ?? [])
        setIsLoading(false)
      })
  }, [])

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((c) => c !== id))
    } else {
      onChange([...selected, id])
    }
  }

  if (isLoading) return <p className="text-xs text-cocoa/40 font-body">Loading collections…</p>

  if (collections.length === 0) {
    return <p className="text-xs text-cocoa/40 font-body italic">No collections yet.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {collections.map((c) => (
        <label
          key={c.id}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-body cursor-pointer border transition-colors ${
            selected.includes(c.id)
              ? 'border-gold bg-gold/10 text-cocoa font-medium'
              : 'border-admin-border bg-parchment text-cocoa/60 hover:border-gold/50'
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(c.id)}
            onChange={() => toggle(c.id)}
            className="sr-only"
          />
          {c.name}
        </label>
      ))}
    </div>
  )
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM)
  const [images, setImages] = useState<ImageEntry[]>([])
  const [variants, setVariants] = useState<VariantEntry[]>([])
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  useEffect(() => {
    if (!id) return
    loadProduct(id)
  }, [id])

  async function loadProduct(productId: string) {
    // Load product
    const { data, error: fetchErr } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (fetchErr || !data) {
      navigate('/products', { replace: true })
      return
    }

    // Load images
    const { data: imgs } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })

    // Load variants
    const { data: vars } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: true })

    // Load collections
    const { data: colls } = await supabase
      .from('collection_products')
      .select('collection_id')
      .eq('product_id', productId)

    setForm({
      name: data.name,
      slug: data.slug,
      price: String(data.price / 100),
      compare_at_price: data.compare_at_price != null ? String(data.compare_at_price / 100) : '',
      description: data.description ?? '',
      fabric: data.fabric ?? '',
      care_instructions: data.care_instructions ?? '',
      craft_story: data.craft_story ?? '',
      is_active: data.is_active,
      is_new: data.is_new,
      is_bestseller: data.is_bestseller,
      in_stock: data.in_stock,
      customizable: data.customizable,
      collection_ids: colls?.map((c) => c.collection_id) ?? [],
    })

    setImages(
      (imgs ?? []).map((img) => ({
        id: img.id,
        url: img.url,
        alt_text: img.alt_text ?? '',
        sort_order: img.sort_order,
        is_primary: img.is_primary,
      }))
    )

    setVariants(
      (vars ?? []).map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color ?? '',
        sku: v.sku ?? '',
        stock_count: String(v.stock_count),
        price_delta: String(v.price_delta / 100),
        is_active: v.is_active,
      }))
    )

    setSlugManuallyEdited(true)
    setIsLoading(false)
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : slugify(name),
    }))
  }

  function handleField(field: keyof ProductFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleCheckbox(field: keyof ProductFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.checked }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    const priceInRupees = parseFloat(form.price)
    if (isNaN(priceInRupees) || priceInRupees <= 0) {
      setError('Please enter a valid price.')
      setIsSaving(false)
      return
    }

    const pricePaise = Math.round(priceInRupees * 100)
    const compareAtPaise = form.compare_at_price
      ? Math.round(parseFloat(form.compare_at_price) * 100)
      : null

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      price: pricePaise,
      compare_at_price: compareAtPaise,
      description: form.description || null,
      fabric: form.fabric || null,
      care_instructions: form.care_instructions || null,
      craft_story: form.craft_story || null,
      is_active: form.is_active,
      is_new: form.is_new,
      is_bestseller: form.is_bestseller,
      in_stock: form.in_stock,
      customizable: form.customizable,
    }

    try {
      let productId = id

      if (isEditing && id) {
        const { error: updateErr } = await supabase
          .from('products')
          .update(payload)
          .eq('id', id)
        if (updateErr) throw updateErr
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('products')
          .insert({ ...payload, stock_count: 0 })
          .select('id')
          .single()
        if (insertErr) throw insertErr
        productId = inserted.id
      }

      if (!productId) throw new Error('Product ID not found after save.')

      // Save images — insert new ones, update existing
      const storedImages = images.filter((img) => img.id)
      const newImages = images.filter((img) => !img.id && img.url && !img.isUploading)

      // Delete removed stored images
      const { data: currentImages } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', productId)
      const storedIds = new Set(storedImages.map((img) => img.id))
      for (const curr of currentImages ?? []) {
        if (!storedIds.has(curr.id)) {
          await supabase!.from('product_images').delete().eq('id', curr.id)
        }
      }

      // Upsert images
      for (const img of images) {
        if (!img.url || img.isUploading) continue
        if (img.id) {
          await supabase!.from('product_images').update({
            url: img.url,
            alt_text: img.alt_text || null,
            sort_order: img.sort_order,
            is_primary: img.is_primary,
          }).eq('id', img.id)
        } else {
          await supabase!.from('product_images').insert({
            product_id: productId,
            url: img.url,
            alt_text: img.alt_text || null,
            sort_order: img.sort_order,
            is_primary: img.is_primary,
          })
        }
      }

      // Save variants — delete removed, upsert rest
      const { data: currentVars } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)
      const storedVarIds = new Set(variants.filter((v) => v.id).map((v) => v.id!))
      for (const curr of currentVars ?? []) {
        if (!storedVarIds.has(curr.id)) {
          await supabase!.from('product_variants').delete().eq('id', curr.id)
        }
      }

      for (const v of variants) {
        const varPayload = {
          product_id: productId,
          size: v.size,
          color: v.color || null,
          sku: v.sku || null,
          stock_count: parseInt(v.stock_count) || 0,
          price_delta: Math.round(parseFloat(v.price_delta || '0') * 100),
          is_active: v.is_active,
        }
        if (v.id) {
          await supabase!.from('product_variants').update(varPayload).eq('id', v.id)
        } else {
          await supabase!.from('product_variants').insert(varPayload)
        }
      }

      // Save collection assignments
      await supabase!.from('collection_products').delete().eq('product_id', productId)
      for (const collId of form.collection_ids) {
        await supabase!.from('collection_products').insert({ collection_id: collId, product_id: productId })
      }

      navigate('/products')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving.'
      setError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-cocoa/40 font-body">
        Loading product...
      </div>
    )
  }

  const hasImages = images.some((img) => img.url && !img.isUploading)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="text-cocoa/40 hover:text-cocoa transition-colors"
            aria-label="Back to products"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <h2 className="font-heading text-xl font-medium text-cocoa">
            {isEditing ? 'Edit Product' : 'New Product'}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving || !form.name || !form.slug || !form.price}
            className="px-6 py-2.5 bg-cocoa text-parchment text-sm font-semibold font-body rounded-pill hover:bg-cocoa/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Product'}
          </button>
          <Link
            to="/products"
            className="px-4 py-2.5 text-sm text-cocoa/60 font-body hover:text-cocoa transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-4">
            <h3 className="font-heading text-base font-medium text-cocoa">Basic Info</h3>

            <div>
              <label htmlFor="product-name" className={labelClass()}>
                Product name <span className="text-error" aria-hidden="true">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                required
                value={form.name}
                onChange={handleNameChange}
                className={inputClass()}
                placeholder="e.g. Anaya Silk Kurta Set"
              />
            </div>

            <div>
              <label htmlFor="product-slug" className={labelClass()}>
                URL slug <span className="text-error" aria-hidden="true">*</span>
              </label>
              <input
                id="product-slug"
                type="text"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true)
                  handleField('slug')(e)
                }}
                className={`${inputClass()} font-mono`}
                placeholder="anaya-silk-kurta-set"
              />
            </div>

            <div>
              <label htmlFor="product-description" className={labelClass()}>Description</label>
              <textarea
                id="product-description"
                value={form.description}
                onChange={handleField('description')}
                rows={4}
                className={`${inputClass()} resize-y`}
                placeholder="Describe the product, its design, and what makes it special…"
              />
            </div>

            <div>
              <label htmlFor="product-craft-story" className={labelClass()}>Craft story</label>
              <textarea
                id="product-craft-story"
                value={form.craft_story}
                onChange={handleField('craft_story')}
                rows={3}
                className={`${inputClass()} resize-y`}
                placeholder="Share the artisan story, regional craft, and heritage behind this piece…"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-4">
            <h3 className="font-heading text-base font-medium text-cocoa">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-price" className={labelClass()}>
                  Price (₹) <span className="text-error" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cocoa/40 font-body">₹</span>
                  <input
                    id="product-price"
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={handleField('price')}
                    className={`${inputClass()} pl-7`}
                    placeholder="4999"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="product-compare-price" className={labelClass()}>Compare-at price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cocoa/40 font-body">₹</span>
                  <input
                    id="product-compare-price"
                    type="number"
                    min="0"
                    step="1"
                    value={form.compare_at_price}
                    onChange={handleField('compare_at_price')}
                    className={`${inputClass()} pl-7`}
                    placeholder="6999"
                  />
                </div>
                <p className="text-xs text-cocoa/30 font-body mt-1">Shows as struck-through in store</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-4">
            <h3 className="font-heading text-base font-medium text-cocoa">Details</h3>
            <div>
              <label htmlFor="product-fabric" className={labelClass()}>Fabric</label>
              <input
                id="product-fabric"
                type="text"
                value={form.fabric}
                onChange={handleField('fabric')}
                className={inputClass()}
                placeholder="e.g. Pure Chanderi Silk"
              />
            </div>
            <div>
              <label htmlFor="product-care" className={labelClass()}>Care instructions</label>
              <textarea
                id="product-care"
                value={form.care_instructions}
                onChange={handleField('care_instructions')}
                rows={2}
                className={`${inputClass()} resize-y`}
                placeholder="e.g. Dry clean only. Store in a cool, dry place."
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-4">
            <h3 className="font-heading text-base font-medium text-cocoa">Images</h3>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          {/* Variants */}
          <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-4">
            <h3 className="font-heading text-base font-medium text-cocoa">Variants</h3>
            <p className="text-xs text-cocoa/40 font-body">Add size/color combinations with their own SKU and stock count. Price delta is added to the base price.</p>
            <VariantsEditor variants={variants} onChange={setVariants} />
          </div>

        </div>

        {/* Right column — metadata */}
        <div className="space-y-6">

          {/* Status */}
          <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-3">
            <h3 className="font-heading text-base font-medium text-cocoa">Status</h3>
            {[
              { field: 'is_active' as const, label: 'Active (visible in store)' },
              { field: 'in_stock' as const, label: 'In stock' },
              { field: 'is_new' as const, label: 'Mark as New arrival' },
              { field: 'is_bestseller' as const, label: 'Mark as Bestseller' },
              { field: 'customizable' as const, label: 'Allow customization' },
            ].map(({ field, label }) => (
              <label key={field} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[field] as boolean}
                  onChange={handleCheckbox(field)}
                  className="w-4 h-4 rounded border-admin-border text-gold focus:ring-gold/40"
                />
                <span className="text-sm text-cocoa font-body">{label}</span>
              </label>
            ))}
          </div>

          {/* Collections */}
          <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-3">
            <h3 className="font-heading text-base font-medium text-cocoa">Collections</h3>
            <p className="text-xs text-cocoa/40 font-body">Select which collections this product belongs to.</p>
            <CollectionSelector
              selected={form.collection_ids}
              onChange={(ids) => setForm((prev) => ({ ...prev, collection_ids: ids }))}
            />
          </div>

        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 text-sm text-error font-body bg-error/5 border border-error/20 rounded px-4 py-3">
          {error}
        </p>
      )}
    </form>
  )
}
