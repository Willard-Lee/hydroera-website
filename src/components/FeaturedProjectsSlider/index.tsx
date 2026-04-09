'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Project } from '@/payload-types'

interface FeaturedProjectsSliderProps {
  projects: Project[]
}

export const FeaturedProjectsSlider: React.FC<FeaturedProjectsSliderProps> = ({ projects }) => {
  const [current, setCurrent] = useState(0)
  const total = projects.length

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

  // Auto-advance every 6s
  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, total])

  if (total === 0) return null

  const project = projects[current]!

  // Collect gallery images for tiles
  const galleryImages =
    project.gallery?.filter((item) => item.image && typeof item.image === 'object') || []

  return (
    <div className="relative bg-[#0b1120] text-white overflow-hidden" data-theme="dark">
      <div className="relative min-h-[60vh] flex items-end">
        {/* Background images with crossfade */}
        {projects.map((p, i) => (
          <div
            key={p.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {p.featuredImage && typeof p.featuredImage === 'object' && (
              <Media
                resource={p.featuredImage}
                fill
                imgClassName="object-cover"
                priority={i === 0}
              />
            )}
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120]/95 via-[#0b1120]/70 to-[#0b1120]/40 z-10" />

        {/* Content */}
        <div className="container relative z-20 pb-12 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            {/* Left: text content */}
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-hydroera-blue mb-3">
                Featured Project
              </span>

              {project.sector && (
                <div className="flex items-center gap-3 text-sm text-white/60 mb-3">
                  <span className="capitalize">{project.sector}</span>
                  {project.location && (
                    <>
                      <span className="text-white/30">—</span>
                      <span>{project.location}</span>
                    </>
                  )}
                  {project.completionYear && (
                    <>
                      <span className="text-white/30">—</span>
                      <span>{project.completionYear}</span>
                    </>
                  )}
                </div>
              )}

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-4">
                {project.title}
              </h2>

              {project.summary && (
                <p className="text-base text-white/50 leading-relaxed mb-6 line-clamp-2 max-w-lg">
                  {project.summary}
                </p>
              )}

              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-2 bg-hydroera-blue text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-hydroera-blue/90 transition-colors"
              >
                View Case Study
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {/* Navigation */}
              {total > 1 && (
                <div className="flex items-center gap-4 mt-8">
                  <button
                    onClick={prev}
                    className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Previous project"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Next project"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2 ml-2">
                    {projects.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === current ? 'w-6 bg-hydroera-blue' : 'w-2 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to project ${i + 1}`}
                      />
                    ))}
                  </div>

                  <span className="text-sm text-white/40 ml-auto tabular-nums">
                    {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {/* Right: gallery image tiles */}
            {galleryImages.length > 0 && (
              <div className="hidden lg:grid grid-cols-2 gap-3">
                {galleryImages.slice(0, 4).map((item, i) => (
                  <div
                    key={item.id || i}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10"
                  >
                    {typeof item.image === 'object' && (
                      <Media
                        resource={item.image}
                        fill
                        imgClassName="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                ))}
                {/* "View more" overlay on the last tile if more than 4 images */}
                {galleryImages.length > 4 && (
                  <div className="absolute bottom-0 right-0 w-[calc(50%-6px)] aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-white">
                      +{galleryImages.length - 4} more
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
