// collections/Products/hooks/revalidateProducts.ts
import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Product } from '../../../payload-types'

export const revalidateProduct: CollectionAfterChangeHook<Product> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { payload, context } = req
  if (!context.disableRevalidate) {
    
    // 1. Revalidate the Product Detail Page if published
    if (doc._status === 'published') {
      const path = `/products/${doc.slug}`
      payload.logger.info(`Revalidating product: ${path}`)
      revalidatePath(path)
      revalidateTag('products-sitemap', 'max')
    }

    // 2. Handle Category Page Revalidation
    // We use a Set to avoid duplicate revalidation calls
    const pathsToRevalidate = new Set<string>()

    // Revalidate current category
    if (doc.category) {
      const categoryID = typeof doc.category === 'object' ? doc.category.id : doc.category
      const categoryDoc = await payload.findByID({
        collection: 'categories',
        id: categoryID,
        req,
      })
      if (categoryDoc?.slug) {
        pathsToRevalidate.add(`/categories/${categoryDoc.slug}`)
      }
    }

    // Revalidate previous category (in case the product moved categories)
    if (previousDoc?.category) {
      const prevCategoryID = typeof previousDoc.category === 'object' ? previousDoc.category.id : previousDoc.category
      if (prevCategoryID !== (typeof doc.category === 'object' ? doc.category.id : doc.category)) {
        const prevCategoryDoc = await payload.findByID({
          collection: 'categories',
          id: prevCategoryID,
          req,
        })
        if (prevCategoryDoc?.slug) {
          pathsToRevalidate.add(`/categories/${prevCategoryDoc.slug}`)
        }
      }
    }

    // Execute category revalidations
    pathsToRevalidate.forEach((path) => {
      payload.logger.info(`Revalidating linked category: ${path}`)
      revalidatePath(path)
    })

    // 3. Handle Unpublishing (Clean up the old live page)
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/products/${previousDoc.slug}`
      payload.logger.info(`Product unpublished. Cleaning up: ${oldPath}`)
      revalidatePath(oldPath)
    }
  }

  return doc
}