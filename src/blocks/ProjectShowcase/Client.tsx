'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

import type { Project } from '@/payload-types'

/* ------------------------------------------------------------------ */
/*  Sector labels                                                      */
/* ------------------------------------------------------------------ */
const sectorLabels: Record<string, string> = {
  manufacturing: 'Manufacturing',
  municipal: 'Municipal',
  commercial: 'Commercial',
  industrial: 'Industrial',
  agricultural: 'Agricultural',
}

/* ------------------------------------------------------------------ */
/*  Scroll card                                                        */
/* ------------------------------------------------------------------ */
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block w-72 md:w-80 shrink-0 aspect-[4/3] overflow-hidden rounded-xl"
    >
      {/* Background image */}
      {project.featuredImage && typeof project.featuredImage === 'object' && (
        <Media
          resource={project.featuredImage}
          imgClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          className="absolute inset-0 w-full h-full"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
        {/* Sector + Location */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
          {project.sector && (
            <span>{sectorLabels[project.sector] || project.sector}</span>
          )}
          {project.sector && project.location && <span>·</span>}
          {project.location && <span>{project.location}</span>}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-tight line-clamp-2">
          {project.title}
        </h3>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Main client component                                              */
/* ------------------------------------------------------------------ */
export const ProjectsShowcaseClient: React.FC<{
  projects: Project[]
  eyebrow?: string | null
  heading: string
  description?: string | null
  enableViewAll: boolean
  viewAllLink?: any
}> = ({
  projects,
  eyebrow,
  heading,
  description,
  enableViewAll,
  viewAllLink,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const cardWidth = 320 + 16 // w-80 + gap

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(Math.min(index, projects.length - 1))
  }, [cardWidth, projects.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateActiveIndex, { passive: true })
    return () => el.removeEventListener('scroll', updateActiveIndex)
  }, [updateActiveIndex])

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
  }

  return (
    <section className="py-16 md:py-20">
      {/* Header */}
      <div className="container mb-10">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-hydroera-blue mb-2">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {heading}
          </h2>
          {description && (
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Scrollable row — bleeds to right */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pl-4 md:pl-8 lg:pl-[max(2rem,calc((100vw-1376px)/2+2rem))] pr-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id || i} project={project} />
        ))}
      </div>

      {/* Bottom bar — dots + explore link */}
      <div className="container mt-8 flex items-center justify-between">
        {/* Dash indicators */}
        <div className="flex items-center gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'w-8 bg-hydroera-blue'
                  : 'w-4 bg-foreground/20 hover:bg-foreground/40',
              )}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>

        {/* Explore all link */}
        {enableViewAll && viewAllLink && (
          <CMSLink
            {...viewAllLink}
            appearance="default"
            size="default"
            className="flex items-center gap-1 text-sm font-semibold"
          />
        )}
      </div>
    </section>
  )
}
