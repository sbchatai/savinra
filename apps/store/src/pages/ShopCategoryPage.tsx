import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProducts } from '@/hooks/useProducts'
import LiveProductCard from '@/components/product/LiveProductCard'
import SEOHead from '@/components/layout/SEOHead'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubcategoryRow {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  sort_order: number
}

interface CategoryRow {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  meta_title: string | null
  meta_desc: string | null
  subcategories: SubcategoryRow[]
}

type SortOption = 'newest' | 'price-asc' | 'price-desc'

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

function Breadcrumbs({
  category,
  subcategory,
}: {
  category: CategoryRow | null
  subcategory: SubcategoryRow | null
}) {
  return (
    <nav className="flex items-center gap-1.5 font-body text-xs text-cocoa/50 mb-6" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-gold-accessible transition-colors">Home</Link>
      <ChevronRight size={12} />
      <Link to="/shop" className="hover:text-gold-accessible transition-colors">Shop</Link>
      {category && (
        <>
          <ChevronRight size={12} />
          <Link
            to={`/shop/${category.slug}`}
            className={cn(
              'hover:text-gold-accessible transition-colors',
              !subcategory && 'text-cocoa font-medium',
            )}
          >
            {category.name}
          </Link>
        </>
      )}
      {subcategory && (
        <>
          <ChevronRight size={12} />
          <span className="text-cocoa font-medium">{subcategory.name}</span>
        </>
      )}
    </nav>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopCategoryPage() {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug: string
    subcategorySlug?: string
  }>()

  const [category, setCategory] = useState<CategoryRow | null>(null)
  const [catLoading, setCatLoading] = useState(true)
  const [catError, setCatError] = useState<string | null>(null)

  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Fetch category + subcategories
  useEffect(() => {
    if (!categorySlug) return
    setCatLoading(true)
    setCatError(null)
    supabase
      .from('categories')
      .select('id, name, slug, description, cover_image, meta_title, meta_desc, subcategories(id, name, slug, description, cover_image, sort_order)')
      .eq('slug', categorySlug)
      .eq('is_active', true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setCatError('Category not found.')
        } else {
          const sorted = {
            ...data,
            subcategories: [...(data.subcategories ?? [])].sort((a, b) => a.sort_order - b.sort_order),
          }
          setCategory(sorted as CategoryRow)
        }
        setCatLoading(false)
      })
  }, [categorySlug])

  // Resolve active subcategory
  const activeSubcategory = useMemo(() => {
    if (!subcategorySlug || !category) return null
    return category.subcategories.find(s => s.slug === subcategorySlug) ?? null
  }, [subcategorySlug, category])

  // Fetch products by category (and optionally subcategory)
  const { products, isLoading: productsLoading } = useProducts({
    category_id: category?.id,
    subcategory_id: activeSubcategory?.id,
  })

  const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const filtered = useMemo(() => {
    let result = [...products]
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      default: break
    }
    return result
  }, [products, sort])

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => {
      const next = new Set(prev)
      if (next.has(size)) next.delete(size)
      else next.add(size)
      return next
    })
  }

  // ── Loading ───────────────────────────────────────────────────
  if (catLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-cocoa/10 rounded" />
          <div className="h-4 w-64 bg-cocoa/10 rounded" />
          <div className="flex gap-3 mt-6">
            {[1,2,3,4].map(n => <div key={n} className="h-10 w-28 bg-cocoa/10 rounded-card" />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[1,2,3,4,5,6].map(n => <div key={n} className="h-80 bg-cocoa/10 rounded-card" />)}
          </div>
        </div>
      </div>
    )
  }

  // ── Error / not found ─────────────────────────────────────────
  if (catError || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <SEOHead title="Category not found" noIndex />
        <h1 className="font-heading text-3xl text-cocoa mb-4">Category not found</h1>
        <Link to="/shop" className="text-gold-accessible font-body font-medium hover:underline">
          Browse all products
        </Link>
      </div>
    )
  }

  const pageTitle = activeSubcategory
    ? `${activeSubcategory.name} — ${category.name}`
    : category.name

  const pageDescription = activeSubcategory?.description
    || category.meta_desc
    || category.description
    || `Shop ${category.name} at Savinra — premium handcrafted Indo-Western fashion.`

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical={activeSubcategory
          ? `/shop/${category.slug}/${activeSubcategory.slug}`
          : `/shop/${category.slug}`}
        ogImage={activeSubcategory?.cover_image || category.cover_image || undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://savinra.in' },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://savinra.in/shop' },
            { '@type': 'ListItem', position: 3, name: category.name, item: `https://savinra.in/shop/${category.slug}` },
            ...(activeSubcategory
              ? [{ '@type': 'ListItem', position: 4, name: activeSubcategory.name, item: `https://savinra.in/shop/${category.slug}/${activeSubcategory.slug}` }]
              : []),
          ],
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumbs */}
        <Breadcrumbs category={category} subcategory={activeSubcategory} />

        {/* Category header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-semibold text-cocoa mb-2">{pageTitle}</h1>
          {(activeSubcategory?.description || category.description) && (
            <p className="font-body text-sm text-cocoa/60 max-w-2xl">
              {activeSubcategory?.description || category.description}
            </p>
          )}
        </div>

        {/* Subcategory tiles */}
        {!activeSubcategory && category.subcategories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map(sub => (
                <Link
                  key={sub.slug}
                  to={`/shop/${category.slug}/${sub.slug}`}
                  className="group relative overflow-hidden rounded-card border border-cocoa/10 bg-ivory hover:border-gold-accessible transition-all px-5 py-3"
                >
                  <span className="font-body text-sm font-medium text-cocoa group-hover:text-gold-accessible transition-colors">
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to category link when in subcategory view */}
        {activeSubcategory && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Link
              to={`/shop/${category.slug}`}
              className="flex items-center gap-1 px-4 py-2 rounded-pill border border-cocoa/20 font-body text-sm text-cocoa hover:border-gold-accessible hover:text-gold-accessible transition-colors"
            >
              <X size={14} /> Clear subcategory
            </Link>
            {category.subcategories.map(sub => (
              <Link
                key={sub.slug}
                to={`/shop/${category.slug}/${sub.slug}`}
                className={cn(
                  'px-4 py-2 rounded-pill border font-body text-sm transition-colors',
                  sub.slug === subcategorySlug
                    ? 'bg-gold-accessible text-white border-gold-accessible'
                    : 'border-cocoa/20 text-cocoa hover:border-gold-accessible',
                )}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile filter/sort bar */}
        <div className="lg:hidden flex gap-3 mb-6">
          <button
            onClick={() => setMobileFiltersOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-ivory rounded-pill text-sm font-body font-medium text-cocoa border border-cocoa/10"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="appearance-none bg-ivory rounded-pill px-4 py-2 pr-8 text-sm font-body text-cocoa border border-cocoa/10 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa/40 pointer-events-none" />
          </div>
        </div>

        {mobileFiltersOpen && (
          <div className="lg:hidden bg-ivory rounded-card p-6 mb-6 shadow-card">
            <h3 className="font-body text-sm font-medium text-cocoa mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={cn(
                    'min-w-[40px] px-3 py-1.5 rounded-pill text-xs font-body font-medium border transition-colors',
                    selectedSizes.has(size)
                      ? 'bg-gold-accessible text-white border-gold-accessible'
                      : 'border-cocoa/20 text-cocoa hover:border-gold-accessible',
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main layout: desktop sidebar + product grid */}
        <div className="flex gap-12">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-body text-sm font-medium text-cocoa uppercase tracking-wider">Filters</h2>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value as SortOption)}
                    className="appearance-none bg-transparent text-xs font-body text-gold-accessible focus:outline-none cursor-pointer pr-4"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low</option>
                    <option value="price-desc">Price: High</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gold-accessible pointer-events-none" />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="font-body text-sm font-medium text-cocoa mb-3">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={cn(
                        'min-w-[40px] px-3 py-1.5 rounded-pill text-xs font-body font-medium border transition-colors',
                        selectedSizes.has(size)
                          ? 'bg-gold-accessible text-white border-gold-accessible'
                          : 'border-cocoa/20 text-cocoa hover:border-gold-accessible',
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            <p className="font-body text-sm text-cocoa/50 mb-6">
              {productsLoading ? 'Loading...' : `${filtered.length} piece${filtered.length !== 1 ? 's' : ''}`}
            </p>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className="bg-ivory rounded-card animate-pulse h-80" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-heading text-2xl text-cocoa mb-3">No pieces found</p>
                <p className="font-body text-cocoa/60 mb-6">
                  We&apos;re adding new pieces regularly — check back soon!
                </p>
                <Link to="/shop" className="text-gold-accessible font-body font-medium text-sm hover:underline">
                  Browse all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <LiveProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
