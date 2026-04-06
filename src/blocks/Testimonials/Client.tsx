'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight, Star, FileDown } from 'lucide-react'
import { Media } from '@/components/Media'

import type { Testimonial, Media as MediaType } from '@/payload-types'

/* ------------------------------------------------------------------ */
/*  Star rating                                                        */
/* ------------------------------------------------------------------ */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating
            ? 'fill-amber-400 text-amber-400'
            : 'fill-transparent text-border',
        )}
      />
    ))}
  </div>
)

/* ------------------------------------------------------------------ */
/*  Author avatar (image or initials fallback)                         */
/* ------------------------------------------------------------------ */
const AuthorAvatar: React.FC<{
  image?: MediaType | number | null
  name: string
  size?: 'sm' | 'lg'
}> = ({ image, name, size = 'sm' }) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const sizeClasses = size === 'lg' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm'

  if (image && typeof image === 'object') {
    return (
      <div className={cn('rounded-full overflow-hidden shrink-0', sizeClasses)}>
        <Media
          resource={image}
          imgClassName="w-full h-full object-cover"
          className="w-full h-full"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-hydroera-accent text-hydroera-blue font-semibold flex items-center justify-center shrink-0',
        sizeClasses,
      )}
    >
      {initials}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Single quote card                                                  */
/* ------------------------------------------------------------------ */
const QuoteCard: React.FC<{
  testimonial: Testimonial
  variant?: 'default' | 'featured'
  showRating?: boolean
  showCompanyLogo?: boolean
  showCompletionLetters?: boolean
}> = ({
  testimonial,
  variant = 'default',
  showRating = true,
  showCompanyLogo = true,
  showCompletionLetters = false,
}) => {
  const isFeatured = variant === 'featured'

  // Completion letter
  const letter = testimonial.completionLetter
  const hasPublicLetter =
    showCompletionLetters &&
    letter?.isPublic &&
    letter?.file &&
    typeof letter.file === 'object'
  const letterUrl = hasPublicLetter ? (letter.file as MediaType).url : null
  const letterLabel =
    letter?.label ||
    (testimonial.company
      ? `Completion Letter — ${testimonial.company}`
      : 'Completion Letter')

  return (
    <div
      className={cn(
        'relative bg-card rounded-lg border border-border',
        isFeatured ? 'p-8 md:p-10' : 'p-6',
      )}
    >
      {/* Decorative quote mark */}
      <svg
        className={cn(
          'absolute text-hydroera-blue/[0.06]',
          isFeatured ? 'top-6 left-6 w-16 h-16' : 'top-4 left-4 w-10 h-10',
        )}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M11.3 2.6c-4 1.2-7 5.3-7 9.7 0 3.3 2 5.7 4.7 5.7 2.3 0 4-1.7 4-4s-1.7-4-4-4c-.5 0-1 .1-1.4.3.5-2.5 2.5-4.8 4.9-5.8L11.3 2.6zM22.3 2.6c-4 1.2-7 5.3-7 9.7 0 3.3 2 5.7 4.7 5.7 2.3 0 4-1.7 4-4s-1.7-4-4-4c-.5 0-1 .1-1.4.3.5-2.5 2.5-4.8 4.9-5.8L22.3 2.6z" />
      </svg>

      {/* Company logo */}
      {showCompanyLogo &&
        testimonial.companyLogo &&
        typeof testimonial.companyLogo === 'object' && (
          <div className="mb-4">
            <Media
              resource={testimonial.companyLogo}
              imgClassName="h-6 w-auto object-contain opacity-50"
              className="h-6"
            />
          </div>
        )}

      {/* Rating */}
      {showRating && testimonial.rating && (
        <div className={cn('mb-4', isFeatured ? 'mb-5' : '')}>
          <StarRating rating={testimonial.rating} />
        </div>
      )}

      {/* Quote text */}
      <blockquote
        className={cn(
          'relative z-10 text-foreground leading-relaxed',
          isFeatured
            ? 'text-lg md:text-xl font-medium mb-8'
            : 'text-sm md:text-base mb-6',
        )}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <AuthorAvatar
          name={testimonial.authorName}
          size={isFeatured ? 'lg' : 'sm'}
        />
        <div>
          <p
            className={cn(
              'font-semibold text-foreground',
              isFeatured ? 'text-base' : 'text-sm',
            )}
          >
            {testimonial.authorName}
          </p>
          {(testimonial.authorRole || testimonial.company) && (
            <p className="text-xs md:text-sm text-muted-foreground">
              {[testimonial.authorRole, testimonial.company].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Completion letter download */}
      {hasPublicLetter && letterUrl && (
        <a
          href={letterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-hydroera-blue hover:text-hydroera-blue-dark transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          {letterLabel}
        </a>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Carousel layout                                                    */
/* ------------------------------------------------------------------ */
const CarouselLayout: React.FC<{
  testimonials: Testimonial[]
  showRating: boolean
  showCompanyLogo: boolean
  showCompletionLetters: boolean
}> = ({ testimonials, showRating, showCompanyLogo, showCompletionLetters }) => {
  const [current, setCurrent] = useState(0)
  const total = testimonials.length

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  // Auto-advance every 6s
  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, total])

  if (total === 0) return null

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((t, i) => (
            <div key={t.id || i} className="w-full flex-shrink-0 px-1">
              <div className="max-w-2xl mx-auto">
                <QuoteCard
                  testimonial={t}
                  variant="featured"
                  showRating={showRating}
                  showCompanyLogo={showCompanyLogo}
                  showCompletionLetters={showCompletionLetters}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="p-2 rounded-full border border-border hover:bg-accent transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === current
                    ? 'bg-hydroera-blue w-6'
                    : 'bg-border w-2 hover:bg-muted-foreground',
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2 rounded-full border border-border hover:bg-accent transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Exported client wrapper                                            */
/* ------------------------------------------------------------------ */
export const TestimonialsClient: React.FC<{
  testimonials: Testimonial[]
  layout: string
  heading?: string | null
  subheading?: string | null
  showRating: boolean
  showCompanyLogo: boolean
  showCompletionLetters: boolean
}> = ({
  testimonials,
  layout,
  heading,
  subheading,
  showRating,
  showCompanyLogo,
  showCompletionLetters,
}) => {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="container my-16">
      {/* Section header */}
      {(heading || subheading) && (
        <div className="max-w-2xl mx-auto text-center mb-12">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Layout variants */}
      {layout === 'carousel' && (
        <CarouselLayout
          testimonials={testimonials}
          showRating={showRating}
          showCompanyLogo={showCompanyLogo}
          showCompletionLetters={showCompletionLetters}
        />
      )}

      {layout === 'grid' && (
        <div
          className={cn('grid gap-6', {
            'grid-cols-1 sm:grid-cols-2': testimonials.length === 2,
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': testimonials.length >= 3,
          })}
        >
          {testimonials.map((t, i) => (
            <QuoteCard
              key={t.id || i}
              testimonial={t}
              showRating={showRating}
              showCompanyLogo={showCompanyLogo}
              showCompletionLetters={showCompletionLetters}
            />
          ))}
        </div>
      )}

      {layout === 'featured' && testimonials[0] && (
        <div className="max-w-3xl mx-auto">
          <QuoteCard
            testimonial={testimonials[0]}
            variant="featured"
            showRating={showRating}
            showCompanyLogo={showCompanyLogo}
            showCompletionLetters={showCompletionLetters}
          />
        </div>
      )}
    </section>
  )
}