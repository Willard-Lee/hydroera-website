'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/utilities/ui'
import {
  Trophy,
  Users,
  Globe,
  CheckCircle,
  Building2,
  Star,
  Clock,
  Zap,
  type LucideIcon,
} from 'lucide-react'

type StatItem = {
  id?: string | null
  value: number
  label: string
  prefix?: string | null
  suffix?: string | null
  icon?: string | null
}

type StatsCounterBlockProps = {
  heading?: string | null
  theme?: 'light' | 'dark' | 'slate' | null
  stats?: StatItem[] | null
}

const iconMap: Record<string, LucideIcon> = {
  trophy: Trophy,
  users: Users,
  globe: Globe,
  check: CheckCircle,
  building: Building2,
  star: Star,
  clock: Clock,
  zap: Zap,
}

/* ------------------------------------------------------------------ */
/*  Animated number that counts up when visible                        */
/* ------------------------------------------------------------------ */
const AnimatedNumber: React.FC<{
  value: number
  prefix?: string | null
  suffix?: string | null
  className?: string
}> = ({ value, prefix, suffix, className }) => {
  const [display, setDisplay] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const animate = useCallback(() => {
    if (hasAnimated) return
    setHasAnimated(true)

    const duration = 2000 // ms
    const steps = 60
    const stepTime = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current++
      // ease-out quad
      const progress = current / steps
      const eased = 1 - (1 - progress) * (1 - progress)
      const next = Math.round(eased * value)

      setDisplay(next)

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
    <span ref={ref} className={className}>
      {prefix || ''}
      {display.toLocaleString()}
      {suffix || ''}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Main block component                                               */
/* ------------------------------------------------------------------ */
export const StatsCounterBlock: React.FC<StatsCounterBlockProps> = ({
  heading,
  theme,
  stats,
}) => {
  const isDark = theme === 'dark' || theme === 'slate'

  return (
    <section
      className={cn('py-16 md:py-20', {
        'bg-hydroera-blue-dark text-white': theme === 'dark',
        'bg-hydroera-slate-dark text-white': theme === 'slate',
        'bg-secondary': theme === 'light',
      })}
    >
      <div className="container">
        {/* Heading */}
        {heading && (
          <h2
            className={cn(
              'text-2xl md:text-3xl font-bold text-center mb-12 tracking-tight',
              isDark ? 'text-white' : 'text-foreground',
            )}
          >
            {heading}
          </h2>
        )}

        {/* Stats grid */}
        {stats && stats.length > 0 && (
          <div
            className={cn('grid gap-8 md:gap-12', {
              'grid-cols-1 sm:grid-cols-2': stats.length === 2,
              'grid-cols-1 sm:grid-cols-3': stats.length === 3,
              'grid-cols-2 lg:grid-cols-4': stats.length >= 4,
            })}
          >
            {stats.map((stat, index) => {
              const IconComponent =
                stat.icon && stat.icon !== 'none' ? iconMap[stat.icon] : null

              return (
                <div key={stat.id || index} className="text-center">
                  {/* Icon */}
                  {IconComponent && (
                    <div className="flex justify-center mb-4">
                      <div
                        className={cn(
                          'inline-flex items-center justify-center w-11 h-11 rounded-full',
                          isDark
                            ? 'bg-white/10 text-white/80'
                            : 'bg-hydroera-accent text-hydroera-blue',
                        )}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  {/* Number */}
                  <AnimatedNumber
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className={cn(
                      'block text-4xl md:text-5xl font-bold tracking-tight',
                      isDark ? 'text-white' : 'text-hydroera-blue-dark',
                    )}
                  />

                  {/* Divider line */}
                  <div
                    className={cn(
                      'w-10 h-0.5 mx-auto mt-4 mb-3 rounded-full',
                      isDark ? 'bg-white/20' : 'bg-hydroera-blue/20',
                    )}
                  />

                  {/* Label */}
                  <p
                    className={cn(
                      'text-sm md:text-base font-medium',
                      isDark ? 'text-white/70' : 'text-muted-foreground',
                    )}
                  >
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}