import type { Database } from './database'

// ── Row types ─────────────────────────────────────────────────
export type Customer       = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Address        = Database['public']['Tables']['addresses']['Row']
export type AddressInsert  = Database['public']['Tables']['addresses']['Insert']
export type AddressUpdate  = Database['public']['Tables']['addresses']['Update']

export type AdminUser      = Database['public']['Tables']['admin_users']['Row']

export type WishlistItem   = Database['public']['Tables']['wishlist_items']['Row']
export type CartItem       = Database['public']['Tables']['cart_items']['Row']

export type CustomerSegment = Database['public']['Tables']['customer_segments']['Row']

// ── Composite types ───────────────────────────────────────────
export type CustomerWithAddresses = Customer & {
  addresses: Address[]
}

/** Cart item enriched with product/variant info for display */
export type CartItemWithProduct = CartItem & {
  product: { name: string; slug: string; primary_image: string | null }
  variant: { size: string; color: string | null; price_delta: number } | null
}
