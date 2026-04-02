'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { MobileNav } from './MobileNav'
import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const isTransparent = theme === 'dark' && !scrolled
  const logoVariant = isTransparent ? 'light' : 'dark'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-hydroera-slate-dark/95 backdrop-blur-md shadow-sm'
          : isTransparent
            ? 'bg-transparent'
            : 'bg-white dark:bg-hydroera-slate-dark'
      }`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="flex items-center justify-between h-18 md:h-20">
          {/* Logo — Left */}
          <Link href="/" className="shrink-0 relative z-10">
            <Logo loading="eager" priority="high" variant={logoVariant} />
          </Link>

          {/* Desktop Nav — Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <HeaderNav data={data} isTransparent={isTransparent} />
          </div>

          {/* CTA + Mobile Toggle — Right */}
          <div className="flex items-center gap-4 relative z-10">
            {data.cta?.label && (
              <div className="hidden lg:block">
                <CMSLink
                  {...data.cta.link}
                  label={data.cta.label}
                  appearance="default"
                  size="default"
                />
              </div>
            )}
            <div className="lg:hidden">
              <MobileNav data={data} isTransparent={isTransparent} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
