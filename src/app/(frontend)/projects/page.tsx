import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Where } from 'payload'

import { Media } from '@/components/Media'
import { ProjectsFilter } from '@/components/ProjectsFilter'
import { FeaturedProjectsSlider } from '@/components/FeaturedProjectsSlider'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'

type Args = {
  searchParams: Promise<{ q?: string; sector?: string; year?: string; status?: string }>
}

export default async function ProjectsPage({ searchParams: searchParamsPromise }: Args) {
  const searchParams = await searchParamsPromise
  const query = searchParams.q || ''
  const sectorFilter = searchParams.sector || ''
  const yearFilter = searchParams.year || ''
  const statusFilter = searchParams.status || ''

  const payload = await getPayload({ config: configPromise })

  // Fetch featured projects for the slider
  const featuredResult = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 6,
    overrideAccess: false,
    where: { featured: { equals: true }, _status: { equals: 'published' } },
    sort: '-completionYear',
    depth: 1,
  })

  // Build where clause for the main listing
  const where: Where = { _status: { equals: 'published' } }
  const andConditions: Where[] = []

  if (query) {
    andConditions.push({ title: { like: query } })
  }
  if (sectorFilter) {
    andConditions.push({ sector: { equals: sectorFilter } })
  }
  if (yearFilter) {
    andConditions.push({ completionYear: { equals: Number(yearFilter) } })
  }
  if (statusFilter) {
    andConditions.push({ projectStatus: { equals: statusFilter } })
  }

  if (andConditions.length > 0) {
    where.and = andConditions
  }

  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 50,
    overrideAccess: false,
    sort: '-completionYear',
    depth: 1,
    where,
  })

  const hasFilters = !!(query || sectorFilter || yearFilter || statusFilter)

  const statusColors: Record<string, string> = {
    completed: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    upcoming: 'bg-blue-400',
  }

  return (
    <>
      {/* Featured projects slideshow */}
      {featuredResult.docs.length > 0 && (
        <FeaturedProjectsSlider projects={featuredResult.docs} />
      )}

      {/* Filter bar */}
      <Suspense fallback={null}>
        <ProjectsFilter />
      </Suspense>

      {/* Project listing grid */}
      <Section background="white" spacing="lg">
        <Container>
          {projects.docs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {projects.docs.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group block no-underline"
                >
                  {/* Image */}
                  {project.featuredImage &&
                    typeof project.featuredImage === 'object' && (
                      <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted">
                        <Media
                          resource={project.featuredImage}
                          fill
                          imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Status badge */}
                        {project.projectStatus && (
                          <span
                            className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1.5 rounded-md ${statusColors[project.projectStatus] || 'bg-gray-500'}`}
                          >
                            {project.projectStatus === 'in-progress'
                              ? 'In Progress'
                              : project.projectStatus.charAt(0).toUpperCase() +
                                project.projectStatus.slice(1)}
                          </span>
                        )}
                      </div>
                    )}

                  {/* Metadata row */}
                  <div className="flex items-center gap-2 mt-4 text-sm">
                    {project.sector && (
                      <span className="text-hydroera-blue font-medium capitalize">
                        {project.sector}
                      </span>
                    )}
                    {project.location && (
                      <>
                        <span className="text-muted-foreground">—</span>
                        <span className="text-muted-foreground">{project.location}</span>
                      </>
                    )}
                    {project.completionYear && (
                      <>
                        <span className="text-muted-foreground">—</span>
                        <span className="text-muted-foreground">{project.completionYear}</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-2 text-lg font-bold text-foreground group-hover:text-hydroera-blue transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  {project.summary && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.summary}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No projects found{query ? ` for "${query}"` : ''}.
              </p>
              {hasFilters && (
                <Link
                  href="/projects"
                  className="inline-block mt-4 text-sm font-medium text-hydroera-blue hover:underline"
                >
                  Clear all filters
                </Link>
              )}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Projects | HydroEra',
    description:
      "Explore HydroEra's portfolio of 500+ pump system installations across Malaysia.",
  }
}
