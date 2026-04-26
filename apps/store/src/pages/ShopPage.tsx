import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import LiveProductCard from '@/components/product/LiveProductCard'
import { cn } from '@/lib/utils'
import SEOHead from '@/components/layout/SEOHead'

type SortOption = 'newest' | 'price-asc' | 'price-desc'

const OCCASION_TABS = [
  { label: 'All', value: '' },
  { label: 'Festive', value: 'festive' },
  { label: 'Wedding', value: 'wedding' },
  { label: 'Casual', value: 'casual' },
  { label: 'Work', value: 'work' },
  { label: 'Party', value: 'party' },
]

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ShopPage() {
  const [searchParams] = useSearchParams()

  const { categories } = useCategories()
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set())
  const [occasionFilter, setOccasionFilter] = useState(() => searchParams.get('occasion') || '')
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const { products, isLoading } = useProducts({
    occasion: occasionFilter || undefined,
  })

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => {
      const next = new Set(prev)
      if (next.has(size)) next.delete(size)
      else next.add(size)
      return next
    })
  }

  const clearFilters = () => {
    setSelectedCategories(new Set())
    setSelectedSizes(new Set())
    setOccasionFilter('')
    setSearchQuery('')
    setPriceMin('')
    setPriceMax('')
  }

  const filtered = useMemo(() => {
    let result = [...products]

    // Category filter
    if (selectedCategories.size > 0) {
      result = result.filter(p => (p as any).category_id && selectedCategories.has((p as any).category_id))
    }

    // Size filter
    if (selectedSizes.size > 0) {
      result = result.filter(p =>
        (p as any).variants?.some((v: { size: string; stock_count: number }) =>
          selectedSizes.has(v.size) && v.stock_count > 0
        ) ?? true
      )
    }

    // Price range (products stored in paise, inputs are rupees)
    const minP = priceMin ? parseInt(priceMin) * 100 : 0
    const maxP = priceMax ? parseInt(priceMax) * 100 : Infinity
    if (priceMin || priceMax) {
      result = result.filter(p => p.price >= minP && p.price <= maxP)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        ((p as any).tags ?? []).some((tag: string) => tag.toLowerCase().includes(q))
      )
    }

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      default: break
    }
    return result
  }, [products, selectedCategories, selectedSizes, priceMin, priceMax, sort, searchQuery])

  const hasFilters = selectedCategories.size > 0 || selectedSizes.size > 0 || !!occasionFilter || !!priceMin || !!priceMax || !!searchQuery.trim()

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-body text-sm font-medium text-cocoa mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleCategory(cat.id)}>
              <div
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0',
                  selectedCategories.has(cat.id)
                    ? 'bg-gold-accessible border-gold-accessible'
                    : 'border-cocoa/30'
                )}
              >
                {selectedCategories.has(cat.id) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5"/></svg>
                )}
              </div>
              <span className="font-body text-sm text-cocoa">{cat.name}</span>
            </label>
          ))}
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
                  : 'border-cocoa/20 text-cocoa hover:border-gold-accessible'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-body text-sm font-medium text-cocoa mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/40 text-xs font-body">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-full bg-white border border-cocoa/20 rounded-lg pl-6 pr-3 py-2 text-xs font-body text-cocoa focus:outline-none focus:border-gold-accessible"
            />
          </div>
          <span className="text-cocoa/40 text-xs">—</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/40 text-xs font-body">₹</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-full bg-white border border-cocoa/20 rounded-lg pl-6 pr-3 py-2 text-xs font-body text-cocoa focus:outline-none focus:border-gold-accessible"
            />
          </div>
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="font-body text-sm text-gold-accessible hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SEOHead
        title="Shop Indo-Western Clothing"
        description="Browse all handcrafted Indo-Western pieces — kurtas, suits, festive & casual wear. Filter by collection, size, and occasion."
        canonical="/shop"
      />
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-semibold text-cocoa mb-2">The Collection</h1>
        <p className="font-body text-sm text-cocoa/60">
          {isLoading ? 'Loading...' : `${filtered.length} pieces`}
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search styles, fabrics, occasions..."
            className="w-full pl-9 pr-4 py-3 bg-ivory border border-cocoa/15 rounded-card text-sm font-body text-cocoa placeholder-cocoa/40 focus:outline-none focus:border-gold-accessible"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa/40 hover:text-cocoa"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Occasion tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {OCCASION_TABS.map(occ => (
          <button
            key={occ.value}
            onClick={() => setOccasionFilter(occ.value)}
            className={cn(
              'px-4 py-2 rounded-pill font-body text-sm font-medium border transition-all',
              occasionFilter === occ.value
                ? 'bg-gold-accessible text-white border-gold-accessible'
                : 'border-cocoa/20 text-cocoa hover:border-gold-accessible'
            )}
          >
            {occ.label}
          </button>
        ))}
      </div>

      {/* Mobile filter/sort bar */}
      <div className="lg:hidden flex gap-3 mb-6">
        <button
          onClick={() => setMobileFiltersOpen(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-ivory rounded-pill text-sm font-body font-medium text-cocoa border border-cocoa/10"
        >
          <SlidersHorizontal size={16} /> Filters {hasFilters && `(${selectedCategories.size + selectedSizes.size + (occasionFilter ? 1 : 0) + (priceMin || priceMax ? 1 : 0)})`}
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

      {/* Mobile filters panel */}
      {mobileFiltersOpen && (
        <div className="lg:hidden bg-ivory rounded-card p-6 mb-6 shadow-card">
          <FilterPanel />
        </div>
      )}

      {/* Applied filter pills */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Array.from(selectedCategories).map(id => {
            const cat = categories.find(c => c.id === id)
            return cat ? (
              <button
                key={id}
                onClick={() => toggleCategory(id)}
                className="flex items-center gap-1 bg-gold-highlight/30 text-cocoa text-xs font-body px-3 py-1.5 rounded-pill"
              >
                {cat.name} <X size={12} />
              </button>
            ) : null
          })}
          {Array.from(selectedSizes).map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className="flex items-center gap-1 bg-gold-highlight/30 text-cocoa text-xs font-body px-3 py-1.5 rounded-pill"
            >
              {size} <X size={12} />
            </button>
          ))}
          {(priceMin || priceMax) && (
            <button
              onClick={() => { setPriceMin(''); setPriceMax('') }}
              className="flex items-center gap-1 bg-gold-highlight/30 text-cocoa text-xs font-body px-3 py-1.5 rounded-pill"
            >
              ₹{priceMin || '0'} – ₹{priceMax || '∞'} <X size={12} />
            </button>
          )}
          {occasionFilter && (
            <button
              onClick={() => setOccasionFilter('')}
              className="flex items-center gap-1 bg-gold-highlight/30 text-cocoa text-xs font-body px-3 py-1.5 rounded-pill"
            >
              {occasionFilter} <X size={12} />
            </button>
          )}
        </div>
      )}

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
            <FilterPanel />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className="bg-ivory rounded-card animate-pulse h-80" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-heading text-2xl text-cocoa mb-3">No pieces found</p>
              <p className="font-body text-cocoa/60 mb-6">Try adjusting your filters</p>
              <button onClick={clearFilters} className="text-gold-accessible font-body font-medium text-sm hover:underline">
                Clear filters
              </button>
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
  )
}
