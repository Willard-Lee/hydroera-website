'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import type { LogoGridBlock as LogoGridBlockProps, Media as MediaType } from '@/payload-types'

function getMediaUrl(media: number | MediaType | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

export const LogoGridBlock: React.FC<LogoGridBlockProps & { id?: string }> = (props) => {
  const { id, eyebrow, heading, description, style, logos, enableCta, ctaLink } = props

  if (!logos || logos.length === 0) return null

  return (
    <section className="py-16 md:py-24" id={id ? `block-${id}` : undefined}>
      <div className="container">
        {/* Header */}
        {(eyebrow || heading || description) && (
          <div className="mb-12 text-center max-w-2xl mx-auto">
            {eyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{heading}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {/* Grid layout */}
        {style === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {logos.map((item, i) => (
              <LogoCard key={item.id || i} item={item} />
            ))}
          </div>
        )}

        {/* Marquee layout */}
        {style === 'marquee' && (
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee gap-12 items-center">
              {/* Duplicate logos for seamless loop */}
              {[...logos, ...logos].map((item, i) => (
                <LogoCard key={`${item.id || i}-${i}`} item={item} marquee />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {enableCta && ctaLink && (
          <div className="mt-10 text-center">
            <CMSLink {...ctaLink} size="lg" />
          </div>
        )}
      </div>
    </section>
  )
}

type LogoItem = NonNullable<LogoGridBlockProps['logos']>[number]

function LogoCard({ item, marquee }: { item: LogoItem; marquee?: boolean }) {
  const content = (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg border border-border bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-hydroera-blue/30',
        marquee ? 'shrink-0 w-[160px] h-[100px]' : 'aspect-[3/2]',
      )}
      title={item.name}
    >
      {item.logo && typeof item.logo === 'object' && (
        <Media
          resource={item.logo}
          imgClassName="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
        />
      )}
    </div>
  )

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}
