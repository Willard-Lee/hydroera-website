import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { Suspense, cache } from 'react'
import Link from 'next/link'
import type { Where } from 'payload'

import { Media } from '@/components/Media'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProductsSidebar } from '@/components/ProductsSidebar'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'

type Args = {
  searchParams: Promise<{ q?: string; category?: string }>
}

// Query the "products" page from the Pages collection for the hero
const queryProductsPage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: 'products' } },
  })

  return result.docs?.[0] || null
})

export default async function ProductsPage({ searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const searchParams = await searchParamsPromise
  const query = searchParams.q || ''
  const categorySlug = searchParams.category || ''

  const payload = await getPayload({ config: configPromise })

  // Fetch CMS page (for hero) + categories in parallel
  const [page, categoriesResult] = await Promise.all([
    queryProductsPage(),
    payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'title',
      depth: 0,
    }),
  ])

  // Build where clause
  const where: Where = { _status: { equals: 'published' } }
  const andConditions: Where[] = []

  if (query) {
    andConditions.push({ title: { like: query } })
  }

  if (categorySlug) {
    const categoryResult = categoriesResult.docs.find((c) => c.slug === categorySlug)
    if (categoryResult) {
      andConditions.push({ category: { equals: categoryResult.id } })
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

  const categories = categoriesResult.docs.map((c) => ({
    label: c.title,
    value: c.slug || '',
  }))

  const hasFilters = !!(query || categorySlug)

  return (
    <>
      {draft && <LivePreviewListener />}

      {/* CMS Hero — editable from admin panel (Pages → "products") */}
      {page?.hero && <RenderHero {...page.hero} />}

      {/* Main content: sidebar + product grid */}
      <Section background="white" spacing="lg">
        <Container size="wide">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left sidebar — search, category filter */}
            <aside className="w-full lg:w-72 shrink-0">
              <Suspense fallback={null}>
                <ProductsSidebar
                  categories={categories}
                  totalResults={products.totalDocs}
                />
              </Suspense>
            </aside>

            {/* Right — product grid */}
            <div className="flex-1 min-w-0">
              {products.docs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  {hasFilters && (
                    <Link
                      href="/products"
                      className="inline-block mt-4 text-sm font-medium text-hydroera-blue hover:underline"
                    >
                      Clear filters
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* CMS content blocks — editable from admin panel (Pages → "products" → Content tab) */}
      {page?.layout && <RenderBlocks blocks={page.layout} />}
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryProductsPage()
  if (page) return generateMeta({ doc: page })
  return {
    title: 'Products | HydroEra',
    description:
      "Browse HydroEra's full range of industrial and commercial pump systems, spare parts, and control panels.",
  }
}
