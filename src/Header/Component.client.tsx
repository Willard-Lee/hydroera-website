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
  const [scrolled, setScrolled] = useState(false)
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

  /* ── Check if admin bar is visible and offset header accordingly ── */
  const [adminBarHeight, setAdminBarHeight] = useState(0)

  useEffect(() => {
    const checkAdminBar = () => {
      const adminBar = document.querySelector('.admin-bar:not(.hidden)')
      setAdminBarHeight(adminBar ? adminBar.getBoundingClientRect().height : 0)
    }
    checkAdminBar()
    const observer = new MutationObserver(checkAdminBar)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true })
    return () => observer.disconnect()
  }, [])

  /* ── Track scroll: hide on scroll down, show on scroll up ── */
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    setScrolled(currentScrollY > 20)

    if (currentScrollY > 100) {
      setHidden(currentScrollY > lastScrollY.current && currentScrollY > 100)
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

  /* ── Transparent mode: true when hero is dark AND user hasn't scrolled ── */
  const isTransparent = theme === 'dark' && !scrolled
  const logoVariant = isTransparent ? 'light' : 'dark'

  return (
    <header
      style={{ top: adminBarHeight > 0 ? `${adminBarHeight}px` : undefined }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hidden
          ? '-translate-y-full' /* ← hidden when scrolling down */
          : 'translate-y-0'
      } ${
        scrolled
          ? 'bg-white/80 dark:bg-hydroera-slate-dark/95 backdrop-blur-md shadow-sm'
          : isTransparent
            ? 'bg-transparent'
            : 'bg-white dark:bg-hydroera-slate-dark'
      }`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
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
              <MobileNav data={data} isTransparent={isTransparent} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
