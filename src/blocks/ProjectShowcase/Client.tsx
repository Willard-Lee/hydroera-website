'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { ArrowRight, MapPin } from 'lucide-react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

import type { Project } from '@/payload-types'

/* ------------------------------------------------------------------ */
/*  Project card                                                       */
/* ------------------------------------------------------------------ */
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const sectorLabels: Record<string, string> = {
    manufacturing: 'Manufacturing',
    municipal: 'Municipal',
    commercial: 'Commercial',
    industrial: 'Industrial',
    agricultural: 'Agricultural',
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block"
    >
      <article className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-hydroera-blue/30 hover:shadow-[0_4px_20px_rgba(11,79,138,0.08)] hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.featuredImage && typeof project.featuredImage === 'object' && (
            <Media
              resource={project.featuredImage}
              imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              className="w-full h-full"
            />
          )}

          {/* Sector badge */}
          {project.sector && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-hydroera-blue-dark rounded-md">
                {sectorLabels[project.sector] || project.sector}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-hydroera-blue transition-colors">
            {project.title}
          </h3>

          {project.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {project.summary}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {project.client && (
              <span className="font-medium text-foreground">{project.client}</span>
            )}
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {project.location}
              </span>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="mt-4 flex items-center text-sm font-medium text-hydroera-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>View project</span>
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </article>
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
  return (
    <section className="container">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div className="max-w-xl">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-hydroera-blue mb-2">
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

        {/* View all link — desktop */}
        {enableViewAll && viewAllLink && (
          <div className="hidden md:block shrink-0">
            <CMSLink
              {...viewAllLink}
              size="default"
            />
          </div>
        )}
      </div>

      {/* Projects grid */}
      <div
        className={cn('grid gap-6', {
          'grid-cols-1 sm:grid-cols-2': projects.length === 2,
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': projects.length >= 3,
        })}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id || i} project={project} />
        ))}
      </div>

      {/* View all link — mobile */}
      {enableViewAll && viewAllLink && (
        <div className="md:hidden mt-8 text-center">
          <CMSLink
            {...viewAllLink}
            size="default"
          />
        </div>
      )}
    </section>
  )
}