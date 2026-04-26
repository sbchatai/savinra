import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface ProductVariant {
  id: string
  size: string
  stock_count: number
  price_delta: number
}

export interface ProductCard {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price: number | null
  is_new: boolean
  is_bestseller: boolean
  in_stock: boolean
  customizable: boolean
  occasions: string[]
  primary_image: string | null
  category_id: string | null
  variants: ProductVariant[]
}

interface UseProductsFilters {
  is_bestseller?: boolean
  is_new?: boolean
  occasion?: string
  collection_slug?: string
  category_id?: string
  subcategory_id?: string
  limit?: number
}

export function useProducts(filters?: UseProductsFilters) {
  const [products, setProducts] = useState<ProductCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        // If filtering by collection, use junction table
        if (filters?.collection_slug) {
          const { data: collectionData } = await supabase
            .from('collections')
            .select('id')
            .eq('slug', filters.collection_slug)
            .single()

          if (!collectionData) { setProducts([]); setIsLoading(false); return }

          const { data: junctionData } = await supabase
            .from('collection_products')
            .select('product_id, sort_order')
            .eq('collection_id', collectionData.id)
            .order('sort_order')

          const productIds = junctionData?.map(j => j.product_id) ?? []
          if (!productIds.length) { setProducts([]); setIsLoading(false); return }

          let q = supabase
            .from('products')
            .select('id, name, slug, price, compare_at_price, is_new, is_bestseller, in_stock, customizable, occasions, category_id, product_images(url, is_primary, sort_order), product_variants(id, size, stock_count, price_delta)')
            .in('id', productIds)
            .eq('is_active', true)
            .is('deleted_at', null)

          if (filters.limit) q = q.limit(filters.limit)
          const { data, error: err } = await q
          if (err) throw err
          if (!cancelled) setProducts(mapProducts(data ?? []))
        } else {
          let q = supabase
            .from('products')
            .select('id, name, slug, price, compare_at_price, is_new, is_bestseller, in_stock, customizable, occasions, category_id, product_images(url, is_primary, sort_order), product_variants(id, size, stock_count, price_delta)')
            .eq('is_active', true)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })

          if (filters?.is_bestseller) q = q.eq('is_bestseller', true)
          if (filters?.is_new) q = q.eq('is_new', true)
          if (filters?.occasion) q = q.contains('occasions', [filters.occasion])
          if (filters?.category_id) q = q.eq('category_id', filters.category_id)
          if (filters?.subcategory_id) q = q.eq('subcategory_id', filters.subcategory_id)
          if (filters?.limit) q = q.limit(filters.limit)

          const { data, error: err } = await q
          if (err) throw err
          if (!cancelled) setProducts(mapProducts(data ?? []))
        }
      } catch (e) {
        if (!cancelled) setError('Could not load products. Please try again.')
        console.error(e)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [filters?.is_bestseller, filters?.is_new, filters?.occasion, filters?.collection_slug, filters?.category_id, filters?.subcategory_id, filters?.limit])

  return { products, isLoading, error }
}

// deno-lint-ignore no-explicit-any
function mapProducts(data: any[]): ProductCard[] {
  return data.map(p => {
    const images = (p.product_images ?? []) as { url: string; is_primary: boolean; sort_order: number }[]
    const primary = images.find(i => i.is_primary) ?? images.sort((a, b) => a.sort_order - b.sort_order)[0]
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compare_at_price: p.compare_at_price,
      is_new: p.is_new,
      is_bestseller: p.is_bestseller,
      in_stock: p.in_stock,
      customizable: p.customizable,
      occasions: p.occasions ?? [],
      primary_image: primary?.url ?? null,
      category_id: p.category_id ?? null,
      variants: (p.product_variants ?? []) as ProductVariant[],
    }
  })
}
