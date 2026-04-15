import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string | null
  fabric: string | null
  care_instructions: string | null
  craft_story: string | null
  price: number
  compare_at_price: number | null
  is_new: boolean
  is_bestseller: boolean
  in_stock: boolean
  stock_count: number
  customizable: boolean
  occasions: string[]
  tags: string[]
  images: { id: string; url: string; alt_text: string | null; sort_order: number; is_primary: boolean }[]
  variants: { id: string; size: string; color: string | null; stock_count: number; price_delta: number; is_active: boolean }[]
  customization_options: { id: string; label: string; type: string; choices: string[] | null; max_length: number | null; is_required: boolean; sort_order: number }[]
  reviews: { id: string; reviewer_name: string; reviewer_location: string | null; rating: number; body: string; is_verified: boolean; created_at: string }[]
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setIsLoading(true)

    async function load() {
      const { data, error: err } = await supabase
        .from('products')
        .select(`
          id, name, slug, description, fabric, care_instructions, craft_story,
          price, compare_at_price, is_new, is_bestseller, in_stock, stock_count,
          customizable, occasions, tags,
          product_images(id, url, alt_text, sort_order, is_primary),
          product_variants(id, size, color, stock_count, price_delta, is_active),
          product_customization_options(id, label, type, choices, max_length, is_required, sort_order),
          product_reviews(id, reviewer_name, reviewer_location, rating, body, is_verified, created_at)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .is('deleted_at', null)
        .single()

      if (cancelled) return
      if (err || !data) { setError('Product not found.'); setIsLoading(false); return }

      setProduct({
        ...data,
        images: [...(data.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
        variants: (data.product_variants ?? []).filter((v: { is_active: boolean }) => v.is_active),
        customization_options: [...(data.product_customization_options ?? [])].sort((a, b) => a.sort_order - b.sort_order),
        reviews: (data.product_reviews ?? []).filter((r: { is_published?: boolean }) => r.is_published !== false),
      })
      setIsLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [slug])

  return { product, isLoading, error }
}
