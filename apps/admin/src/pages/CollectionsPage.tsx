import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, assertSupabase } from '@/lib/supabase'

// Guard: prevent runtime crash when Supabase env vars are missing

import CollectionFormModal from '@/components/CollectionFormModal'

interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  occasion: string | null
  sort_order: number
  is_active: boolean
  product_count?: number
}

function OccasionBadge({ occasion }: { occasion: string | null }) {
  const map: Record<string, string> = {
    festive: 'bg-purple-100 text-purple-700 border-purple-200',
    wedding: 'bg-rose-100 text-rose-700 border-rose-200',
    casual: 'bg-sky-100 text-sky-700 border-sky-200',
    work: 'bg-slate-100 text-slate-700 border-slate-200',
    party: 'bg-amber-100 text-amber-700 border-amber-200',
  }
  if (!occasion) return null
  const cls = map[occasion] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {occasion}
    </span>
  )
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { loadCollections() }, [])

  async function loadCollections() {
    setIsLoading(true)
    const { data } = await supabase
      .from('collections')
      .select('*, product_count:collection_products(count)')
      .order('sort_order', { ascending: true })
    setCollections(
      (data ?? []).map((c: any) => ({
        ...c,
        product_count: c.product_count?.[0]?.count ?? 0,
      }))
    )
    setIsLoading(false)
  }

  async function toggleActive(col: Collection) {
    await supabase!.from('collections').update({ is_active: !col.is_active }).eq('id', col.id)
    setCollections((prev) => prev.map((c) => (c.id === col.id ? { ...c, is_active: !c.is_active } : c)))
  }

  async function deleteCollection(col: Collection) {
    if (!confirm(`Delete "${col.name}"? All product links will be removed.`)) return
    setDeletingId(col.id)
    await supabase!.from('collections').delete().eq('id', col.id)
    setCollections((prev) => prev.filter((c) => c.id !== col.id))
    setDeletingId(null)
  }

  const filtered = collections.filter((c) =>
    !searchQuery ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.occasion ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  function openEdit(id: string) { setEditId(id); setShowModal(true) }
  function openNew() { setEditId(null); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditId(null) }
  function onSaved() { loadCollections(); closeModal() }

  return (
    <section aria-labelledby="collections-heading">
      <h2 id="collections-heading" className="sr-only">Collections</h2>

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <input
          type="search"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 text-sm border border-admin-border rounded text-cocoa bg-parchment placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 font-body w-64"
          aria-label="Search collections"
        />
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa text-parchment text-sm font-medium rounded-pill font-body hover:bg-cocoa/80 transition-colors"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Collection
        </button>
      </div>

      {/* Grid */}
      <div className="bg-parchment rounded-card shadow-card border border-admin-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-cocoa/40 font-body">Loading collections…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-cocoa/40 font-body">
            {searchQuery ? 'No collections match your search.' : 'No collections yet.'}
            {!searchQuery && (
              <button onClick={openNew} className="mt-3 text-gold hover:text-gold/80 font-medium text-sm transition-colors">
                Create your first collection →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-admin-border/50">
            {filtered.map((col) => (
              <div key={col.id} className="relative group">
                {/* Cover image */}
                <div className="aspect-[4/3] bg-ivory relative overflow-hidden">
                  {col.cover_image ? (
                    <img
                      src={col.cover_image}
                      alt={col.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-admin-border/20">
                      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" className="text-cocoa/15" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  {!col.is_active && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-pill">Inactive</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(col.id)}
                      className="bg-white/90 text-cocoa text-xs font-medium px-3 py-1.5 rounded-pill hover:bg-white transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-cocoa font-body text-sm">{col.name}</p>
                      <p className="text-xs text-cocoa/40 font-mono">{col.slug}</p>
                    </div>
                    <OccasionBadge occasion={col.occasion} />
                  </div>
                  {col.description && (
                    <p className="text-xs text-cocoa/60 font-body line-clamp-2">{col.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-cocoa/40 font-body">{col.product_count} product{col.product_count !== 1 ? 's' : ''}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(col)}
                        className="text-xs font-body transition-colors"
                        style={{ color: col.is_active ? '#f59e0b' : '#9ca3af' }}
                      >
                        {col.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteCollection(col)}
                        disabled={deletingId === col.id}
                        className="text-xs text-error/60 hover:text-error font-body transition-colors disabled:opacity-50"
                      >
                        {deletingId === col.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CollectionFormModal
          collectionId={editId}
          onClose={closeModal}
          onSaved={onSaved}
        />
      )}
    </section>
  )
}