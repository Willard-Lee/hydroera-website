import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Testimonial } from '../../../payload-types'

export const revalidateTestimonial: CollectionAfterChangeHook<Testimonial> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating testimonial: ${doc.authorName}`)

      // Testimonials appear on pages via the testimonials block,
      // so revalidate the home page and any page that might embed them.
      revalidatePath('/')
      revalidatePath('/about')
      revalidateTag('pages-sitemap', 'max')
    }

    // If the testimonial was previously published and is now unpublished
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      payload.logger.info(`Revalidating unpublished testimonial: ${doc.authorName}`)

      revalidatePath('/')
      revalidatePath('/about')
      revalidateTag('pages-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDeleteTestimonial: CollectionAfterDeleteHook<Testimonial> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
    revalidatePath('/about')
    revalidateTag('pages-sitemap', 'max')
  }

  return doc
}