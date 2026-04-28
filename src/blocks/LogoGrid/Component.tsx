'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import type { LogoGridBlock as LogoGridBlockProps, Media as MediaType } from '@/payload-types'

export const LogoGridBlock: React.FC<LogoGridBlockProps & { id?: string }> = (props) => {
  const { id, eyebrow, heading, description, style, logos, enableCta, ctaLink } = props

  if (!logos || logos.length === 0) return null

  return (
    <section className="py-16 md:py-20" id={id ? `block-${id}` : undefined}>
      <div className="container">
        {/* Header */}
        {(eyebrow || heading || description) && (
          <div className="mb-10 text-center max-w-2xl mx-auto">
            {eyebrow && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{heading}</h2>
            )}
            {description && (
              <p className="text-base text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {/* Grid layout */}
        {style === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {logos.map((item, i) => (
              <LogoCard key={item.id || i} item={item} />
            ))}
          </div>
        )}

        {/* Marquee layout — continuous scrolling ribbon */}
        {style === 'marquee' && (
          <div className="relative overflow-hidden py-4">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee gap-8 md:gap-12 items-center w-max">
              {/* Duplicate logos twice for seamless loop */}
              {[...logos, ...logos].map((item, i) => (
                <LogoCard key={`${item.id || i}-${i}`} item={item} marquee />
              ))}
            </div>
          </div>
        )}

        {/* Divider line */}
        <div className="mt-10 border-t border-border" />

        {/* CTA */}
        {enableCta && ctaLink && (
          <div className="mt-8 text-center">
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
        'flex items-center justify-center bg-white rounded-lg border border-border/60 transition-all duration-300',
        'hover:shadow-sm hover:border-border',
        marquee ? 'shrink-0 w-[140px] md:w-[170px] h-[80px] md:h-[90px] p-4' : 'aspect-[3/2] p-5',
      )}
      title={item.name}
    >
      {item.logo && typeof item.logo === 'object' && (
        <Media
          resource={item.logo}
          imgClassName="max-h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
        />
      )}
    </div>
  )

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }

  return content
}
