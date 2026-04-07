// Component.tsx is invoking the config.ts to display the front end.

import React from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import {
  Wrench,
  Settings,
  Lightbulb,
  Droplets,
  Gauge,
  Cog,
  Headset,
  Truck,
  Shield,
  type LucideIcon,
} from 'lucide-react'
type ServiceItem = {
  id?: string | null
  title: string
  description: string
  icon: string
  enableLink?: boolean | null
  link?: Record<string, unknown> | null
}

type ServicesGridBlockProps = {
  heading?: string | null
  subheading?: string | null
  layout?: 'twoColumn' | 'threeColumn' | 'fourColumn' | null
  services?: ServiceItem[] | null
}

// Custom pump icon since Lucide doesn't have one
const PumpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 14h6v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4Z" />
    <path d="M10 14h4V8a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v6Z" />
    <path d="M14 11h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-4" />
    <path d="M7 4v2" />
    <path d="M7 8v2" />
    <circle cx="7" cy="14" r="0.5" fill="currentColor" />
  </svg>
)

const iconMap: Record<string, React.FC<{ className?: string }> | LucideIcon> = {
  pump: PumpIcon,
  maintenance: Wrench,
  installation: Settings,
  consulting: Lightbulb,
  waterTreatment: Droplets,
  testing: Gauge,
  engineering: Cog,
  support: Headset,
  delivery: Truck,
  safety: Shield,
}

const layoutClasses: Record<string, string> = {
  twoColumn: 'grid-cols-1 sm:grid-cols-2',
  threeColumn: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  fourColumn: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export const ServicesGridBlock: React.FC<ServicesGridBlockProps> = ({
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
            const IconComponent = iconMap[service.icon] || Cog
            const hasLink = service.enableLink && service.link

            const cardContent = (
              <div
                className={cn(
                  'group relative bg-card rounded-lg border border-border p-6 md:p-8',
                  'transition-all duration-300 ease-out',
                  'hover:border-hydroera-blue/30 hover:shadow-[0_4px_20px_rgba(11,79,138,0.08)]',
                  'hover:-translate-y-0.5',
                  hasLink && 'cursor-pointer',
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'inline-flex items-center justify-center w-12 h-12 rounded-lg mb-5',
                    'bg-hydroera-accent text-hydroera-blue',
                    'transition-colors duration-300',
                    'group-hover:bg-hydroera-blue group-hover:text-white',
                  )}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

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