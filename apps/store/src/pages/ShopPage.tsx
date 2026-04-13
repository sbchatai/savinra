import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PRODUCTS, COLLECTIONS } from '@/data/placeholder'
import ProductCard from '@/components/product/ProductCard'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type SortOption = 'newest' | 'price-asc' | 'price-desc'

export default function ShopPage() {
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set())
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set())
  const [occasionFilter, setOccasionFilter] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const toggleCollection = (slug: string) => {
    setSelectedCollections(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
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
    setSelectedCollections(new Set())
    setSelectedSizes(new Set())
    setOccasionFilter('')
  }

  const filtered = useMemo(() => {
    let result = [...PRODUCTS]
    if (selectedCollections.size > 0) {
      result = result.filter(p => selectedCollections.has(p.collectionSlug))
    }
    if (selectedSizes.size > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.has(s)))
    }
    if (occasionFilter) {
      result = result.filter(p => p.occasions.includes(occasionFilter))
    }
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      default: break
    }
    return result
  }, [selectedCollections, selectedSizes, occasionFilter, sort])

  const hasFilters = selectedCollections.size > 0 || selectedSizes.size > 0 || !!occasionFilter

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Collections */}
      <div>
        <h3 className="font-body text-sm font-medium text-cocoa mb-3">Collections</h3>
        <div className="space-y-2">
          {COLLECTIONS.map(col => (
            <label key={col.slug} className="flex items-center gap-2 cursor-pointer">
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                selectedCollections.has(col.slug) ? 'bg-gold-accessible border-gold-accessible' : 'border-cocoa/30'
              }`}>
                {selectedCollections.has(col.slug) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5"/></svg>
                )}
              </div>
              <span className="font-body text-sm text-cocoa">{col.name}</span>
              <span className="font-body text-xs text-cocoa/40 ml-auto">({col.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-body text-sm font-medium text-cocoa mb-3">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`min-w-[40px] px-3 py-1.5 rounded-pill text-xs font-body font-medium border transition-colors ${
                selectedSizes.has(size)
                  ? 'bg-gold-accessible text-white border-gold-accessible'
                  : 'border-cocoa/20 text-cocoa hover:border-gold-accessible'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="font-body text-sm text-gold-accessible hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-semibold text-cocoa mb-2">The Collection</h1>
        <p className="font-body text-sm text-cocoa/60">{filtered.length} pieces</p>
      </div>

      {/* Occasion tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Festive', 'Wedding', 'Casual', 'Work', 'Party'].map(occ => (
          <button
            key={occ}
            onClick={() => setOccasionFilter(occ === 'All' ? '' : occ.toLowerCase())}
            className={cn(
              'px-4 py-2 rounded-pill font-body text-sm font-medium border transition-all',
              (occ === 'All' && !occasionFilter) || occasionFilter === occ.toLowerCase()
                ? 'bg-gold-accessible text-white border-gold-accessible'
                : 'border-cocoa/20 text-cocoa hover:border-gold-accessible'
            )}
          >
            {occ}
          </button>
        ))}
      </div>

      {/* Mobile filter/sort bar */}
      <div className="lg:hidden flex gap-3 mb-6">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-ivory rounded-pill text-sm font-body font-medium text-cocoa border border-cocoa/10"
        >
          <SlidersHorizontal size={16} /> Filters {hasFilters && `(${selectedCollections.size + selectedSizes.size + (occasionFilter ? 1 : 0)})`}
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
          {Array.from(selectedCollections).map(slug => {
            const col = COLLECTIONS.find(c => c.slug === slug)
            return (
              <button
                key={slug}
                onClick={() => toggleCollection(slug)}
                className="flex items-center gap-1 bg-gold-highlight/30 text-cocoa text-xs font-body px-3 py-1.5 rounded-pill"
              >
                {col?.name} <X size={12} />
              </button>
            )
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
              {/* Sort */}
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
          {filtered.length === 0 ? (
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
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
