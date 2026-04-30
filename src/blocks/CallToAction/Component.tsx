import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

const bgClasses: Record<string, string> = {
  dark: 'bg-hydroera-slate-dark text-white',
  gradient: 'bg-gradient-to-br from-[#0b1120] via-[#0f1d3a] to-[#1a3564] text-white',
  blue: 'bg-hydroera-blue text-white',
  light: 'bg-secondary text-foreground',
}

export const CallToActionBlock: React.FC<CTABlockProps> = ({ background, links, richText }) => {
  const bg = background || 'dark'
  const isDark = bg !== 'light'

  return (
    <section className={cn('py-16 md:py-20', bgClasses[bg])}>
      <div className="container text-center">
        <div className="max-w-3xl mx-auto">
          {richText && (
            <RichText
              className={cn(
                'mb-0 [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mb-4',
                isDark
                  ? '[&_p]:text-white/70'
                  : '[&_p]:text-muted-foreground',
              )}
              data={richText}
              enableGutter={false}
            />
          )}
          {(links || []).length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              {links!.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  size="lg"
                  {...link}
                  className={
                    link.appearance === 'outline' && isDark
                      ? 'border-white/30 bg-transparent text-white hover:bg-white/10'
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
