import type { Database } from './database'

// ── Row types ─────────────────────────────────────────────────
export type Order              = Database['public']['Tables']['orders']['Row']
export type OrderInsert        = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate        = Database['public']['Tables']['orders']['Update']

export type OrderItem          = Database['public']['Tables']['order_items']['Row']
export type OrderItemCustomization = Database['public']['Tables']['order_item_customizations']['Row']
export type OrderEvent         = Database['public']['Tables']['order_events']['Row']

export type PaymentAttempt     = Database['public']['Tables']['payment_attempts']['Row']

export type Shipment           = Database['public']['Tables']['shipments']['Row']
export type ShipmentInsert     = Database['public']['Tables']['shipments']['Insert']

export type ReturnRequest      = Database['public']['Tables']['return_requests']['Row']
export type ReturnItem         = Database['public']['Tables']['return_items']['Row']

export type Coupon             = Database['public']['Tables']['coupons']['Row']
export type CouponUse          = Database['public']['Tables']['coupon_uses']['Row']

// ── Derived enums (sourced from DB CHECK constraints) ─────────
export type OrderStatus   = Order['status']
export type PaymentStatus = Order['payment_status']
export type PaymentMethod = Order['payment_method']
export type ShipmentStatus = Shipment['status']
export type ReturnStatus  = ReturnRequest['status']

// ── Composite types ───────────────────────────────────────────
/** Full order for customer account / admin detail view */
export type OrderWithDetails = Order & {
  items:      (OrderItem & { customizations: OrderItemCustomization[] })[]
  events:     OrderEvent[]
  shipments:  Shipment[]
  payment_attempts: PaymentAttempt[]
  return_requests:  ReturnRequest[]
}

/** Shipping address as a plain value object (snapshotted on order) */
export type ShippingAddress = {
  full_name: string
  phone:     string
  line1:     string
  line2:     string | null
  city:      string
  state:     string
  pincode:   string
  country:   string
}
