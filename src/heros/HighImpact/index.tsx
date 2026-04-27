'use client'
import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { HeroContent } from '@/heros/HeroContent'

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

type HighImpactHeroProps = Page['hero'] & {
  breadcrumbs?: { label: string; url?: string | null }[] | null
  eyebrow?: string | null
  textAlignment?: 'left' | 'center' | 'right' | null
  overlayOpacity?: string | null
}

export const HighImpactHero: React.FC<HighImpactHeroProps> = ({
  breadcrumbs,
  links,
  media,
  richText,
  eyebrow,
  textAlignment,
  overlayOpacity,
}) => {
  const align = textAlignment || 'left'
  const opacity = opacityValues[overlayOpacity || '60'] ?? 0.6
  const direction = gradientDirection[align]

  return (
    <div
      className="relative flex items-center text-white min-h-[85vh]"
      data-theme="dark"
    >
      {/* Background image */}
      {media && typeof media === 'object' && (
        <Media fill imgClassName="object-cover -z-20" priority resource={media} />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(${direction}, rgba(11,17,32,${Math.min(opacity + 0.15, 1)}) 0%, rgba(11,17,32,${opacity}) 45%, rgba(11,17,32,${opacity * 0.4}) 100%)`,
        }}
      />

      {/* Content */}
      <div className="container z-10 relative py-20">
        <HeroContent
          breadcrumbs={breadcrumbs}
          eyebrow={eyebrow}
          richText={richText}
          links={links}
          textAlignment={textAlignment}
          variant="high"
        />
      </div>
    </div>
  )
}
