import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, assertSupabase } from '@/lib/supabase'

// Guard: prevent runtime crash when Supabase env vars are missing


interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock_count: number
  is_active: boolean
  is_new: boolean
  is_bestseller: boolean
  image_url: string | null
}

function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        active
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-gray-100 text-gray-500 border-gray-200'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showActive, setShowActive] = useState<boolean | null>(null) // null = all

  useEffect(() => {
    loadProducts()
  }, [])

  async function toggleActive(product: Product) {
    await supabase!.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
    )
  }

  async function deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    await supabase!.from('products').update({ deleted_at: new Date().toISOString() }).eq('id', product.id)
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
  }

  async function loadProducts() {
    setIsLoading(true)
    try {
      // Fetch products with first image
      const { data } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          stock_count,
          is_active,
          is_new,
          is_bestseller,
          product_images (url, sort_order)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(200)

      setProducts(
        (data ?? []).map((p) => {
          const images = (p.product_images ?? []) as { url: string; sort_order: number }[]
          const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            stock_count: p.stock_count,
            is_active: p.is_active,
            is_new: p.is_new,
            is_bestseller: p.is_bestseller,
            image_url: sorted[0]?.url ?? null,
          }
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesActive = showActive === null || p.is_active === showActive
    return matchesSearch && matchesActive
  })

  return (
    <section aria-labelledby="products-heading">
      <h2 id="products-heading" className="sr-only">Products</h2>

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 text-sm border border-admin-border rounded text-cocoa bg-parchment placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body w-64"
            aria-label="Search products"
          />
          <div className="flex gap-1 bg-admin-border/30 p-0.5 rounded">
            {([
              [null, 'All'],
              [true, 'Active'],
              [false, 'Inactive'],
            ] as [boolean | null, string][]).map(([val, label]) => (
              <button
                key={String(val)}
                onClick={() => setShowActive(val)}
                className={`px-3 py-1.5 text-xs font-medium rounded font-body transition-colors ${
                  showActive === val
                    ? 'bg-parchment text-cocoa shadow-sm'
                    : 'text-cocoa/50 hover:text-cocoa'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 transition-colors"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-parchment rounded-card shadow-card border border-admin-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Products table">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Image</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Name</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Price</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Stock</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Status</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-cocoa/50 uppercase tracking-wider font-body">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-cocoa/40 font-body">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-cocoa/40 font-body">
                    {searchQuery ? 'No products match your search.' : 'No products yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((product, i) => (
                  <tr
                    key={product.id}
                    className={`border-b border-admin-border/50 hover:bg-ivory/40 transition-colors ${
                      i % 2 === 1 ? 'bg-parchment/60' : ''
                    }`}
                  >
                    <td className="px-6 py-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded object-top"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 bg-admin-border rounded flex items-center justify-center"
                          aria-label="No image"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-cocoa/20" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-cocoa font-body">{product.name}</p>
                      <p className="text-xs text-cocoa/40 font-mono">{product.slug}</p>
                    </td>
                    <td className="px-6 py-3.5 text-right text-cocoa font-body">
                      {formatINR(product.price)}
                    </td>
                    <td className="px-6 py-3.5 text-center font-body">
                      <span
                        className={`font-medium ${
                          product.stock_count <= 5 ? 'text-error' : 'text-cocoa'
                        }`}
                      >
                        {product.stock_count}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge active={product.is_active} />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="text-xs text-gold-accessible hover:text-gold font-body font-medium transition-colors"
                          aria-label={`Edit ${product.name}`}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => toggleActive(product)}
                          className="text-xs hover:underline font-body transition-colors"
                          style={{ color: product.is_active ? '#f59e0b' : '#6b7280' }}
                          aria-label={product.is_active ? `Deactivate ${product.name}` : `Activate ${product.name}`}
                        >
                          {product.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteProduct(product)}
                          className="text-xs text-error/60 hover:text-error font-body transition-colors"
                          aria-label={`Delete ${product.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
