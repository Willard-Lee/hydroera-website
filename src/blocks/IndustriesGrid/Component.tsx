'use client'

import React from 'react'
import type { IndustriesGridBlock as IndustriesGridBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const iconMap: Record<string, React.ReactNode> = {
  water: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  factory: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M2 20V8l4 3V8l4 3V8l4 3V4h8v16H2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  building: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M3 21h18M5 21V7l7-4v18M19 21V11l-7-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9h1M9 13h1M9 17h1" strokeLinecap="round" />
    </svg>
  ),
  agriculture: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s-1.5 3-2 6c3-1 6-2 6-2s-1.4 1.5-3.4 7.2A7 7 0 0 1 11 20z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  oilgas: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 2-6.5 0 3.25 2.5 5 3.5 7.5a5 5 0 0 1-5 7c-1.5 0-3.5-1-4.5-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 17s0 4 6 4 6-4 6-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  power: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mining: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="m8 3 4 8 5-5 2 4H2l6-7z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" strokeLinecap="round" />
      <path d="M5.5 20c2.5-1.5 5-1.5 7.5 0s5 1.5 7.5 0" strokeLinecap="round" />
    </svg>
  ),
  government: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  hospitality: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" strokeLinecap="round" />
    </svg>
  ),
  construction: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 22h20M10 7h4M10 11h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 22v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

export const IndustriesGridBlock: React.FC<IndustriesGridBlockType> = ({
  eyebrow,
  heading,
  subheading,
  industries,
}) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          {eyebrow && (
            <span className="inline-block text-sm font-semibold text-hydroera-blue tracking-wider uppercase mb-3">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* Grid */}
        {industries && industries.length > 0 && (
          <div
            className={cn('grid gap-4 md:gap-5', {
              'grid-cols-1 sm:grid-cols-2': industries.length <= 4,
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': industries.length > 4 && industries.length <= 6,
              'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': industries.length > 6,
            })}
          >
            {industries.map((industry, i) => (
              <div
                key={industry.id || i}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
              >
                {/* Background image */}
                {industry.image && typeof industry.image === 'object' && (
                  <Media
                    resource={industry.image}
                    imgClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/50" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  {/* Icon badge */}
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm text-white flex items-center justify-center mb-3 transition-all duration-500 group-hover:bg-hydroera-blue group-hover:scale-110">
                    {iconMap[industry.icon] || iconMap.water}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white leading-tight mb-1 transition-transform duration-500 group-hover:translate-y-0">
                    {industry.title}
                  </h3>

                  {/* Description — slides up on hover */}
                  {industry.description && (
                    <p className="text-sm text-white/70 leading-relaxed max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-1">
                      {industry.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
