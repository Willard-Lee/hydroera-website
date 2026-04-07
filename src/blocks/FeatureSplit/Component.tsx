import React from 'react'
import { cn } from '@/utilities/ui'
import { CheckCircle } from 'lucide-react'

import type { FeatureSplitBlock as FeatureSplitBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const FeatureSplitBlock: React.FC<FeatureSplitBlockProps> = (props) => {
  const {
    eyebrow,
    richText,
    highlights,
    enableLink,
    link,
    media,
    mediaPosition,
    background,
  } = props

  const isDark = background === 'dark'
  const isImageLeft = mediaPosition === 'left'

  return (
    <section
      className={cn('py-16 md:py-24', {
        'bg-white': background === 'white',
        'bg-secondary': background === 'grey',
        'bg-hydroera-blue-dark text-white': isDark,
      })}
    >
      <div className="container">
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center',
          )}
        >
          {/* ── Image side ──────────────────────────────────────────── */}
          <div
            className={cn(
              'relative',
              isImageLeft ? 'order-1' : 'order-1 lg:order-2',
            )}
          >
            {media && typeof media === 'object' && (
              <div className="relative rounded-lg overflow-hidden">
                <Media
                  resource={media}
                  imgClassName="w-full h-auto object-cover aspect-[4/3]"
                />
                {/* Subtle accent border on the image */}
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5" />
              </div>
            )}
          </div>

          {/* ── Text side ───────────────────────────────────────────── */}
          <div
            className={cn(
              isImageLeft ? 'order-2' : 'order-2 lg:order-1',
            )}
          >
            {/* Eyebrow */}
            {eyebrow && (
              <p
                className={cn(
                  'text-sm font-bold uppercase tracking-[0.15em] mb-4',
                  isDark ? 'text-hydroera-blue-light' : 'text-primary',
                )}
              >
                {eyebrow}
              </p>
            )}

            {/* Rich text heading + body */}
            {richText && (
              <RichText
                className={cn(
                  'mb-6 max-w-none',
                  isDark && '[&_h2]:text-white [&_h3]:text-white [&_p]:text-white/80',
                )}
                data={richText}
                enableGutter={false}
              />
            )}

            {/* Highlight points with checkmarks */}
            {highlights && highlights.length > 0 && (
              <div className="space-y-4 mb-8">
                {highlights.map((item, index) => (
                  <div key={item.id || index} className="flex gap-3">
                    <div
                      className={cn(
                        'shrink-0 mt-0.5',
                        isDark ? 'text-hydroera-blue-light' : 'text-hydroera-blue',
                      )}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          isDark ? 'text-white' : 'text-foreground',
                        )}
                      >
                        {item.title}
                      </p>
                      {item.description && (
                        <p
                          className={cn(
                            'text-sm mt-0.5',
                            isDark
                              ? 'text-white/60'
                              : 'text-muted-foreground',
                          )}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA button */}
            {enableLink && link && (
              <CMSLink
                {...link}
                size="lg"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}