'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-end text-white min-h-[50vh] overflow-hidden"
      data-theme="dark"
    >
      {/* Background image with dark overlay */}
      {media && typeof media === 'object' && (
        <>
          <Media fill imgClassName="object-cover -z-20" priority resource={media} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1120]/90 via-[#0b1120]/70 to-[#0b1120]/40" />
        </>
      )}

      {/* Fallback solid background when no image */}
      {(!media || typeof media !== 'object') && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1120] via-[#0f1d3a] to-[#162449]" />
      )}

      {/* Content */}
      <div className="container z-10 relative pb-14 pt-48">
        <div className="max-w-[42rem]">
          {richText && (
            <RichText
              className="[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-6xl [&_h1]:font-bold [&_h1]:leading-[1.1] [&_h1]:tracking-tight [&_p]:text-base [&_p]:md:text-lg [&_p]:text-white/60 [&_p]:mt-5 [&_p]:max-w-[36rem]"
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4 mt-6">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink
                    {...link}
                    className={
                      i === 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                        : 'bg-transparent hover:bg-white/10 text-white border border-white/30'
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
