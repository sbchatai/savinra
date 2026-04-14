import type { Database } from './database'

// ── Row types (direct from DB) ────────────────────────────────
export type Product           = Database['public']['Tables']['products']['Row']
export type ProductInsert     = Database['public']['Tables']['products']['Insert']
export type ProductUpdate     = Database['public']['Tables']['products']['Update']

export type Collection        = Database['public']['Tables']['collections']['Row']
export type CollectionInsert  = Database['public']['Tables']['collections']['Insert']

export type ProductImage      = Database['public']['Tables']['product_images']['Row']
export type ProductVariant    = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert']

export type ProductCustomizationOption = Database['public']['Tables']['product_customization_options']['Row']
export type ProductReview     = Database['public']['Tables']['product_reviews']['Row']
export type CollectionProduct = Database['public']['Tables']['collection_products']['Row']

export type AiGeneratedImage  = Database['public']['Tables']['ai_generated_images']['Row']

// ── Composite / view types ────────────────────────────────────
/** Full product with joined images, variants, and reviews */
export type ProductWithDetails = Product & {
  images:    ProductImage[]
  variants:  ProductVariant[]
  reviews:   ProductReview[]
  customization_options: ProductCustomizationOption[]
  collections: Collection[]
}

/** Lightweight card used in listings */
export type ProductCard = Pick<
  Product,
  'id' | 'name' | 'slug' | 'price' | 'compare_at_price' |
  'is_new' | 'is_bestseller' | 'in_stock' | 'customizable' | 'occasions'
> & {
  primary_image: string | null
}
