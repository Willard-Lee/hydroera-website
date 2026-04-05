import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Project } from '../../../payload-types'

// ── afterChange hook ──────────────────────────────────────────────────────────
// Runs every time a project is saved in the admin (create, update, publish,
// unpublish). Tells Next.js which cached pages to throw away and rebuild.
export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,          // the document as it looks NOW after saving
  previousDoc,  // what the document looked like BEFORE saving
  req: { payload, context },
}) => {

  // Skip revalidation during internal operations like seeding.
  // The seed script passes context: { disableRevalidate: true } to avoid
  // triggering hundreds of rebuilds during a bulk insert.
  if (!context.disableRevalidate) {

    // Case 1 — project was just published or updated while published.
    // Rebuild the detail page and the listing page.
    if (doc._status === 'published') {
      const path = `/projects/${doc.slug}`

      payload.logger.info(`Revalidating project at path: ${path}`)

      revalidatePath(path)        // rebuilds /projects/my-project
      revalidatePath('/projects') // rebuilds the /projects listing page
      revalidateTag('projects-sitemap', 'max') // rebuilds the XML sitemap
    }

    // Case 2 — project was previously published but is now unpublished/drafted.
    // The old cached page is still live — we need to clear it so it 404s.
    // We use previousDoc here because doc already reflects the new draft state.
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/projects/${previousDoc.slug}`

      payload.logger.info(`Revalidating old project at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/projects')
      revalidateTag('projects-sitemap', 'max')
    }

  }

  // Always return doc from afterChange hooks
  return doc
}

// ── afterDelete hook ──────────────────────────────────────────────────────────
// Runs when a project is permanently deleted from the admin.
// Clears the cached detail page so it 404s immediately.
export const revalidateDelete: CollectionAfterDeleteHook<Project> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/projects/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/projects')
    revalidateTag('projects-sitemap', 'max')
  }

  return doc
}