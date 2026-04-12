export type OrderStatus =
  | 'pending_payment'
  | 'payment_failed'
  | 'confirmed'
  | 'processing'
  | 'ready_to_ship'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded'

export type PaymentMethod = 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'cod'

export type Order = {
  id: string
  order_number: string       // SAV-0001 format
  customer_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  subtotal: number
  discount: number
  shipping_charge: number
  total: number
  coupon_code: string | null
  shipping_address: Address
  items: OrderItem[]
  shiprocket_order_id: string | null
  awb_number: string | null
  tracking_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string       // snapshotted at order time
  product_image_url: string  // snapshotted at order time
  price: number              // snapshotted at order time
  quantity: number
  size: string | null
  customizations: Record<string, string> | null
}

export type Address = {
  full_name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  country: string
}
