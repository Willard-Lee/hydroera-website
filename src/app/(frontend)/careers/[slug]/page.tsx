import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import RichText from '@/components/RichText'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const careers = await payload.find({
    collection: 'careers',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return careers.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

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

export default async function CareerDetailPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const job = await queryCareerBySlug({ slug: decodeURIComponent(slug) })

  if (!job) return notFound()

  const payload = await getPayload({ config: configPromise })

  // Fetch related open positions in same department
  const related = await payload.find({
    collection: 'careers',
    draft: false,
    limit: 3,
    overrideAccess: false,
    where: {
      and: [
        { department: { equals: job.department } },
        { id: { not_equals: job.id } },
        { isOpen: { equals: true } },
        { _status: { equals: 'published' } },
      ],
    },
  })

  return (
    <article className="pb-24">
      {draft && <LivePreviewListener />}

      {/* Header */}
      <div className="bg-gradient-to-r from-hydroera-dark-from via-hydroera-dark-via to-hydroera-dark-to text-white" data-theme="dark">
        <div className="container pt-32 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
            <span>/</span>
            <span className="text-white/80">{job.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {job.department && (
              <span className="inline-block text-xs font-semibold text-white bg-hydroera-blue px-3 py-1 rounded-full">
                {deptLabels[job.department] || job.department}
              </span>
            )}
            {job.employmentType && (
              <span className="inline-block text-xs font-semibold text-white/80 bg-white/10 px-3 py-1 rounded-full">
                {typeLabels[job.employmentType] || job.employmentType}
              </span>
            )}
            {!job.isOpen && (
              <span className="inline-block text-xs font-semibold text-red-300 bg-red-500/20 px-3 py-1 rounded-full">
                Position Closed
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/60">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {job.location}
              </span>
            )}
            {job.experienceLevel && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {job.experienceLevel}
              </span>
            )}
            {(job.salaryRange) && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {job.salaryRange}
              </span>
            )}
          </div>
        </div>
      </div>

      <Section background="white" spacing="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Role summary */}
              {job.excerpt && (
                <div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{job.excerpt}</p>
                </div>
              )}

              {/* Full description */}
              {job.description && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">About the Role</h2>
                  <RichText data={job.description} enableGutter={false} />
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">Responsibilities</h2>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((item, i) => (
                      <li key={item.id || i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <svg className="h-5 w-5 text-hydroera-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        {item.item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">Requirements</h2>
                  <ul className="space-y-2.5">
                    {job.requirements.map((item, i) => (
                      <li key={item.id || i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <svg className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M5 12h14" strokeLinecap="round" />
                        </svg>
                        {item.item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nice to have */}
              {job.niceToHave && job.niceToHave.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">Nice to Have</h2>
                  <ul className="space-y-2.5">
                    {job.niceToHave.map((item, i) => (
                      <li key={item.id || i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                        {item.item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">What We Offer</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.benefits.map((item, i) => (
                      <div
                        key={item.id || i}
                        className="flex items-start gap-3 bg-muted/30 rounded-lg p-4"
                      >
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm text-foreground">{item.benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Apply CTA */}
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {job.isOpen ? 'Interested in this role?' : 'This position has been filled'}
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {job.isOpen
                    ? 'Send us your resume and we\'ll get back to you within 3 working days.'
                    : 'Check our other open positions below.'}
                </p>
                {job.isOpen && (
                  <Link
                    href="/contact"
                    className="block w-full text-center bg-hydroera-blue text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-hydroera-blue/90 transition-colors"
                  >
                    Apply Now
                  </Link>
                )}
                <Link
                  href="/careers"
                  className="block w-full text-center border border-border text-foreground text-sm font-semibold px-6 py-3 rounded-md hover:bg-muted transition-colors mt-3"
                >
                  View All Positions
                </Link>
              </div>

              {/* Job details card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Job Details</h3>
                <dl className="space-y-3 text-sm">
                  {job.department && (
                    <div>
                      <dt className="text-muted-foreground">Department</dt>
                      <dd className="font-medium text-foreground">{deptLabels[job.department] || job.department}</dd>
                    </div>
                  )}
                  {job.location && (
                    <div>
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="font-medium text-foreground">{job.location}</dd>
                    </div>
                  )}
                  {job.employmentType && (
                    <div>
                      <dt className="text-muted-foreground">Employment Type</dt>
                      <dd className="font-medium text-foreground">{typeLabels[job.employmentType] || job.employmentType}</dd>
                    </div>
                  )}
                  {job.experienceLevel && (
                    <div>
                      <dt className="text-muted-foreground">Experience</dt>
                      <dd className="font-medium text-foreground">{job.experienceLevel}</dd>
                    </div>
                  )}
                  {job.salaryRange && (
                    <div>
                      <dt className="text-muted-foreground">Salary</dt>
                      <dd className="font-medium text-foreground">{job.salaryRange}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Related positions */}
      {related.docs.length > 0 && (
        <Section background="grey" spacing="md">
          <Container>
            <h2 className="text-2xl font-bold text-foreground mb-6">Other Positions in {deptLabels[job.department] || job.department}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.docs.map((relatedJob) => (
                <Link
                  key={relatedJob.id}
                  href={`/careers/${relatedJob.slug}`}
                  className="group block no-underline"
                >
                  <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-hydroera-blue/30 hover:shadow-lg hover:-translate-y-0.5">
                    <h3 className="text-base font-bold text-foreground group-hover:text-hydroera-blue transition-colors">
                      {relatedJob.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {relatedJob.location && (
                        <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                          {relatedJob.location}
                        </span>
                      )}
                      {relatedJob.employmentType && (
                        <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                          {typeLabels[relatedJob.employmentType] || relatedJob.employmentType}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const job = await queryCareerBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: job })
}

const queryCareerBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'careers',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
