'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useCallback, useRef } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { MobileNav } from './MobileNav'
import { CMSLink } from '@/components/Link'
import { ThemeToggle } from '@/components/ThemeToggle'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const lastScrollY = useRef(0)

  /* ── Reset header theme on route change ── */
  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  /* ── Sync header theme from hero ── */
  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  /* ── Track scroll: hide on scroll down, show on scroll up ── */
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    if (currentScrollY > 100) {
      setHidden(currentScrollY > lastScrollY.current)
    } else {
      setHidden(false)
    }

    lastScrollY.current = currentScrollY
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <header
      className={`sticky top-0 z-50 transition-transform duration-300 bg-white dark:bg-hydroera-slate-dark shadow-sm ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-18 md:h-20">

          {/* ══════ LEFT: Logo ══════ */}
          <Link href="/" className="shrink-0 relative z-10">
            <Logo loading="eager" priority="high" />
          </Link>

          {/* ══════ CENTER: Desktop navigation links ══════ */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <HeaderNav data={data} />
          </div>

          {/* ══════ RIGHT: Theme toggle + CTA button + Mobile menu ══════ */}
          <div className="flex items-center gap-3 relative z-10">

            {/* Dark/Light mode toggle */}
            <ThemeToggle />

            {/* CTA button (desktop only) */}
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

            {/* Mobile hamburger menu */}
            <div className="lg:hidden">
              <MobileNav data={data} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
