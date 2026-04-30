'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { HeroContent } from '@/heros/HeroContent'
import { cn } from '@/utilities/ui'

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

/* ── Animated number counter ── */
const AnimatedNumber: React.FC<{
  value: number
  prefix?: string | null
  suffix?: string | null
}> = ({ value, prefix, suffix }) => {
  const [display, setDisplay] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const animate = useCallback(() => {
    if (hasAnimated) return
    setHasAnimated(true)

    const duration = 2000
    const steps = 60
    const stepTime = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current++
      const progress = current / steps
      const eased = 1 - (1 - progress) * (1 - progress)
      setDisplay(Math.round(eased * value))

      if (current >= steps) {
        clearInterval(timer)
        setDisplay(value)
      }
    }, stepTime)
  }, [value, hasAnimated])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animate])

  return (
    <span ref={ref}>
      {prefix || ''}
      {display.toLocaleString()}
      {suffix || ''}
    </span>
  )
}

type HeroStat = {
  id?: string | null
  value: number
  suffix?: string | null
  prefix?: string | null
  label: string
}

type HighImpactHeroProps = Page['hero'] & {
  breadcrumbs?: { label: string; url?: string | null }[] | null
  eyebrow?: string | null
  textAlignment?: 'left' | 'center' | 'right' | null
  overlayOpacity?: string | null
  showStats?: boolean | null
  heroStats?: HeroStat[] | null
}

export const HighImpactHero: React.FC<HighImpactHeroProps> = ({
  breadcrumbs,
  links,
  media,
  richText,
  eyebrow,
  textAlignment,
  overlayOpacity,
  showStats,
  heroStats,
}) => {
  const align = textAlignment || 'left'
  const opacity = opacityValues[overlayOpacity || '60'] ?? 0.6
  const direction = gradientDirection[align]

  const hasStats = showStats && heroStats && heroStats.length > 0

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
          background: `linear-gradient(${direction}, rgba(15,23,42,${Math.min(opacity + 0.15, 1)}) 0%, rgba(15,23,42,${opacity}) 45%, rgba(15,23,42,${opacity * 0.4}) 100%)`,
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

        {/* Stats row */}
        {hasStats && (
          <div
            className={cn(
              'mt-14 pt-10 border-t border-white/15',
              'grid gap-8',
              {
                'grid-cols-2': heroStats.length === 2,
                'grid-cols-3': heroStats.length === 3,
                'grid-cols-2 md:grid-cols-4': heroStats.length >= 4,
              },
            )}
          >
            {heroStats.map((stat, index) => (
              <div
                key={stat.id || index}
                className={cn(
                  align === 'center' ? 'text-center' : '',
                  'animate-fade-in-up opacity-0',
                )}
                style={{ animationDelay: `${index * 150 + 300}ms`, animationFillMode: 'forwards' }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                  <AnimatedNumber
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-sm text-white/50 font-medium mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
