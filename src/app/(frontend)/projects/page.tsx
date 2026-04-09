import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Where } from 'payload'

import { Media } from '@/components/Media'
import { PageHero } from '@/components/PageHero'
import { ProjectsFilter } from '@/components/ProjectsFilter'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'

type Args = {
  searchParams: Promise<{ q?: string; sector?: string }>
}

export default async function ProjectsPage({ searchParams: searchParamsPromise }: Args) {
  const searchParams = await searchParamsPromise
  const query = searchParams.q || ''
  const sectorFilter = searchParams.sector || ''

  const payload = await getPayload({ config: configPromise })

  // Build where clause
  const where: Where = { _status: { equals: 'published' } }
  const andConditions: Where[] = []

  if (query) {
    andConditions.push({ title: { like: query } })
  }

  if (sectorFilter) {
    andConditions.push({ sector: { equals: sectorFilter } })
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

  // Separate featured projects to show first
  const featured = projects.docs.filter((p) => p.featured)
  const regular = projects.docs.filter((p) => !p.featured)
  const orderedProjects = [...featured, ...regular]

  return (
    <>
      <PageHero
        eyebrow="OUR PROJECTS"
        heading="Engineering Excellence in Action"
        description="500+ successful installations across Malaysia — from semiconductor-grade treatment systems to large-scale municipal infrastructure."
      />

      <Suspense fallback={null}>
        <ProjectsFilter totalResults={projects.totalDocs} />
      </Suspense>

      <Section background="white" spacing="lg">
        <Container>
          {orderedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {orderedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group block no-underline"
                >
                  <div
                    className={`bg-card rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      project.featured
                        ? 'border-hydroera-blue/30 ring-1 ring-hydroera-blue/10'
                        : 'border-border hover:border-hydroera-blue/30'
                    }`}
                  >
                    {/* Featured image with sector overlay */}
                    {project.featuredImage &&
                      typeof project.featuredImage === 'object' && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Media
                            resource={project.featuredImage}
                            fill
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            {project.sector && (
                              <span className="bg-hydroera-blue/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                                {project.sector}
                              </span>
                            )}
                            {project.featured && (
                              <span className="bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>

                          {/* Status badge */}
                          {project.projectStatus && project.projectStatus !== 'completed' && (
                            <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                              {project.projectStatus}
                            </span>
                          )}

                          {/* Bottom metadata on image */}
                          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white/80 text-sm">
                            {project.location && (
                              <span className="flex items-center gap-1.5">
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {project.location}
                              </span>
                            )}
                            {project.completionYear && (
                              <span className="ml-auto font-medium">{project.completionYear}</span>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Card body */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-hydroera-blue transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      {project.summary && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {project.summary}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-hydroera-blue">
                        View Case Study
                        <svg
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No projects found{query ? ` for "${query}"` : ''}.
              </p>
              {(query || sectorFilter) && (
                <Link
                  href="/projects"
                  className="inline-block mt-4 text-sm font-medium text-hydroera-blue hover:underline"
                >
                  Clear filters
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
