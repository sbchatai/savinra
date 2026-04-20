import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Product } from '@/data/placeholder'

interface CartItem {
  product: Product
  size: string
  qty: number
  variantId?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, size: string, qty?: number, variantId?: string) => void
  removeItem: (productId: string, size: string) => void
  updateQty: (productId: string, size: string, qty: number) => void
  total: number
  itemCount: number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

const CART_KEY = 'savinra_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      return stored ? (JSON.parse(stored) as CartItem[]) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)) }
    catch { /* quota exceeded or private browsing — ignore */ }
  }, [items])

  const addItem = useCallback((product: Product, size: string, qty = 1, variantId?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size
            ? { ...i, qty: i.qty + qty }
            : i
        )
      }
      return [...prev, { product, size, qty, variantId }]
    })
  }, [])

  const removeItem = useCallback((productId: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)))
  }, [])

  const updateQty = useCallback((productId: string, size: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)))
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.size === size ? { ...i, qty } : i
      )
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, total, itemCount, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
