'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-end bg-[#0b1120] text-white min-h-[85vh]"
      data-theme="dark"
    >
      <div className="container z-10 relative pb-16 pt-40">
        <div className="max-w-[48rem]">
          {richText && (
            <RichText
              className="mb-8 [&_h1]:text-5xl [&_h1]:md:text-6xl [&_h1]:lg:text-7xl [&_h1]:font-bold [&_h1]:leading-[1.1] [&_h1]:tracking-tight [&_p]:text-lg [&_p]:text-white/60 [&_p]:mt-6 [&_p]:max-w-[40rem]"
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4 mt-8">
              {links.map(({ link }, i) => {
                return (
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
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
