'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react'
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
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const goTo = useCallback(
    (index: number, dir?: 'left' | 'right') => {
      if (isAnimating) return
      setDirection(dir ?? (index > activeIndex ? 'right' : 'left'))
      setIsAnimating(true)
      setTimeout(() => {
        setActiveIndex(index)
        setIsAnimating(false)
      }, 300)
    },
    [activeIndex, isAnimating],
  )

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % certificates.length
    goTo(next, 'right')
  }, [activeIndex, certificates.length, goTo])

  const goPrev = useCallback(() => {
    const prev = (activeIndex - 1 + certificates.length) % certificates.length
    goTo(prev, 'left')
  }, [activeIndex, certificates.length, goTo])

  // Auto-play
  useEffect(() => {
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [goNext])

  const activeCert = certificates[activeIndex]
  const downloadUrl =
    getMediaUrl(activeCert?.certificateFile) ?? getMediaUrl(activeCert?.certificateImage) ?? '#'
  const imageUrl = getMediaUrl(activeCert?.certificateImage)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left side — Text content */}
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-hydroera-blue mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{heading}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{description}</p>
            )}

            {/* Certificate list as clickable items */}
            <div className="space-y-3">
              {certificates.map((cert, i) => (
                <button
                  key={cert.id || i}
                  onClick={() => goTo(i)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg border transition-all duration-300',
                    i === activeIndex
                      ? 'border-hydroera-blue/30 bg-hydroera-blue/5 shadow-sm'
                      : 'border-transparent hover:border-border hover:bg-secondary/50',
                  )}
                >
                  <p
                    className={cn(
                      'text-sm font-semibold transition-colors',
                      i === activeIndex ? 'text-hydroera-blue' : 'text-foreground',
                    )}
                  >
                    {cert.title}
                  </p>
                  {(cert.issuingBody || cert.year) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cert.issuingBody}
                      {cert.issuingBody && cert.year ? ' · ' : ''}
                      {cert.year}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right side — A4 Certificate carousel (one at a time) */}
          <div className="relative">
            {/* A4 certificate display */}
            <div className="relative bg-secondary/30 rounded-xl p-6 md:p-8">
              <div
                className={cn(
                  'relative aspect-[210/297] bg-white rounded-lg shadow-lg overflow-hidden border border-border transition-all duration-300',
                  isAnimating && direction === 'right' && 'opacity-0 translate-x-4',
                  isAnimating && direction === 'left' && 'opacity-0 -translate-x-4',
                  !isAnimating && 'opacity-100 translate-x-0',
                )}
              >
                {activeCert?.certificateImage &&
                  typeof activeCert.certificateImage === 'object' && (
                    <Media
                      resource={activeCert.certificateImage}
                      imgClassName="w-full h-full object-contain"
                      className="w-full h-full"
                    />
                  )}

                {/* View full-size overlay */}
                {imageUrl && (
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-300 group/view"
                  >
                    <span className="opacity-0 group-hover/view:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-md">
                      <Search className="w-5 h-5 text-hydroera-blue" />
                    </span>
                  </a>
                )}
              </div>

              {/* Navigation arrows */}
              {certificates.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
                    aria-label="Previous certificate"
                  >
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
                    aria-label="Next certificate"
                  >
                    <ChevronRight className="w-4 h-4 text-foreground" />
                  </button>
                </>
              )}

              {/* Certificate title + download below the A4 frame */}
              <div className="mt-5 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {activeCert?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeIndex + 1} of {certificates.length}
                  </p>
                </div>
                {activeCert?.enableDownload && downloadUrl !== '#' && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-hydroera-blue hover:text-hydroera-blue-dark transition-colors shrink-0 ml-4"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                )}
              </div>

              {/* Dot indicators */}
              {certificates.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  {certificates.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all duration-200',
                        i === activeIndex
                          ? 'bg-hydroera-blue w-6'
                          : 'bg-border hover:bg-muted-foreground',
                      )}
                      aria-label={`Go to certificate ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
