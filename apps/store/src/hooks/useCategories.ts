import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  sort_order: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  sort_order: number
  subcategories: Subcategory[]
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCategories() {
      const { data, error: err } = await supabase
        .from('categories')
        .select('*, subcategories(id, category_id, name, slug, description, cover_image, sort_order)')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (cancelled) return

      if (err) {
        setError(err.message)
        setIsLoading(false)
        return
      }

      const cats = (data ?? []).map(c => ({
        ...c,
        subcategories: (c.subcategories ?? []).sort(
          (a: Subcategory, b: Subcategory) => a.sort_order - b.sort_order
        ),
      }))
      setCategories(cats)
      setIsLoading(false)
    }

    fetchCategories()
    return () => { cancelled = true }
  }, [])

  return { categories, isLoading, error }
}
