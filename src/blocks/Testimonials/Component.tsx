import type { Testimonial } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { TestimonialsClient } from './Client'

type TestimonialsBlockProps = {
  heading?: string | null
  subheading?: string | null
  layout?: 'carousel' | 'grid' | 'featured' | null
  populateBy?: 'collection' | 'selection' | null
  onlyFeatured?: boolean | null
  limit?: number | null
  selectedDocs?: (number | Testimonial | null)[] | null
  showCompletionLetters?: boolean | null
  showRating?: boolean | null
  showCompanyLogo?: boolean | null
}

export const TestimonialsBlock: React.FC<
  TestimonialsBlockProps & { id?: string }
> = async (props) => {
  const {
    id,
    heading,
    subheading,
    layout,
    populateBy,
    onlyFeatured,
    limit: limitFromProps,
    selectedDocs,
    showCompletionLetters,
    showRating,
    showCompanyLogo,
  } = props

  const limit = limitFromProps || 6
  let testimonials: Testimonial[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const fetchedTestimonials = await payload.find({
      collection: 'testimonials',
      depth: 2,
      limit,
      sort: '-publishedAt',
      where: {
        _status: { equals: 'published' },
        ...(onlyFeatured ? { featured: { equals: true } } : {}),
      },
    })

    testimonials = fetchedTestimonials.docs
  } else if (selectedDocs?.length) {
    testimonials = selectedDocs
      .map((doc) => (typeof doc === 'object' && doc ? doc : null))
      .filter(Boolean) as Testimonial[]
  }

  if (testimonials.length === 0) return null

  return (
    <div className="my-16" id={id ? `block-${id}` : undefined}>
      <TestimonialsClient
        testimonials={testimonials}
        layout={layout || 'carousel'}
        heading={heading}
        subheading={subheading}
        showRating={showRating ?? true}
        showCompanyLogo={showCompanyLogo ?? true}
        showCompletionLetters={showCompletionLetters ?? false}
      />
    </div>
  )
}
