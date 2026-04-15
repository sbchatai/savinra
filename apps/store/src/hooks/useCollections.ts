import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface CollectionCard {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  occasion: string | null
  sort_order: number
}

export function useCollections() {
  const [collections, setCollections] = useState<CollectionCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    supabase
      .from('collections')
      .select('id, name, slug, description, cover_image, occasion, sort_order')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) { setError('Could not load collections.'); return }
        setCollections(data ?? [])
        setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { collections, isLoading, error }
}
