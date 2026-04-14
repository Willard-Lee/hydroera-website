'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Search, ChevronDown, X } from 'lucide-react'

const sectors = [
  { label: 'All Sectors', value: '' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Municipal', value: 'municipal' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Agricultural', value: 'agricultural' },
]

const statuses = [
  { label: 'All Status', value: '' },
  { label: 'Completed', value: 'completed' },
  { label: 'In Progress', value: 'in-progress' },
]

interface ProjectsSidebarProps {
  totalResults: number
  years: number[]
}

export const ProjectsSidebar: React.FC<ProjectsSidebarProps> = ({ totalResults, years }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const yearDebounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const currentSearch = searchParams.get('q') || ''
  const currentSector = searchParams.get('sector') || ''
  const currentYearMin = searchParams.get('yearMin') || ''
  const currentYearMax = searchParams.get('yearMax') || ''
  const currentStatus = searchParams.get('status') || ''
  const hasFilters = !!(currentSearch || currentSector || currentYearMin || currentYearMax || currentStatus)

  const [sectorOpen, setSectorOpen] = useState(true)
  const [yearOpen, setYearOpen] = useState(true)
  const [statusOpen, setStatusOpen] = useState(true)

  const minYear = years.length > 0 ? years[0] : 2020
  const maxYear = years.length > 0 ? years[years.length - 1] : new Date().getFullYear()

  const [rangeMin, setRangeMin] = useState<number>(currentYearMin ? Number(currentYearMin) : minYear)
  const [rangeMax, setRangeMax] = useState<number>(currentYearMax ? Number(currentYearMax) : maxYear)

  const yearIsFiltered = !!(currentYearMin || currentYearMax)

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

  const updateYearRange = useCallback(
    (newMin: number, newMax: number) => {
      if (yearDebounceRef.current) clearTimeout(yearDebounceRef.current)
      yearDebounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (newMin > minYear) {
          params.set('yearMin', String(newMin))
        } else {
          params.delete('yearMin')
        }
        if (newMax < maxYear) {
          params.set('yearMax', String(newMax))
        } else {
          params.delete('yearMax')
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      }, 300)
    },
    [searchParams, router, pathname, minYear, maxYear],
  )

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => updateParams('q', value), 300)
    },
    [updateParams],
  )

  const clearAll = useCallback(() => {
    setRangeMin(minYear)
    setRangeMax(maxYear)
    router.push(pathname, { scroll: false })
  }, [router, pathname, minYear, maxYear])

  const clearYear = useCallback(() => {
    setRangeMin(minYear)
    setRangeMax(maxYear)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('yearMin')
    params.delete('yearMax')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams, minYear, maxYear])

  const handleMinChange = (value: number) => {
    const clamped = Math.min(value, rangeMax)
    setRangeMin(clamped)
    updateYearRange(clamped, rangeMax)
  }

  const handleMaxChange = (value: number) => {
    const clamped = Math.max(value, rangeMin)
    setRangeMax(clamped)
    updateYearRange(rangeMin, clamped)
  }

  // Calculate fill percentage for the slider track
  const range = maxYear - minYear || 1
  const leftPercent = ((rangeMin - minYear) / range) * 100
  const rightPercent = ((rangeMax - minYear) / range) * 100

  return (
    <div className="lg:sticky lg:top-28 space-y-6">
      {/* Result count */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {totalResults} {totalResults === 1 ? 'project' : 'projects'}
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
            placeholder="Search projects..."
            defaultValue={currentSearch}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hydroera-blue/20 focus:border-hydroera-blue transition-colors"
          />
        </div>
      </div>

      {/* Sector filter */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setSectorOpen(!sectorOpen)}
          className="flex items-center justify-between w-full p-4 text-left"
        >
          <span className="text-sm font-semibold text-foreground">Sector</span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${sectorOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {sectorOpen && (
          <div className="px-4 pb-4 space-y-1">
            {sectors.map((sector) => (
              <button
                key={sector.value}
                onClick={() => updateParams('sector', sector.value)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentSector === sector.value
                    ? 'bg-hydroera-blue/10 text-hydroera-blue font-semibold'
                    : 'text-foreground hover:bg-muted/60'
                }`}
              >
                {sector.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Year range slider */}
      {years.length > 1 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setYearOpen(!yearOpen)}
            className="flex items-center justify-between w-full p-4 text-left"
          >
            <span className="text-sm font-semibold text-foreground">Year</span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${yearOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {yearOpen && (
            <div className="px-4 pb-4">
              {/* Selected range display */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-hydroera-blue">{rangeMin}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-lg font-bold text-hydroera-blue">{rangeMax}</span>
                </div>
                {yearIsFiltered && (
                  <button
                    onClick={clearYear}
                    className="text-xs text-muted-foreground hover:text-hydroera-blue transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Dual range slider */}
              <div className="relative h-6 flex items-center">
                {/* Track background */}
                <div className="absolute left-0 right-0 h-1.5 bg-border rounded-full" />
                {/* Active track fill */}
                <div
                  className="absolute h-1.5 bg-hydroera-blue rounded-full"
                  style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
                />
                {/* Min thumb */}
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  step={1}
                  value={rangeMin}
                  onChange={(e) => handleMinChange(Number(e.target.value))}
                  className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-hydroera-blue [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-hydroera-blue [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
                />
                {/* Max thumb */}
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  step={1}
                  value={rangeMax}
                  onChange={(e) => handleMaxChange(Number(e.target.value))}
                  className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-hydroera-blue [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-hydroera-blue [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
                />
              </div>

              {/* Min/Max labels */}
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">{minYear}</span>
                <span className="text-xs text-muted-foreground">{maxYear}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status filter */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setStatusOpen(!statusOpen)}
          className="flex items-center justify-between w-full p-4 text-left"
        >
          <span className="text-sm font-semibold text-foreground">Status</span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${statusOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {statusOpen && (
          <div className="px-4 pb-4 space-y-1">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => updateParams('status', status.value)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentStatus === status.value
                    ? 'bg-hydroera-blue/10 text-hydroera-blue font-semibold'
                    : 'text-foreground hover:bg-muted/60'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
