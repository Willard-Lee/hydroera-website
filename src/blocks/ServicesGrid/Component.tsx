import React from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

type ServiceItem = {
  id?: string | null
  title: string
  description: string
  image?: MediaType | string | null
  enableLink?: boolean | null
  link?: Record<string, unknown> | null
}

type ServicesGridBlockProps = {
  eyebrow?: string | null
  heading?: string | null
  subheading?: string | null
  layout?: 'twoColumn' | 'threeColumn' | 'fourColumn' | null
  services?: ServiceItem[] | null
}

const layoutClasses: Record<string, string> = {
  twoColumn: 'grid-cols-1 sm:grid-cols-2',
  threeColumn: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  fourColumn: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export const ServicesGridBlock: React.FC<ServicesGridBlockProps> = ({
  eyebrow,
  heading,
  subheading,
  layout,
  services,
}) => {
  const gridClass = layoutClasses[layout || 'threeColumn']

  return (
    <section className="container my-16">
      {/* Section header */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        {eyebrow && (
          <span className="inline-block text-sm font-bold uppercase tracking-widest text-hydroera-blue mb-3">
            {eyebrow}
          </span>
        )}
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{subheading}</p>
        )}
      </div>

      {/* Services grid */}
      {services && services.length > 0 && (
        <div className={cn('grid gap-6 md:gap-8', gridClass)}>
          {services.map((service, index) => {
            const hasLink = service.enableLink && service.link

            const cardContent = (
              <div
                className={cn(
                  'group relative bg-card rounded-lg border border-border overflow-hidden',
                  'transition-all duration-300 ease-out',
                  'hover:border-hydroera-blue/30 hover:shadow-[0_4px_20px_rgba(11,79,138,0.08)]',
                  'hover:-translate-y-0.5',
                  hasLink && 'cursor-pointer',
                )}
              >
                {/* Image */}
                {service.image && typeof service.image === 'object' && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Media
                      resource={service.image}
                      fill
                      imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Text content */}
                <div className="p-6 md:p-8">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Link indicator */}
                  {hasLink && (
                    <div className="mt-4 flex items-center text-sm font-medium text-hydroera-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Learn more</span>
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )

            if (hasLink) {
              return (
                <CMSLink
                  key={service.id || index}
                  {...service.link}
                  appearance="inline"
                  className="no-underline block"
                >
                  {cardContent}
                </CMSLink>
              )
            }

            return (
              <div key={service.id || index}>
                {cardContent}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
