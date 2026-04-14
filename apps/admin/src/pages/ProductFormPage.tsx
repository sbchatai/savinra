import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

interface ProductFormData {
  name: string
  slug: string
  price: string
  compare_at_price: string
  description: string
  fabric: string
  care_instructions: string
  is_active: boolean
  is_new: boolean
  is_bestseller: boolean
}

const EMPTY_FORM: ProductFormData = {
  name: '',
  slug: '',
  price: '',
  compare_at_price: '',
  description: '',
  fabric: '',
  care_instructions: '',
  is_active: true,
  is_new: false,
  is_bestseller: false,
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  useEffect(() => {
    if (!id) return
    loadProduct(id)
  }, [id])

  async function loadProduct(productId: string) {
    const { data, error: fetchErr } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (fetchErr || !data) {
      navigate('/products', { replace: true })
      return
    }

    setForm({
      name: data.name,
      slug: data.slug,
      price: String(data.price),
      compare_at_price: data.compare_at_price != null ? String(data.compare_at_price) : '',
      description: data.description ?? '',
      fabric: data.fabric ?? '',
      care_instructions: data.care_instructions ?? '',
      is_active: data.is_active,
      is_new: data.is_new,
      is_bestseller: data.is_bestseller,
    })
    setSlugManuallyEdited(true) // Don't auto-regenerate slug for existing products
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

    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price.')
      setIsSaving(false)
      return
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      price,
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      description: form.description || null,
      fabric: form.fabric || null,
      care_instructions: form.care_instructions || null,
      is_active: form.is_active,
      is_new: form.is_new,
      is_bestseller: form.is_bestseller,
    }

    try {
      if (isEditing && id) {
        const { error: updateErr } = await supabase
          .from('products')
          .update(payload)
          .eq('id', id)

        if (updateErr) throw updateErr
      } else {
        const { error: insertErr } = await supabase
          .from('products')
          .insert({ ...payload, stock_count: 0 })

        if (insertErr) throw insertErr
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

  return (
    <section aria-labelledby="product-form-heading" className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
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
        <h2 id="product-form-heading" className="font-heading text-xl font-medium text-cocoa">
          {isEditing ? 'Edit Product' : 'New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-4">
          <h3 className="font-heading text-base font-medium text-cocoa">Basic Info</h3>

          {/* Name */}
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
              Product name <span aria-hidden="true" className="text-error">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              required
              value={form.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body"
              placeholder="e.g. Anaya Silk Kurta Set"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="product-slug" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
              URL slug <span aria-hidden="true" className="text-error">*</span>
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
              className="w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white font-mono placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40"
              placeholder="anaya-silk-kurta-set"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="product-description" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
              Description
            </label>
            <textarea
              id="product-description"
              value={form.description}
              onChange={handleField('description')}
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body resize-y"
              placeholder="Describe the product..."
            />
          </div>
        </div>

        <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-4">
          <h3 className="font-heading text-base font-medium text-cocoa">Pricing</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
                Price (INR) <span aria-hidden="true" className="text-error">*</span>
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
                  className="w-full pl-7 pr-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 font-body"
                  placeholder="4999"
                />
              </div>
            </div>

            <div>
              <label htmlFor="product-compare-price" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
                Compare-at price (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cocoa/40 font-body">₹</span>
                <input
                  id="product-compare-price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.compare_at_price}
                  onChange={handleField('compare_at_price')}
                  className="w-full pl-7 pr-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 font-body"
                  placeholder="6999"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-4">
          <h3 className="font-heading text-base font-medium text-cocoa">Details</h3>

          <div>
            <label htmlFor="product-fabric" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
              Fabric
            </label>
            <input
              id="product-fabric"
              type="text"
              value={form.fabric}
              onChange={handleField('fabric')}
              className="w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body"
              placeholder="e.g. Pure Chanderi Silk"
            />
          </div>

          <div>
            <label htmlFor="product-care" className="block text-sm font-medium text-cocoa/70 font-body mb-1.5">
              Care instructions
            </label>
            <textarea
              id="product-care"
              value={form.care_instructions}
              onChange={handleField('care_instructions')}
              rows={2}
              className="w-full px-3 py-2.5 text-sm border border-admin-border rounded text-cocoa bg-white placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body resize-y"
              placeholder="e.g. Dry clean only"
            />
          </div>
        </div>

        <div className="bg-parchment rounded-card shadow-card border border-admin-border p-6 space-y-3">
          <h3 className="font-heading text-base font-medium text-cocoa">Flags</h3>

          {[
            { field: 'is_active' as const, label: 'Active (visible in store)' },
            { field: 'is_new' as const, label: 'Mark as New arrival' },
            { field: 'is_bestseller' as const, label: 'Mark as Bestseller' },
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

        {error && (
          <p role="alert" className="text-sm text-error font-body bg-error/8 border border-error/20 rounded px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving || !form.name || !form.slug || !form.price}
            className="px-6 py-2.5 bg-cocoa text-parchment text-sm font-semibold font-body rounded-pill hover:bg-cocoa/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
          </button>
          <Link
            to="/products"
            className="px-4 py-2.5 text-sm text-cocoa/60 font-body hover:text-cocoa transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}
