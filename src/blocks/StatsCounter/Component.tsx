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
  theme?: 'light' | 'dark' | 'slate' | 'gradient' | null
  style?: 'default' | 'ring' | null
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

    const duration = 2000
    const steps = 60
    const stepTime = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current++
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
/*  Circular progress ring                                             */
/* ------------------------------------------------------------------ */
const ProgressRing: React.FC<{
  value: number
  max?: number
  isDark: boolean
}> = ({ value, max = 100, isDark }) => {
  const [progress, setProgress] = useState(0)
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate after a brief delay for visual effect
          setTimeout(() => setProgress(Math.min(value / max, 1) * 100), 200)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, max])

  const radius = 52
  const stroke = 6
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg
      ref={ref}
      className="w-32 h-32 mx-auto -rotate-90"
      viewBox="0 0 120 120"
    >
      {/* Background ring */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}
        strokeWidth={stroke}
      />
      {/* Progress ring */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={cn(
          'transition-[stroke-dashoffset] duration-[2000ms] ease-out',
          isDark ? 'text-white' : 'text-hydroera-blue',
        )}
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Main block component                                               */
/* ------------------------------------------------------------------ */
export const StatsCounterBlock: React.FC<StatsCounterBlockProps> = ({
  heading,
  theme,
  style,
  stats,
}) => {
  const isDark = theme === 'dark' || theme === 'slate' || theme === 'gradient'
  const isRing = style === 'ring'

  return (
    <section
      className={cn('py-16 md:py-20', {
        'bg-hydroera-blue-dark text-white': theme === 'dark',
        'bg-hydroera-slate-dark text-white': theme === 'slate',
        'bg-gradient-to-br from-[#0b1120] via-[#0f1d3a] to-[#1a3564] text-white': theme === 'gradient',
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
                  {/* Ring style */}
                  {isRing ? (
                    <div className="relative mb-4">
                      <ProgressRing value={stat.value} isDark={isDark} />
                      {/* Overlay number in center of ring */}
                      <div className="absolute inset-0 flex items-center justify-center rotate-0">
                        <AnimatedNumber
                          value={stat.value}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                          className={cn(
                            'block text-2xl md:text-3xl font-bold tracking-tight',
                            isDark ? 'text-white' : 'text-hydroera-blue-dark',
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Default style: icon */}
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

                      {/* Default style: number */}
                      <AnimatedNumber
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        className={cn(
                          'block text-4xl md:text-5xl font-bold tracking-tight',
                          isDark ? 'text-white' : 'text-hydroera-blue-dark',
                        )}
                      />
                    </>
                  )}

                  {/* Divider line */}
                  <div
                    className={cn(
                      'w-8 h-0.5 mx-auto mt-4 mb-3 rounded-full',
                      isDark ? 'bg-hydroera-blue' : 'bg-hydroera-blue/30',
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
