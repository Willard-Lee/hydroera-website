import React from 'react'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Alignment = 'left' | 'center' | 'right'

const alignmentClasses: Record<Alignment, { wrapper: string; container: string; text: string; links: string }> = {
  left: {
    wrapper: 'justify-start',
    container: 'items-start',
    text: 'text-left',
    links: 'justify-start',
  },
  center: {
    wrapper: 'justify-center',
    container: 'items-center',
    text: 'text-center',
    links: 'justify-center',
  },
  right: {
    wrapper: 'justify-end',
    container: 'items-end',
    text: 'text-right',
    links: 'justify-end',
  },
}

interface HeroContentProps {
  eyebrow?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  richText?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links?: any[] | null
  textAlignment?: Alignment | null
  variant: 'high' | 'medium'
}

export const HeroContent: React.FC<HeroContentProps> = ({
  eyebrow,
  richText,
  links,
  textAlignment,
  variant,
}) => {
  const align = textAlignment || 'left'
  const alignment = alignmentClasses[align]

  const headingSize =
    variant === 'high'
      ? '[&_h1]:text-5xl [&_h1]:md:text-6xl [&_h1]:lg:text-7xl'
      : '[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-6xl'


  const maxWidth = variant === 'high' ? 'max-w-2xl' : 'max-w-xl'

  return (
    <div className={`w-full flex ${alignment.wrapper}`}>
      <div className={`${maxWidth} flex flex-col ${alignment.container}`}>
        {/* Eyebrow */}
        {eyebrow && variant === 'high' && (
          <span
            className={`inline-block bg-hydroera-blue text-white text-sm font-semibold tracking-wide px-4 py-1.5 rounded-full mb-6 ${alignment.text}`}
          >
            {eyebrow}
          </span>
        )}
        {eyebrow && variant === 'medium' && (
          <span
            className={`inline-block text-sm font-semibold uppercase tracking-widest text-blue-400 mb-4 ${alignment.text}`}
          >
            {eyebrow}
          </span>
        )}

        {/* Rich text */}
        {richText && (
          <RichText
            className={`${variant === 'high' ? 'mb-8' : ''} ${alignment.text} ${headingSize} [&_h1]:font-bold [&_h1]:leading-[1.1] [&_h1]:tracking-tight [&_p]:text-lg [&_p]:text-white/60 [&_p]:mt-6`}
            data={richText}
            enableGutter={false}
            enableProse={false}
          />
        )}

        {/* Links */}
        {Array.isArray(links) && links.length > 0 && (
          <ul className={`flex gap-4 mt-6 ${alignment.links}`}>
            {links.map(({ link }, i) => (
              <li key={i}>
                <CMSLink
                  {...link}
                  className={
                    link.appearance === 'outline'
                      ? 'border-white/30 bg-transparent text-white hover:bg-white/10'
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
