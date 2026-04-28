'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import type { TrustBandBlock as TrustBandBlockProps } from '@/payload-types'

/* ── Animated counter ── */
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

/* ── Main component ── */
export const TrustBandBlock: React.FC<TrustBandBlockProps & { id?: string }> = (props) => {
  const { id, eyebrow, heading, stats, showLogos, logosLabel, logos } = props

  if (!stats || stats.length === 0) return null

  return (
    <section
      className="bg-gradient-to-br from-[#0b1120] via-[#0f1d3a] to-[#1a3564] text-white"
      id={id ? `block-${id}` : undefined}
    >
      {/* Stats section */}
      <div className="container py-16 md:py-20">
        {/* Header */}
        {(eyebrow || heading) && (
          <div className="text-center mb-12">
            {eyebrow && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{heading}</h2>
            )}
          </div>
        )}

        {/* Stats grid */}
        <div
          className={cn('grid gap-8 md:gap-12', {
            'grid-cols-2': stats.length === 2,
            'grid-cols-2 lg:grid-cols-3': stats.length === 3,
            'grid-cols-2 lg:grid-cols-4': stats.length >= 4,
          })}
        >
          {stats.map((stat, index) => (
            <div key={stat.id || index} className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <div className="w-8 h-0.5 mx-auto mt-4 mb-3 rounded-full bg-hydroera-blue" />
              <p className="text-sm text-white/50 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Logo ribbon */}
      {showLogos && logos && logos.length > 0 && (
        <div className="border-t border-white/10">
          <div className="container py-8 md:py-10">
            {logosLabel && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 text-center mb-6">
                {logosLabel}
              </p>
            )}

            {/* Scrolling marquee */}
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#0f1d3a] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#1a3564] to-transparent z-10 pointer-events-none" />

              <div className="flex animate-marquee gap-10 md:gap-14 items-center w-max">
                {[...logos, ...logos].map((item, i) => (
                  <div
                    key={`${item.id || i}-${i}`}
                    className="shrink-0 flex items-center justify-center h-10 md:h-12"
                    title={item.name}
                  >
                    {item.logo && typeof item.logo === 'object' && (
                      <Media
                        resource={item.logo}
                        imgClassName="h-8 md:h-10 w-auto object-contain opacity-40 hover:opacity-80 transition-opacity duration-300 brightness-0 invert"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
