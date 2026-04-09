'use client'

import React, { useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const sectors = [
  { label: 'All Sectors', value: '' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Municipal', value: 'municipal' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Agricultural', value: 'agricultural' },
]

interface ProjectsFilterProps {
  totalResults: number
}

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ totalResults }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentSearch = searchParams.get('q') || ''
  const currentSector = searchParams.get('sector') || ''

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
    <div className="bg-white border-b border-border">
      <div className="container py-6">
        {/* Sector pill tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {sectors.map((sector) => {
            const isActive = currentSector === sector.value
            return (
              <button
                key={sector.value}
                onClick={() => updateParams('sector', sector.value)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-hydroera-blue text-white shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {sector.label}
              </button>
            )
          })}
        </div>

        {/* Search + result count row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
              placeholder="Search projects..."
              defaultValue={currentSearch}
              onChange={(e) => updateParams('q', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hydroera-blue/20 focus:border-hydroera-blue transition-colors"
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap ml-auto">
            {totalResults} {totalResults === 1 ? 'project' : 'projects'} found
          </span>
        </div>
      </div>
    </div>
  )
}
