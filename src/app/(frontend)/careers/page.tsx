import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { Suspense, cache } from 'react'
import Link from 'next/link'
import type { Where } from 'payload'

import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { CareersFilter } from '@/components/CareersFilter'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { generateMeta } from '@/utilities/generateMeta'

type Args = {
  searchParams: Promise<{ q?: string; department?: string; type?: string }>
}

const deptLabels: Record<string, string> = {
  engineering: 'Engineering',
  sales: 'Sales',
  service: 'Service & Maintenance',
  operations: 'Operations',
  rd: 'R&D',
  qa: 'Quality Assurance',
  administration: 'Administration',
}

const typeLabels: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
}

// Query the "careers" page from Pages collection for hero + layout blocks
const queryCareersPage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: 'careers' } },
  })

  return result.docs?.[0] || null
})

export default async function CareersPage({ searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const searchParams = await searchParamsPromise
  const query = searchParams.q || ''
  const deptFilter = searchParams.department || ''
  const typeFilter = searchParams.type || ''

  const payload = await getPayload({ config: configPromise })

  // Fetch CMS page + jobs in parallel
  const [page, jobsResult] = await Promise.all([
    queryCareersPage(),
    (async () => {
      const where: Where = {
        _status: { equals: 'published' },
        isOpen: { equals: true },
      }
      const andConditions: Where[] = []

      if (query) {
        andConditions.push({ title: { like: query } })
      }
      if (deptFilter) {
        andConditions.push({ department: { equals: deptFilter } })
      }
      if (typeFilter) {
        andConditions.push({ employmentType: { equals: typeFilter } })
      }

      if (andConditions.length > 0) {
        where.and = andConditions
      }

      return payload.find({
        collection: 'careers',
        draft: false,
        limit: 50,
        overrideAccess: false,
        sort: '-featured,-publishedAt',
        where,
      })
    })(),
  ])

  const hasFilters = !!(query || deptFilter || typeFilter)

  return (
    <>
      {draft && <LivePreviewListener />}

      {/* CMS Hero */}
      {page?.hero && <RenderHero {...page.hero} />}

      {/* CMS layout blocks — "Why Work at HydroEra?" etc. */}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      {/* Filter bar */}
      <Suspense fallback={null}>
        <CareersFilter totalResults={jobsResult.totalDocs} />
      </Suspense>

      {/* Open positions */}
      <Section background="white" spacing="lg">
        <Container>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Open Positions</h2>
            <p className="mt-2 text-muted-foreground">
              Join our team and help build Malaysia&apos;s water infrastructure.
            </p>
          </div>

          {jobsResult.docs.length > 0 ? (
            <div className="space-y-4">
              {jobsResult.docs.map((job) => (
                <Link
                  key={job.id}
                  href={`/careers/${job.slug}`}
                  className="group block no-underline"
                >
                  <div
                    className={`bg-card rounded-xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                      job.featured
                        ? 'border-hydroera-blue/30 ring-1 ring-hydroera-blue/10'
                        : 'border-border hover:border-hydroera-blue/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Left: title + meta */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {job.featured && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Featured
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-foreground group-hover:text-hydroera-blue transition-colors truncate">
                            {job.title}
                          </h3>
                        </div>

                        {job.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {job.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Right: badges + arrow */}
                      <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
                        {job.department && (
                          <span className="inline-block text-xs font-medium text-hydroera-blue bg-hydroera-blue/8 px-2.5 py-1 rounded-full">
                            {deptLabels[job.department] || job.department}
                          </span>
                        )}
                        {job.location && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {job.location}
                          </span>
                        )}
                        {job.employmentType && (
                          <span className="inline-block text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                            {typeLabels[job.employmentType] || job.employmentType}
                          </span>
                        )}
                        {job.experienceLevel && (
                          <span className="inline-block text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                            {job.experienceLevel}
                          </span>
                        )}

                        <svg
                          className="h-5 w-5 text-muted-foreground group-hover:text-hydroera-blue transition-colors ml-2 hidden sm:block"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-xl">
              <svg className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-lg font-medium text-foreground mb-1">No open positions</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {hasFilters
                  ? 'No positions match your current filters.'
                  : "We don't have any open positions right now, but check back soon."}
              </p>
              {hasFilters && (
                <Link
                  href="/careers"
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

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryCareersPage()
  if (page) return generateMeta({ doc: page })
  return {
    title: 'Careers | HydroEra',
    description: "Join HydroEra — explore open positions in engineering, sales, service, and more.",
  }
}
