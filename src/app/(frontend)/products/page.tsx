import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })

  const [products, categories] = await Promise.all([
    payload.find({
      collection: 'products',
      draft: false,
      limit: 100,
      overrideAccess: false,
      sort: 'title',
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      limit: 50,
      sort: 'title',
    }),
  ])

  return (
    <article className="pt-16 pb-24">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Products</span>
        </nav>

        {/* Page header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse our comprehensive range of pumps, systems, and accessories for every application.
          </p>
        </div>

        {/* Category filters */}
        {categories.docs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="bg-hydroera-blue text-white text-sm font-medium px-4 py-2 rounded-full">
              All Products
            </span>
            {categories.docs.map((cat) => (
              <span
                key={cat.id}
                className="bg-card border border-border text-sm font-medium px-4 py-2 rounded-full text-muted-foreground hover:border-hydroera-blue/30 transition-colors cursor-default"
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        {/* Products grid */}
        {products.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <div className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-hydroera-blue/30 hover:shadow-lg hover:-translate-y-0.5">
                    {/* Product image */}
                    {product.featuredImage && typeof product.featuredImage === 'object' && (
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <Media
                          resource={product.featuredImage}
                          fill
                          imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      {category && (
                        <span className="text-xs text-hydroera-blue font-medium">
                          {category.title}
                        </span>
                      )}
                      <h3 className="text-sm font-semibold text-foreground mt-1 group-hover:text-hydroera-blue transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                      {product.shortDescription && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {product.shortDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No products to show yet.</p>
        )}
      </div>
    </article>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Products | HydroEra',
    description:
      "Browse HydroEra's full range of industrial and commercial pump systems, spare parts, and control panels.",
  }
}
