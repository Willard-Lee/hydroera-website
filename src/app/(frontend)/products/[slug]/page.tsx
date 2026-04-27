import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return products.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug: decodeURIComponent(slug) })

  if (!product) return notFound()

  const category =
    product.category && typeof product.category === 'object' ? product.category : null

  // Fetch related products — use manually selected ones, or fallback to same category
  let relatedProducts: typeof product[] = []
  if (product.relatedProducts && Array.isArray(product.relatedProducts) && product.relatedProducts.length > 0) {
    relatedProducts = product.relatedProducts.filter(
      (p): p is typeof product => typeof p === 'object',
    )
  } else if (category) {
    const payload = await getPayload({ config: configPromise })
    const sameCat = await payload.find({
      collection: 'products',
      draft: false,
      limit: 4,
      overrideAccess: false,
      where: {
        and: [
          { category: { equals: category.id } },
          { id: { not_equals: product.id } },
        ],
      },
      depth: 1,
    })
    relatedProducts = sameCat.docs
  }

  // Combine featured image + gallery for the product gallery
  const galleryImages: Array<{ image: typeof product.featuredImage; caption?: string | null }> = []
  if (product.featuredImage && typeof product.featuredImage === 'object') {
    galleryImages.push({ image: product.featuredImage, caption: null })
  }
  if (product.gallery) {
    product.gallery.forEach((item) => {
      if (item.image && typeof item.image === 'object') {
        galleryImages.push({ image: item.image, caption: item.caption })
      }
    })
  }

  return (
    <article className="pt-32 pb-24">
      {draft && <LivePreviewListener />}

      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="text-muted-foreground/50">/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          {category && (
            <>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-muted-foreground">{category.title}</span>
            </>
          )}
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product gallery */}
          <div className="space-y-4">
            {/* Main image */}
            {galleryImages.length > 0 && galleryImages[0]?.image && typeof galleryImages[0].image === 'object' && (
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                <Media
                  resource={galleryImages[0].image}
                  fill
                  imgClassName="object-cover"
                  priority
                />
              </div>
            )}
            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.slice(1).map((item, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-md overflow-hidden bg-muted border border-border"
                  >
                    {item.image && typeof item.image === 'object' && (
                      <Media resource={item.image} fill imgClassName="object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            {category && (
              <span className="text-sm text-hydroera-blue font-medium">{category.title}</span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {product.title}
            </h1>

            {product.shortDescription && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Specs summary */}
            {product.specifications && (product.specifications.material || product.specifications.dimensions) && (
              <div className="bg-card border border-border rounded-lg p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Specifications</h3>
                <dl className="space-y-2 text-sm">
                  {product.specifications.material && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Material</dt>
                      <dd className="font-medium text-foreground">{product.specifications.material}</dd>
                    </div>
                  )}
                  {product.specifications.dimensions && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Dimensions</dt>
                      <dd className="font-medium text-foreground">{product.specifications.dimensions}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-hydroera-blue text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-hydroera-blue/90 transition-colors"
              >
                Enquire About This Product
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-border text-foreground text-sm font-semibold px-6 py-3 rounded-md hover:bg-muted transition-colors"
              >
                Download Catalogue
              </Link>
            </div>
          </div>
        </div>

        {/* Full description */}
        {product.description && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Product Description</h2>
            <RichText data={product.description} enableGutter={false} />
          </div>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.slug}`}
                  className="group block no-underline"
                >
                  <div className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-hydroera-blue/30 hover:shadow-lg hover:-translate-y-0.5">
                    {related.featuredImage && typeof related.featuredImage === 'object' && (
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <Media
                          resource={related.featuredImage}
                          fill
                          imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-hydroera-blue transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-20 bg-hydroera-blue/5 border border-hydroera-blue/20 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Need Help Choosing the Right Product?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Our engineers can recommend the best pump system for your project requirements, budget, and site conditions.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-hydroera-blue text-white font-semibold px-8 py-3 rounded-md hover:bg-hydroera-blue/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: product })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 2,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
