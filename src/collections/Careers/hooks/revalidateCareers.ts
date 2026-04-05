import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Career } from '../../../payload-types'

// ── afterChange hook ──────────────────────────────────────────────────────────
// Runs every time a job listing is saved in the admin.
// Rebuilds the cached careers page so open/closed status
// and new listings appear immediately on the frontend.
export const revalidateCareer: CollectionAfterChangeHook<Career> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {

    // Case 1 — job is published or updated while published
    if (doc._status === 'published') {
      const path = `/careers/${doc.slug}`

      payload.logger.info(`Revalidating career at path: ${path}`)

      revalidatePath(path)      // rebuilds the individual job detail page
      revalidatePath('/careers') // rebuilds the careers listing page
      revalidateTag('careers-sitemap', 'max')
    }

    // Case 2 — job was published but is now unpublished or drafted
    // Clear the old cached page so it 404s correctly
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/careers/${previousDoc.slug}`

      payload.logger.info(`Revalidating old career at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/careers')
      revalidateTag('careers-sitemap','max')
    }

  }

  return doc
}

// ── afterDelete hook ──────────────────────────────────────────────────────────
// Runs when a job listing is permanently deleted.
// Clears the cached page so it 404s immediately.
export const revalidateDelete: CollectionAfterDeleteHook<Career> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/careers/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/careers')
    revalidateTag('careers-sitemap','max')
  }

  return doc
}