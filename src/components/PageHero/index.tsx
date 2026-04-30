import React from 'react'
import { Media as MediaComponent } from '@/components/Media'
import type { Media } from '@/payload-types'

interface PageHeroProps {
  eyebrow?: string
  heading: string
  description?: string
  media?: Media | null
  textAlignment?: 'left' | 'center' | 'right'
  overlayOpacity?: '0' | '30' | '60' | '80' | '100'
}

const opacityValues: Record<string, number> = {
  '0': 0,
  '30': 0.3,
  '60': 0.6,
  '80': 0.8,
  '100': 1,
}

const gradientDirection: Record<string, string> = {
  left: 'to right',
  center: 'to right',
  right: 'to left',
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  heading,
  description,
  media,
  textAlignment = 'left',
  overlayOpacity = '60',
}) => {
  const opacity = opacityValues[overlayOpacity] ?? 0.6
  const direction = gradientDirection[textAlignment]

  const alignmentClasses = {
    left: { wrapper: 'justify-start', content: 'items-start', text: 'text-left' },
    center: { wrapper: 'justify-center', content: 'items-center', text: 'text-center' },
    right: { wrapper: 'justify-end', content: 'items-end', text: 'text-right' },
  }

  const alignment = alignmentClasses[textAlignment]

  return (
    <div
      className="relative flex items-end text-white min-h-[50vh] overflow-hidden"
      data-theme="dark"
    >
      {/* Background image */}
      {media && typeof media === 'object' && (
        <MediaComponent fill imgClassName="object-cover -z-20" priority resource={media} />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: media
            ? `linear-gradient(${direction}, rgba(15,23,42,${Math.min(opacity + 0.15, 1)}) 0%, rgba(15,23,42,${opacity}) 45%, rgba(15,23,42,${opacity * 0.4}) 100%)`
            : undefined,
        }}
      />

      {/* Fallback solid background when no image */}
      {(!media || typeof media !== 'object') && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-hydroera-dark-from via-hydroera-dark-via to-hydroera-dark-to" />
      )}

      {/* Content */}
      <div className="container z-10 relative pb-14 pt-28">
        <div className={`w-full flex ${alignment.wrapper}`}>
          <div className={`max-w-xl flex flex-col ${alignment.content}`}>
            {eyebrow && (
              <span
                className={`inline-block text-sm font-semibold uppercase tracking-widest text-blue-400 mb-4 ${alignment.text}`}
              >
                {eyebrow}
              </span>
            )}
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight ${alignment.text}`}
            >
              {heading}
            </h1>
            {description && (
              <p className={`mt-6 text-lg text-white/60 leading-relaxed ${alignment.text}`}>
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
