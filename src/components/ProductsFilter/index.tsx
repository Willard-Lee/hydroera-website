'use client'

import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const categories = [
  { label: 'All Products', value: '' },
  { label: 'Centrifugal Pumps', value: 'centrifugal-pumps' },
  { label: 'Submersible Pumps', value: 'submersible-pumps' },
  { label: 'Booster Systems', value: 'booster-systems' },
  { label: 'Control Panels', value: 'control-panels' },
  { label: 'Spare Parts', value: 'spare-parts' },
]

interface ProductsFilterProps {
  totalResults: number
}

export const ProductsFilter: React.FC<ProductsFilterProps> = ({ totalResults }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const currentSearch = searchParams.get('q') || ''
  const currentCategory = searchParams.get('category') || ''
  const hasFilters = !!(currentSearch || currentCategory)

  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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

  const selectedCatLabel = categories.find((c) => c.value === currentCategory)?.label || 'All Products'

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search input */}
          <div className="relative flex-1 w-full sm:max-w-sm">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={currentSearch}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-hydroera-blue/20 focus:border-hydroera-blue transition-colors"
            />
          </div>

          {/* Category dropdown */}
          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full border transition-colors ${
                currentCategory
                  ? 'bg-hydroera-blue/5 border-hydroera-blue/30 text-hydroera-blue'
                  : 'bg-white border-border text-foreground hover:bg-muted/60'
              }`}
            >
              {selectedCatLabel}
              <svg
                className={`h-4 w-4 transition-transform ${catOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {catOpen && (
              <div className="absolute top-full mt-2 left-0 bg-white border border-border rounded-xl shadow-lg py-1 z-40 min-w-[180px]">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      updateParams('category', cat.value)
                      setCatOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      currentCategory === cat.value
                        ? 'text-hydroera-blue font-semibold'
                        : 'text-foreground hover:bg-muted/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear filters + result count */}
          <div className="flex items-center gap-3 ml-auto">
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-sm font-medium text-hydroera-blue hover:underline"
              >
                Clear filters
              </button>
            )}
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {totalResults} {totalResults === 1 ? 'product' : 'products'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
