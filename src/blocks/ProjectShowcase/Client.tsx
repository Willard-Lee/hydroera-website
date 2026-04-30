'use client'

import React from 'react'
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
/*  Bento project card                                                 */
/* ------------------------------------------------------------------ */
const BentoCard: React.FC<{
  project: Project
  large?: boolean
}> = ({ project, large }) => {
  const statusLabel =
    project.projectStatus === 'completed'
      ? 'Completed'
      : project.projectStatus === 'in-progress'
        ? 'In Progress'
        : project.projectStatus === 'upcoming'
          ? 'Upcoming'
          : null

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        'group relative block overflow-hidden rounded-xl',
        large ? 'h-full min-h-[400px]' : 'h-full min-h-[200px]',
      )}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/40" />

      {/* Status badge */}
      {statusLabel && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className={cn(
              'inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md',
              project.projectStatus === 'completed'
                ? 'bg-emerald-500 text-white'
                : project.projectStatus === 'in-progress'
                  ? 'bg-amber-500 text-white'
                  : 'bg-blue-500 text-white',
            )}
          >
            {statusLabel}
          </span>
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 z-10">
        {/* Sector + Location */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
          {project.sector && (
            <span>{sectorLabels[project.sector] || project.sector}</span>
          )}
          {project.sector && project.location && <span>·</span>}
          {project.location && <span>{project.location}</span>}
        </div>

        {/* Title */}
        <h3
          className={cn(
            'font-bold text-white leading-tight',
            large ? 'text-xl md:text-2xl' : 'text-base md:text-lg',
          )}
        >
          {project.title}
        </h3>

        {/* Summary — only on large card */}
        {large && project.summary && (
          <p className="text-sm text-white/60 mt-1.5 line-clamp-2">{project.summary}</p>
        )}

        {/* View project link */}
        <div className="flex items-center text-sm font-medium text-hydroera-blue mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>View Project</span>
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
        </div>
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
  const [first, ...rest] = projects

  return (
    <section className="bg-hydroera-slate-dark text-white py-16 md:py-20 rounded-2xl">
      <div className="container">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-xl">
            {eyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-hydroera-blue mb-2">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {heading}
            </h2>
            {description && (
              <p className="mt-3 text-white/60 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* View all link — desktop */}
          {enableViewAll && viewAllLink && (
            <div className="hidden md:block shrink-0">
              <CMSLink
                {...viewAllLink}
                appearance="default"
                size="default"
              />
            </div>
          )}
        </div>

        {/* Bento grid */}
        {projects.length === 1 ? (
          <BentoCard project={first} large />
        ) : projects.length === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BentoCard project={first} large />
            <BentoCard project={rest[0]} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left — large card */}
            <BentoCard project={first} large />

            {/* Right — stacked cards */}
            <div className="grid grid-rows-2 gap-4">
              {rest.slice(0, 2).map((project, i) => (
                <BentoCard key={project.id || i} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Extra projects beyond 3 — standard row */}
        {rest.length > 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {rest.slice(2).map((project, i) => (
              <BentoCard key={project.id || i} project={project} />
            ))}
          </div>
        )}

        {/* View all link — mobile */}
        {enableViewAll && viewAllLink && (
          <div className="md:hidden mt-8 text-center">
            <CMSLink
              {...viewAllLink}
              appearance="default"
              size="default"
            />
          </div>
        )}
      </div>
    </section>
  )
}
