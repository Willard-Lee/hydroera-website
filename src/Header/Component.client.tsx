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
import { ThemeToggle } from '@/components/ThemeToggle'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  /* ── Reset header theme on route change ── */
  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  /* ── Sync header theme from hero (e.g. dark overlay hero sets theme to 'dark') ── */
  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  /* ── Track scroll position for sticky header background ── */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  /* ── Transparent mode: true when hero is dark AND user hasn't scrolled ── */
  const isTransparent = theme === 'dark' && !scrolled
  const logoVariant = isTransparent ? 'light' : 'dark'

  return (
    /* ── Sticky header bar ──
       - h-18 / md:h-20 → adjust these to change header height
       - bg-white/95 + backdrop-blur → scrolled background
       - bg-transparent → over dark hero images
    */
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-hydroera-slate-dark/95 backdrop-blur-md shadow-sm' /* ← scrolled: frosted glass bg */
          : isTransparent
            ? 'bg-transparent' /* ← transparent over dark hero */
            : 'bg-white dark:bg-hydroera-slate-dark' /* ← default solid bg */
      }`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        {/* ── Header height: change h-18 / md:h-20 to resize ── */}
        <div className="flex items-center justify-between h-18 md:h-20">

          {/* ══════ LEFT: Logo ══════ */}
          <Link href="/" className="shrink-0 relative z-10">
            <Logo loading="eager" priority="high" variant={logoVariant} />
          </Link>

          {/* ══════ CENTER: Desktop navigation links ══════ */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <HeaderNav data={data} isTransparent={isTransparent} />
          </div>

          {/* ══════ RIGHT: Theme toggle + CTA button + Mobile menu ══════ */}
          <div className="flex items-center gap-3 relative z-10">

            {/* Dark/Light mode toggle */}
            <ThemeToggle
              className={isTransparent ? 'text-white hover:bg-white/10' : 'text-foreground'}
            />

            {/* CTA button (desktop only, from CMS global header) */}
            {data.cta?.label && (
              <div className="hidden lg:block">
                <CMSLink
                  {...data.cta.link}
                  label={data.cta.label}
                  appearance="default" /* ← uses primary gradient button style */
                  size="default"
                />
              </div>
            )}

            {/* Mobile hamburger menu (visible below lg breakpoint) */}
            <div className="lg:hidden">
              <MobileNav data={data} isTransparent={isTransparent} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
