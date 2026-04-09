'use client'

import React, { useCallback } from 'react'
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

  const currentSearch = searchParams.get('q') || ''
  const currentCategory = searchParams.get('category') || ''

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

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search input */}
          <div className="relative flex-1 w-full sm:max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
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
              onChange={(e) => updateParams('q', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hydroera-blue/20 focus:border-hydroera-blue transition-colors"
            />
          </div>

          {/* Category dropdown */}
          <select
            value={currentCategory}
            onChange={(e) => updateParams('category', e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hydroera-blue/20 focus:border-hydroera-blue transition-colors appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m4%206%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Result count */}
          <span className="text-sm text-muted-foreground whitespace-nowrap ml-auto">
            {totalResults} {totalResults === 1 ? 'product' : 'products'} found
          </span>
        </div>
      </div>
    </div>
  )
}
