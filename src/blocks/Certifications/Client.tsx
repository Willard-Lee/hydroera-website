'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Media } from '@/components/Media'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { CertificationsBlock, Media as MediaType } from '@/payload-types'

type Certificate = NonNullable<CertificationsBlock['certificates']>[number]

type Props = {
  eyebrow?: string | null
  heading?: string | null
  description?: string | null
  layout: 'carousel' | 'grid'
  certificates: Certificate[]
}

function getMediaUrl(media: number | MediaType | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

export const CertificationsClient: React.FC<Props> = ({
  eyebrow,
  heading,
  description,
  certificates,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % certificates.length)
  }, [certificates.length])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + certificates.length) % certificates.length)
  }, [certificates.length])

  // Auto-play every 5s
  useEffect(() => {
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [goNext])

  const activeCert = certificates[activeIndex]

  // Get offset from active for each card (-2, -1, 0, 1, 2, etc.)
  function getOffset(i: number) {
    const len = certificates.length
    let diff = i - activeIndex
    if (diff > len / 2) diff -= len
    if (diff < -len / 2) diff += len
    return diff
  }

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ══════ LEFT SIDE: Headers & description ══════ */}
          <div>
            {eyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{heading}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{description}</p>
            )}

            {/* Active certificate info */}
            <div className="border-l-2 border-primary pl-4 mb-6">
              <p className="text-base font-semibold text-foreground">{activeCert?.title}</p>
              {(activeCert?.issuingBody || activeCert?.year) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {activeCert.issuingBody}
                  {activeCert.issuingBody && activeCert.year ? ' · ' : ''}
                  {activeCert.year}
                </p>
              )}
            </div>

          </div>

          {/* ══════ RIGHT SIDE: 3D Stacked Card Carousel ══════ */}
          <div className="relative flex items-center justify-center" style={{ height: 420 }}>
            {/* Left arrow */}
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Previous certificate"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            {/* Right arrow */}
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Next certificate"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
            

            {certificates.map((cert, i) => {
              const offset = getOffset(i)
              const absOffset = Math.abs(offset)

              // Only render cards within range of -2..2
              if (absOffset > 2) return null

              const scale = 1 - absOffset * 0.12
              const translateX = offset * 100
              const zIndex = 10 - absOffset
              const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.7 : 0.4
              const rotateY = offset * -8

              return (
                <div
                  key={cert.id || i}
                  className="absolute transition-all duration-500 ease-out cursor-pointer"
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
                    zIndex,
                    opacity,
                    pointerEvents: absOffset === 0 ? 'auto' : 'none',
                  }}
                  onClick={() => {
                    if (offset > 0) goNext()
                    else if (offset < 0) goPrev()
                  }}
                >
                  {/* A4 Card */}
                  <div className="w-[240px] sm:w-[260px] bg-white rounded-xl shadow-2xl overflow-hidden border border-border">
                    {/* Certificate image — A4 ratio */}
                    <div className="relative aspect-[210/297] bg-gray-50 overflow-hidden">
                      {cert.certificateImage && typeof cert.certificateImage === 'object' && (
                        <Media
                          resource={cert.certificateImage}
                          imgClassName="w-full h-full object-contain"
                          className="w-full h-full"
                        />
                      )}

                      {/* View overlay — only on active */}
                      {absOffset === 0 && (
                        <a
                          href={getMediaUrl(cert.certificateImage) ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-300 group/view"
                        >
                          <span className="opacity-0 group-hover/view:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-md">
                            <Search className="w-5 h-5 text-primary" />
                          </span>
                        </a>
                      )}
                    </div>

                    {/* Card footer */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                        {cert.title}
                      </h3>
                      {(cert.issuingBody || cert.year) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {cert.issuingBody}
                          {cert.issuingBody && cert.year ? ' · ' : ''}
                          {cert.year}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
