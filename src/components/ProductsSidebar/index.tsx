'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Search, ChevronDown, X } from 'lucide-react'

interface ProductsSidebarProps {
  categories: { label: string; value: string }[]
  totalResults: number
}

export const ProductsSidebar: React.FC<ProductsSidebarProps> = ({
  categories,
  totalResults,
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const currentSearch = searchParams.get('q') || ''
  const currentCategory = searchParams.get('category') || ''
  const hasFilters = !!(currentSearch || currentCategory)

  const [catOpen, setCatOpen] = useState(true)

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => updateParams('q', value), 300)
    },
    [updateParams],
  )

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  return (
    <div className="lg:sticky lg:top-28 space-y-6">
      {/* Result count */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {totalResults} {totalResults === 1 ? 'product' : 'products'}
        </span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-hydroera-blue hover:underline"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <label className="block text-sm font-semibold text-foreground mb-3">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={currentSearch}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hydroera-blue/20 focus:border-hydroera-blue transition-colors"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setCatOpen(!catOpen)}
          className="flex items-center justify-between w-full p-4 text-left"
        >
          <span className="text-sm font-semibold text-foreground">Category</span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${catOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {catOpen && (
          <div className="px-4 pb-4 space-y-1">
            {/* All option */}
            <button
              onClick={() => updateParams('category', '')}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                !currentCategory
                  ? 'bg-hydroera-blue/10 text-hydroera-blue font-semibold'
                  : 'text-foreground hover:bg-muted/60'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => updateParams('category', cat.value)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentCategory === cat.value
                    ? 'bg-hydroera-blue/10 text-hydroera-blue font-semibold'
                    : 'text-foreground hover:bg-muted/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
