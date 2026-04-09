import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Where } from 'payload'

import { Media } from '@/components/Media'
import { PageHero } from '@/components/PageHero'
import { ProductsFilter } from '@/components/ProductsFilter'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'

type Args = {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function ProductsPage({ searchParams: searchParamsPromise }: Args) {
  const searchParams = await searchParamsPromise
  const query = searchParams.q || ''
  const categorySlug = searchParams.category || ''

  const payload = await getPayload({ config: configPromise })

  // Build where clause
  const where: Where = { _status: { equals: 'published' } }
  const andConditions: Where[] = []

  if (query) {
    andConditions.push({ title: { like: query } })
  }

  if (categorySlug) {
    // Find the category by slug, then filter products by that category ID
    const categoryResult = await payload.find({
      collection: 'categories',
      where: { slug: { equals: categorySlug } },
      limit: 1,
    })
    if (categoryResult.docs.length > 0) {
      andConditions.push({ category: { equals: categoryResult.docs[0]!.id } })
    }
  }

  if (andConditions.length > 0) {
    where.and = andConditions
  }

  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 100,
    overrideAccess: false,
    sort: 'title',
    depth: 1,
    where,
  })

  return (
    <>
      <PageHero
        eyebrow="OUR PRODUCTS"
        heading="Industrial Pump Solutions"
        description="Browse our comprehensive range of pumps, systems, and accessories engineered for every application."
      />

      <Suspense fallback={null}>
        <ProductsFilter totalResults={products.totalDocs} />
      </Suspense>

      <Section background="white" spacing="lg">
        <Container>
          {products.docs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.docs.map((product) => {
                const category =
                  product.category && typeof product.category === 'object'
                    ? product.category
                    : null

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group block no-underline"
                  >
                    <div className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-hydroera-blue/30 hover:shadow-lg hover:-translate-y-1">
                      {/* Product image */}
                      {product.featuredImage &&
                        typeof product.featuredImage === 'object' && (
                          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                            <Media
                              resource={product.featuredImage}
                              fill
                              imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}

                      <div className="p-5">
                        {category && (
                          <span className="inline-block text-xs font-semibold text-hydroera-blue bg-hydroera-blue/8 px-2.5 py-1 rounded-full mb-2">
                            {category.title}
                          </span>
                        )}
                        <h3 className="text-base font-semibold text-foreground group-hover:text-hydroera-blue transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                        {product.shortDescription && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {product.shortDescription}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-hydroera-blue opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No products found{query ? ` for "${query}"` : ''}.
              </p>
              {(query || categorySlug) && (
                <Link
                  href="/products"
                  className="inline-block mt-4 text-sm font-medium text-hydroera-blue hover:underline"
                >
                  Clear filters
                </Link>
              )}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Products | HydroEra',
    description:
      "Browse HydroEra's full range of industrial and commercial pump systems, spare parts, and control panels.",
  }
}
