import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return projects.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const project = await queryProjectBySlug({ slug: decodeURIComponent(slug) })

  if (!project) return notFound()

  return (
    <article className="pb-24">
      {draft && <LivePreviewListener />}

      {/* Hero section with featured image */}
      <div className="relative min-h-[40vh] flex items-end text-white">
        {project.featuredImage && typeof project.featuredImage === 'object' && (
          <Media
            resource={project.featuredImage}
            fill
            imgClassName="object-cover -z-20"
            priority
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="container relative z-10 pb-10 pt-32">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-white">{project.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {project.sector && (
              <span className="bg-hydroera-blue text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {project.sector}
              </span>
            )}
            {project.projectStatus && (
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {project.projectStatus}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {project.title}
          </h1>
          {project.location && (
            <p className="mt-2 text-lg text-white/70">{project.location}</p>
          )}
        </div>
      </div>

      <div className="container mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Summary */}
            {project.summary && (
              <p className="text-lg text-muted-foreground leading-relaxed">{project.summary}</p>
            )}

            {/* Challenge */}
            {project.challenge && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">The Challenge</h2>
                <RichText data={project.challenge} enableGutter={false} />
              </div>
            )}

            {/* Solution */}
            {project.solution && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">The Solution</h2>
                <RichText data={project.solution} enableGutter={false} />
              </div>
            )}

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Project Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((item, i) => (
                    <div key={item.id || i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                      {item.image && typeof item.image === 'object' && (
                        <Media resource={item.image} fill imgClassName="object-cover" />
                      )}
                      {item.caption && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 px-3 py-2">
                          <p className="text-xs text-white">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key outcomes */}
            {project.outcomes && project.outcomes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Key Outcomes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.outcomes.map((outcome, i) => (
                    <div key={outcome.id || i} className="bg-card border border-border rounded-lg p-4">
                      <p className="text-sm font-medium text-foreground">{outcome.metric}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial */}
            {project.testimonial?.quote && (
              <blockquote className="border-l-4 border-hydroera-blue pl-6 py-2">
                <p className="text-lg italic text-muted-foreground">&ldquo;{project.testimonial.quote}&rdquo;</p>
                {(project.testimonial.authorName || project.testimonial.authorRole) && (
                  <footer className="mt-3 text-sm text-foreground font-medium">
                    {project.testimonial.authorName}
                    {project.testimonial.authorRole && (
                      <span className="text-muted-foreground font-normal"> — {project.testimonial.authorRole}</span>
                    )}
                  </footer>
                )}
              </blockquote>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Project details card */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Project Details</h3>
              <dl className="space-y-3 text-sm">
                {project.client && (
                  <div>
                    <dt className="text-muted-foreground">Client</dt>
                    <dd className="font-medium text-foreground">{project.client}</dd>
                  </div>
                )}
                {project.location && (
                  <div>
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="font-medium text-foreground">{project.location}</dd>
                  </div>
                )}
                {project.completionYear && (
                  <div>
                    <dt className="text-muted-foreground">Year</dt>
                    <dd className="font-medium text-foreground">{project.completionYear}</dd>
                  </div>
                )}
                {project.projectValue && (
                  <div>
                    <dt className="text-muted-foreground">Value</dt>
                    <dd className="font-medium text-foreground">{project.projectValue}</dd>
                  </div>
                )}
                {project.duration && (
                  <div>
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="font-medium text-foreground">{project.duration}</dd>
                  </div>
                )}
                {project.teamSize && (
                  <div>
                    <dt className="text-muted-foreground">Team Size</dt>
                    <dd className="font-medium text-foreground">{project.teamSize}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Scope of work */}
            {project.scope && project.scope.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Scope of Work</h3>
                <ul className="space-y-2">
                  {project.scope.map((item, i) => (
                    <li key={item.id || i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-hydroera-blue mt-0.5">•</span>
                      {item.item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Products used */}
            {project.productsUsed && Array.isArray(project.productsUsed) && project.productsUsed.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Products Used</h3>
                <ul className="space-y-2">
                  {project.productsUsed.map((product) => {
                    if (typeof product !== 'object') return null
                    return (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-sm text-hydroera-blue hover:underline"
                        >
                          {product.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-hydroera-blue/5 border border-hydroera-blue/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Have a Similar Project?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Let our engineering team design the right solution for you.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-hydroera-blue text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-hydroera-blue/90 transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const project = await queryProjectBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: project })
}

const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
