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

  const hasSpecs = !!product.specifications
  const hasDescription = !!product.description

  return (
    <article className="pb-24">
      {draft && <LivePreviewListener />}

      {/* Compact dark header band */}
      <div className="bg-hydroera-slate-dark text-white" data-theme="dark">
        <div className="container pt-28 pb-8 md:pt-32 md:pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            {category && (
              <>
                <span>/</span>
                <Link href={`/products?category=${category.slug || ''}`} className="hover:text-white transition-colors">
                  {category.title}
                </Link>
              </>
            )}
          </nav>
          {category && (
            <span className="inline-block bg-hydroera-blue text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {category.title}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            {product.title}
          </h1>
          {product.shortDescription && (
            <p className="mt-2 text-base text-white/60 max-w-2xl">{product.shortDescription}</p>
          )}
        </div>
      </div>

      <div className="container mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* ── LEFT: Gallery ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main image */}
            {galleryImages.length > 0 && galleryImages[0]?.image && typeof galleryImages[0].image === 'object' && (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border">
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
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {galleryImages.slice(1).map((item, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-md overflow-hidden bg-muted border border-border hover:border-hydroera-blue/40 transition-colors cursor-pointer"
                  >
                    {item.image && typeof item.image === 'object' && (
                      <Media resource={item.image} fill imgClassName="object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Sticky sidebar ── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-5">

              {/* Quick info card */}
              <div className="bg-card border border-border rounded-lg p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Product Info</h3>
                <dl className="space-y-2 text-sm">
                  {category && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="font-medium text-foreground">{category.title}</dd>
                    </div>
                  )}
                  {product.dataSheet && typeof product.dataSheet === 'object' && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Data Sheet</dt>
                      <dd className="font-medium text-green-600">Available</dd>
                    </div>
                  )}
                  {hasSpecs && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Specifications</dt>
                      <dd>
                        <a href="#specifications" className="font-medium text-hydroera-blue hover:underline text-sm">
                          View below
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-hydroera-blue text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-hydroera-blue/90 transition-colors"
                >
                  Enquire About This Product
                </Link>
                {product.dataSheet && typeof product.dataSheet === 'object' && product.dataSheet.url && (
                  <a
                    href={product.dataSheet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border border-border text-foreground text-sm font-semibold px-6 py-3 rounded-md hover:bg-muted transition-colors"
                  >
                    Download Data Sheet
                  </a>
                )}
              </div>

              {/* Sidebar CTA */}
              <div className="bg-hydroera-blue/5 border border-hydroera-blue/20 rounded-lg p-5 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Need help choosing the right product?
                </p>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-hydroera-blue hover:underline"
                >
                  Talk to an engineer
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content sections with anchor nav ── */}
        {(hasSpecs || hasDescription) && (
          <nav className="mt-16 flex items-center gap-6 border-b border-border pb-3">
            {hasSpecs && (
              <a href="#specifications" className="text-sm font-semibold text-hydroera-blue hover:text-hydroera-blue-dark transition-colors">
                Specifications
              </a>
            )}
            {hasDescription && (
              <a href="#description" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Description
              </a>
            )}
            {relatedProducts.length > 0 && (
              <a href="#related" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Related Products
              </a>
            )}
          </nav>
        )}

        {/* Specifications (rich text with tables/media) */}
        {product.specifications && (
          <div id="specifications" className="mt-10 scroll-mt-24">
            <h2 className="text-2xl font-bold text-foreground mb-6">Specifications</h2>
            <RichText data={product.specifications} enableGutter={false} />
          </div>
        )}

        {/* Full description */}
        {product.description && (
          <div id="description" className="mt-16 max-w-3xl scroll-mt-24">
            <h2 className="text-2xl font-bold text-foreground mb-6">Product Description</h2>
            <RichText data={product.description} enableGutter={false} />
          </div>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div id="related" className="mt-20 scroll-mt-24">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => {
                const relCategory =
                  related.category && typeof related.category === 'object' ? related.category : null
                return (
                  <Link
                    key={related.id}
                    href={`/products/${related.slug}`}
                    className="group block no-underline"
                  >
                    <div className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-hydroera-blue/30 hover:shadow-lg hover:-translate-y-0.5">
                      {related.featuredImage && typeof related.featuredImage === 'object' && (
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          <Media
                            resource={related.featuredImage}
                            fill
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        {relCategory && (
                          <span className="text-xs text-muted-foreground">{relCategory.title}</span>
                        )}
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-hydroera-blue transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        {related.shortDescription && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{related.shortDescription}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Contact CTA banner */}
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
