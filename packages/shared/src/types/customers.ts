export type CustomerSegment = 'new' | 'repeat' | 'vip' | 'at_risk' | 'dormant'

export type Customer = {
  id: string                  // matches Supabase auth.users.id
  email: string
  full_name: string | null
  phone: string | null
  segment: CustomerSegment
  total_orders: number
  total_spent: number
  last_order_at: string | null
  birthday: string | null     // MM-DD format for annual re-engagement
  whatsapp_opted_in: boolean
  email_opted_in: boolean
  created_at: string
}

export type SavedAddress = {
  id: string
  customer_id: string
  label: string               // 'Home', 'Work', etc.
  is_default: boolean
  full_name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  country: string
}
