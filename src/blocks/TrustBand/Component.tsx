'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import type { TrustBandBlock as TrustBandBlockProps } from '@/payload-types'

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-hydroera-slate-dark',
  gradient: 'bg-gradient-to-br from-hydroera-dark-from via-hydroera-dark-via to-hydroera-dark-to',
}

export const TrustBandBlock: React.FC<TrustBandBlockProps & { id?: string }> = (props) => {
  const { id, label, background, logos } = props

  if (!logos || logos.length === 0) return null

  const bg = background || 'white'
  const isDark = bg === 'dark' || bg === 'gradient'

  return (
    <section
      className={cn('py-10 md:py-14', bgClasses[bg])}
      id={id ? `block-${id}` : undefined}
    >
      <div className="container">
        {label && (
          <p
            className={cn(
              'text-xs font-bold uppercase tracking-[0.2em] text-center mb-8',
              isDark ? 'text-white/30' : 'text-muted-foreground/50',
            )}
          >
            {label}
          </p>
        )}

        {/* Scrolling marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div
            className={cn(
              'absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none',
              isDark
                ? 'bg-gradient-to-r from-hydroera-slate-dark to-transparent'
                : bg === 'gray'
                  ? 'bg-gradient-to-r from-gray-50 to-transparent'
                  : 'bg-gradient-to-r from-white to-transparent',
            )}
          />
          <div
            className={cn(
              'absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none',
              isDark
                ? 'bg-gradient-to-l from-hydroera-slate-dark to-transparent'
                : bg === 'gray'
                  ? 'bg-gradient-to-l from-gray-50 to-transparent'
                  : 'bg-gradient-to-l from-white to-transparent',
            )}
          />

          <div className="flex animate-marquee gap-12 md:gap-16 items-center w-max">
            {[...logos, ...logos].map((item, i) => (
              <div
                key={`${item.id || i}-${i}`}
                className="shrink-0 flex items-center justify-center w-28 md:w-36 h-10 md:h-12"
                title={item.name}
              >
                {item.logo && typeof item.logo === 'object' && (
                  <Media
                    resource={item.logo}
                    imgClassName={cn(
                      'max-h-8 md:max-h-10 max-w-full w-auto object-contain transition-all duration-300',
                      isDark
                        ? 'brightness-0 invert opacity-30 hover:opacity-100 hover:invert-0 hover:brightness-100'
                        : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100',
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
