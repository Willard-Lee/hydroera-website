import type { Project, ProjectsShowcaseBlock as ProjectsShowcaseBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ProjectsShowcaseClient } from './Client'

export const ProjectsShowcaseBlock: React.FC<
  ProjectsShowcaseBlockProps & { id?: string }
> = async (props) => {
  const {
    id,
    eyebrow,
    heading,
    description,
    populateBy,
    onlyFeatured,
    limit: limitFromProps,
    selectedDocs,
    enableViewAll,
    viewAllLink,
  } = props

  const limit = limitFromProps || 3
  let projects: Project[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const fetchedProjects = await payload.find({
      collection: 'projects',
      depth: 1,
      limit,
      sort: '-publishedAt',
      where: {
        _status: { equals: 'published' },
        ...(onlyFeatured ? { featured: { equals: true } } : {}),
      },
    })

    projects = fetchedProjects.docs
  } else {
    if (selectedDocs?.length) {
      projects = selectedDocs
        .map((doc) => (typeof doc === 'object' ? doc : null))
        .filter(Boolean) as Project[]
    }
  }

  if (projects.length === 0) return null

  return (
    <div className="my-16" id={id ? `block-${id}` : undefined}>
      <ProjectsShowcaseClient
        projects={projects}
        eyebrow={eyebrow}
        heading={heading}
        description={description}
        enableViewAll={enableViewAll ?? true}
        viewAllLink={viewAllLink}
      />
    </div>
  )
}