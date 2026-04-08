import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ProjectsPage() {
  const payload = await getPayload({ config: configPromise })

  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 50,
    overrideAccess: false,
    sort: '-completionYear',
  })

  return (
    <article className="pt-16 pb-24">
      <div className="container">
        {/* Page header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            500+ successful installations across Malaysia — from semiconductor-grade treatment
            systems to large-scale municipal infrastructure.
          </p>
        </div>

        {/* Projects grid */}
        {projects.docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.docs.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block no-underline"
              >
                <div className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-hydroera-blue/30 hover:shadow-lg hover:-translate-y-0.5">
                  {/* Featured image */}
                  {project.featuredImage && typeof project.featuredImage === 'object' && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Media
                        resource={project.featuredImage}
                        fill
                        imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Sector badge */}
                      {project.sector && (
                        <span className="absolute top-3 left-3 bg-hydroera-blue/90 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                          {project.sector}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-hydroera-blue transition-colors">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="mt-1 text-sm text-muted-foreground">{project.location}</p>
                    )}
                    {project.summary && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {project.summary}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      {project.completionYear && <span>{project.completionYear}</span>}
                      {project.projectStatus && (
                        <span className="capitalize">{project.projectStatus}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No projects to show yet.</p>
        )}
      </div>
    </article>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Projects | HydroEra',
    description:
      "Explore HydroEra's portfolio of 500+ pump system installations across Malaysia.",
  }
}
