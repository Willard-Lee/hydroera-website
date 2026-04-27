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

  /* ── Track AdminBar height so the header offsets below it ── */
  const [adminBarHeight, setAdminBarHeight] = useState(0)

  useEffect(() => {
    const updateAdminBarHeight = () => {
      const adminBar = document.querySelector('.admin-bar:not(.hidden)') as HTMLElement | null
      setAdminBarHeight(adminBar ? adminBar.offsetHeight : 0)
    }

    updateAdminBarHeight()
    const observer = new MutationObserver(updateAdminBarHeight)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true })
    return () => observer.disconnect()
  }, [])

  /* ── Track scroll: hide on scroll down, show on scroll up; track if at top ── */
  const [atTop, setAtTop] = useState(true)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    setAtTop(currentScrollY <= 10)

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

  const isDarkHero = theme === 'dark'
  const isTransparent = atTop && isDarkHero

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        atTop
          ? isDarkHero
            ? 'bg-transparent text-white'
            : 'bg-white/80 backdrop-blur-md text-foreground'
          : 'bg-white shadow-sm text-foreground'
      }`}
      style={{ top: adminBarHeight }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ══════ LEFT: Logo ══════ */}
          <Link href="/" className="shrink-0 relative z-10">
            <Logo loading="eager" priority="high" variant={isTransparent ? 'light' : 'dark'} />
          </Link>

          {/* ══════ CENTER: Desktop navigation links ══════ */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <HeaderNav data={data} isTransparent={isTransparent} />
          </div>

          {/* ══════ RIGHT: Theme toggle + CTA button + Mobile menu ══════ */}
          <div className="flex items-center gap-3 relative z-10">

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
