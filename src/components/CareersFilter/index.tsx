'use client'

import React, { useCallback, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const departments = [
  { label: 'All Departments', value: '' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Sales', value: 'sales' },
  { label: 'Service & Maintenance', value: 'service' },
  { label: 'Operations', value: 'operations' },
  { label: 'R&D', value: 'rd' },
  { label: 'Quality Assurance', value: 'qa' },
  { label: 'Administration', value: 'administration' },
]

const employmentTypes = [
  { label: 'All Types', value: '' },
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
]

interface CareersFilterProps {
  totalResults: number
}

export const CareersFilter: React.FC<CareersFilterProps> = ({ totalResults }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const currentSearch = searchParams.get('q') || ''
  const currentDept = searchParams.get('department') || ''
  const currentType = searchParams.get('type') || ''
  const hasFilters = !!(currentSearch || currentDept || currentType)

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
    <div className="bg-white border-b border-border">
      <div className="container py-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Search input */}
          <div className="relative w-full lg:w-80">
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
              placeholder="Search positions..."
              defaultValue={currentSearch}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-hydroera-blue/20 focus:border-hydroera-blue transition-colors"
            />
          </div>

          {/* Department pill tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {departments.map((dept) => {
              const isActive = currentDept === dept.value
              return (
                <button
                  key={dept.value}
                  onClick={() => updateParams('department', dept.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-hydroera-blue text-white shadow-sm'
                      : 'bg-white border border-border text-foreground hover:bg-muted/60'
                  }`}
                >
                  {dept.label}
                </button>
              )
            })}
          </div>

          {/* Employment type + clear + count */}
          <div className="flex items-center gap-3 ml-auto">
            <select
              value={currentType}
              onChange={(e) => updateParams('type', e.target.value)}
              className="px-4 py-2 text-sm bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-hydroera-blue/20 focus:border-hydroera-blue transition-colors"
            >
              {employmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-sm font-medium text-hydroera-blue hover:underline whitespace-nowrap"
              >
                Clear all
              </button>
            )}
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {totalResults} {totalResults === 1 ? 'position' : 'positions'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
