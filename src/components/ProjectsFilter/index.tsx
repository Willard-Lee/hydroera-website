'use client'

import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const sectors = [
  { label: 'All', value: '' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Municipal', value: 'municipal' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Agricultural', value: 'agricultural' },
]

const years = [
  { label: 'All Years', value: '' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: '2022', value: '2022' },
  { label: '2021', value: '2021' },
]

const statuses = [
  { label: 'All Status', value: '' },
  { label: 'Completed', value: 'completed' },
  { label: 'In Progress', value: 'in-progress' },
]

interface ProjectsFilterProps {
  totalResults: number
}

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ totalResults }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const currentSearch = searchParams.get('q') || ''
  const currentSector = searchParams.get('sector') || ''
  const currentYear = searchParams.get('year') || ''
  const currentStatus = searchParams.get('status') || ''
  const hasFilters = !!(currentSearch || currentSector || currentYear || currentStatus)

  const [yearOpen, setYearOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const yearRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) setYearOpen(false)
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false)
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

  const selectedYearLabel = years.find((y) => y.value === currentYear)?.label || 'All Years'
  const selectedStatusLabel = statuses.find((s) => s.value === currentStatus)?.label || 'All Status'

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
              placeholder="Search projects..."
              defaultValue={currentSearch}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-hydroera-blue/20 focus:border-hydroera-blue transition-colors"
            />
          </div>

          {/* Sector pill tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {sectors.map((sector) => {
              const isActive = currentSector === sector.value
              return (
                <button
                  key={sector.value}
                  onClick={() => updateParams('sector', sector.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-hydroera-blue text-white shadow-sm'
                      : 'bg-white border border-border text-foreground hover:bg-muted/60'
                  }`}
                >
                  {sector.label}
                </button>
              )
            })}
          </div>

          {/* Dropdowns + clear + count */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Year dropdown */}
            <div ref={yearRef} className="relative">
              <button
                onClick={() => { setYearOpen(!yearOpen); setStatusOpen(false) }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                  currentYear
                    ? 'bg-hydroera-blue/5 border-hydroera-blue/30 text-hydroera-blue'
                    : 'bg-white border-border text-foreground hover:bg-muted/60'
                }`}
              >
                {selectedYearLabel}
                <svg
                  className={`h-4 w-4 transition-transform ${yearOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {yearOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-border rounded-xl shadow-lg py-1 z-40 min-w-[140px]">
                  {years.map((year) => (
                    <button
                      key={year.value}
                      onClick={() => {
                        updateParams('year', year.value)
                        setYearOpen(false)
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        currentYear === year.value
                          ? 'text-hydroera-blue font-semibold'
                          : 'text-foreground hover:bg-muted/60'
                      }`}
                    >
                      {year.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status dropdown */}
            <div ref={statusRef} className="relative">
              <button
                onClick={() => { setStatusOpen(!statusOpen); setYearOpen(false) }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                  currentStatus
                    ? 'bg-hydroera-blue/5 border-hydroera-blue/30 text-hydroera-blue'
                    : 'bg-white border-border text-foreground hover:bg-muted/60'
                }`}
              >
                {selectedStatusLabel}
                <svg
                  className={`h-4 w-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {statusOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-border rounded-xl shadow-lg py-1 z-40 min-w-[140px]">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => {
                        updateParams('status', status.value)
                        setStatusOpen(false)
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        currentStatus === status.value
                          ? 'text-hydroera-blue font-semibold'
                          : 'text-foreground hover:bg-muted/60'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear + count */}
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-sm font-medium text-hydroera-blue hover:underline whitespace-nowrap"
              >
                Clear all
              </button>
            )}
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {totalResults} {totalResults === 1 ? 'project' : 'projects'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
