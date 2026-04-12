export type ProductStatus = 'published' | 'draft' | 'archived'

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  sku: string | null
  stock_quantity: number
  status: ProductStatus
  collection_id: string | null
  images: ProductImage[]
  ai_images: AiGeneratedImage[]
  tags: string[]
  fabric: string | null
  care_instructions: string | null
  created_at: string
  updated_at: string
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  alt: string | null
  position: number
}

export type AiGeneratedImage = {
  id: string
  product_id: string
  url: string
  angle: 'front' | 'side' | 'back' | 'lifestyle'
  is_approved: boolean
  created_at: string
}

export type Collection = {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image_url: string | null
  is_published: boolean
  created_at: string
}
