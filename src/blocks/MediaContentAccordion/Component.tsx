'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/ui'
import { ChevronDown } from 'lucide-react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { MediaContentAccordionBlock as Props } from '@/payload-types'

export const MediaContentAccordionBlock: React.FC<Props & { id?: string }> = (props) => {
  const { id, eyebrow, heading, media, mediaPosition, items, background } = props
  const [openIndex, setOpenIndex] = useState(0)

  if (!items || items.length === 0) return null

  const isMediaLeft = mediaPosition === 'left'

  return (
    <section
      className={cn('py-16 md:py-24', {
        'bg-white': background === 'white',
        'bg-secondary': background === 'grey',
      })}
      id={id ? `block-${id}` : undefined}
    >
      <div className="container">
        {/* Header */}
        {(eyebrow || heading) && (
          <div className="mb-12 max-w-2xl">
            {eyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">{heading}</h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Media side */}
          <div className={cn('relative', isMediaLeft ? 'order-1' : 'order-1 lg:order-2')}>
            {media && typeof media === 'object' && (
              <div className="rounded-lg overflow-hidden border border-border">
                <Media
                  resource={media}
                  imgClassName="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            )}
          </div>

          {/* Accordion side */}
          <div className={cn(isMediaLeft ? 'order-2' : 'order-2 lg:order-1')}>
            <div className="divide-y divide-border border-t border-border">
              {items.map((item, i) => {
                const isOpen = openIndex === i

                return (
                  <div key={item.id || i}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between py-5 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={cn(
                          'text-base font-semibold transition-colors',
                          isOpen ? 'text-hydroera-blue' : 'text-foreground group-hover:text-hydroera-blue',
                        )}
                      >
                        {item.title}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-5 h-5 text-muted-foreground shrink-0 ml-4 transition-transform duration-200',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-300',
                        isOpen ? 'max-h-[500px] opacity-100 pb-5' : 'max-h-0 opacity-0',
                      )}
                    >
                      {item.content && (
                        <RichText
                          data={item.content}
                          enableGutter={false}
                          className="text-sm text-muted-foreground [&_p]:leading-relaxed"
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
