import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { Suspense, cache } from 'react'
import Link from 'next/link'
import type { Where } from 'payload'

import { Media } from '@/components/Media'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProjectsSidebar } from '@/components/ProjectsSidebar'
import { FeaturedProjectsSlider } from '@/components/FeaturedProjectsSlider'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'

type Args = {
  searchParams: Promise<{ q?: string; sector?: string; yearMin?: string; yearMax?: string; status?: string }>
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-500',
  'in-progress': 'bg-yellow-500',
  upcoming: 'bg-blue-400',
}

const statusBarColors: Record<string, string> = {
  completed: 'bg-green-500',
  'in-progress': 'bg-yellow-500',
  upcoming: 'bg-blue-400',
}

const formatStatus = (status: string) => {
  if (status === 'in-progress') return 'In Progress'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Query the "projects" page from the Pages collection for the hero
const queryProjectsPage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: 'projects' } },
  })

  return result.docs?.[0] || null
})

export default async function ProjectsPage({ searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const searchParams = await searchParamsPromise
  const query = searchParams.q || ''
  const sectorFilter = searchParams.sector || ''
  const yearMinFilter = searchParams.yearMin || ''
  const yearMaxFilter = searchParams.yearMax || ''
  const statusFilter = searchParams.status || ''

  const payload = await getPayload({ config: configPromise })

  // Fetch CMS page (for hero) + featured + ongoing in parallel
  const [page, featuredResult, ongoingResult] = await Promise.all([
    queryProjectsPage(),
    payload.find({
      collection: 'projects',
      draft: false,
      limit: 6,
      overrideAccess: false,
      where: { featured: { equals: true }, _status: { equals: 'published' } },
      sort: '-completionYear',
      depth: 2,
    }),
    payload.find({
      collection: 'projects',
      draft: false,
      limit: 6,
      overrideAccess: false,
      where: { projectStatus: { equals: 'in-progress' }, _status: { equals: 'published' } },
      sort: '-updatedAt',
      depth: 1,
    }),
  ])

  // Build where clause for the main listing
  const where: Where = { _status: { equals: 'published' } }
  const andConditions: Where[] = []

  if (query) {
    andConditions.push({ title: { like: query } })
  }
  if (sectorFilter) {
    andConditions.push({ sector: { equals: sectorFilter } })
  }
  if (yearMinFilter) {
    andConditions.push({ completionYear: { greater_than_equal: Number(yearMinFilter) } })
  }
  if (yearMaxFilter) {
    andConditions.push({ completionYear: { less_than_equal: Number(yearMaxFilter) } })
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

  // Get all distinct years from projects for the year slider
  const allProjects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 0,
    overrideAccess: false,
    where: { _status: { equals: 'published' } },
    select: { completionYear: true },
    pagination: false,
  })

  const projectYears = [
    ...new Set(
      allProjects.docs
        .map((p) => p.completionYear)
        .filter((y): y is number => typeof y === 'number' && y > 0),
    ),
  ].sort((a, b) => a - b)

  const hasFilters = !!(query || sectorFilter || yearMinFilter || yearMaxFilter || statusFilter)

  return (
    <>
      {draft && <LivePreviewListener />}

      {/* CMS Hero — editable from admin panel (Pages → "projects") */}
      {page?.hero && <RenderHero {...page.hero} />}

      {/* Featured projects slideshow */}
      {featuredResult.docs.length > 0 && (
        <FeaturedProjectsSlider projects={featuredResult.docs} />
      )}

      {/* Ongoing projects section */}
      {ongoingResult.docs.length > 0 && (
        <Section background="white" spacing="md">
          <Container>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="inline-block text-sm font-semibold uppercase tracking-widest text-hydroera-blue mb-2">
                  Currently Underway
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Ongoing Projects
                </h2>
              </div>
              <Link
                href="/projects?status=in-progress"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-hydroera-blue hover:underline"
              >
                View all ongoing
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingResult.docs.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group block no-underline"
                >
                  <div className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-hydroera-blue/30 hover:shadow-lg hover:-translate-y-1">
                    {project.featuredImage &&
                      typeof project.featuredImage === 'object' && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Media
                            resource={project.featuredImage}
                            fill
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-2 bg-yellow-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                            </span>
                            In Progress
                          </div>
                        </div>
                      )}

                    {/* Status bar */}
                    <div className="h-1 w-full bg-yellow-500" />

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        {project.sector && (
                          <span className="text-hydroera-blue font-medium capitalize">{project.sector}</span>
                        )}
                        {project.location && (
                          <>
                            <span>—</span>
                            <span>{project.location}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-hydroera-blue transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      {project.summary && (
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                          {project.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Main content: sidebar + project grid */}
      <Section background="white" spacing="lg">
        <Container size="wide">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left sidebar — search, sector, year, status filters */}
            <aside className="w-full lg:w-72 shrink-0">
              <Suspense fallback={null}>
                <ProjectsSidebar totalResults={projects.totalDocs} years={projectYears} />
              </Suspense>
            </aside>

            {/* Right — project grid */}
            <div className="flex-1 min-w-0">
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
                      <div className="relative aspect-[3/2] overflow-hidden rounded-t-lg bg-muted">
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
                            {formatStatus(project.projectStatus)}
                          </span>
                        )}
                      </div>
                    )}

                  {/* Status color bar */}
                  {project.projectStatus && (
                    <div
                      className={`h-1 w-full rounded-b-lg ${statusBarColors[project.projectStatus] || 'bg-gray-400'}`}
                    />
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
            </div>
          </div>
        </Container>
      </Section>

      {/* CMS content blocks — editable from admin panel (Pages → "projects" → Content tab) */}
      {page?.layout && <RenderBlocks blocks={page.layout} />}
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryProjectsPage()
  if (page) return generateMeta({ doc: page })
  return {
    title: 'Projects | HydroEra',
    description:
      "Explore HydroEra's portfolio of 500+ pump system installations across Malaysia.",
  }
}
