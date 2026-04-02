'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const MobileNav: React.FC<{ data: HeaderType; isTransparent?: boolean }> = ({
  data,
  isTransparent,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-md transition-colors ${
          isTransparent
            ? 'text-white hover:bg-white/10'
            : 'text-foreground hover:bg-black/5 dark:hover:bg-white/10'
        }`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Full-screen overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-0 z-40 bg-white dark:bg-hydroera-slate-dark">
          <div className="container pt-24 pb-8">
            <nav className="flex flex-col gap-1">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="link"
                  className="block py-3 px-4 text-lg font-medium text-foreground hover:bg-accent rounded-md transition-colors no-underline"
                />
              ))}
              <Link
                href="/search"
                className="flex items-center gap-3 py-3 px-4 text-lg font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <SearchIcon className="w-5 h-5" />
                Search
              </Link>
            </nav>

            {data.cta?.label && (
              <div className="mt-8 px-4">
                <CMSLink
                  {...data.cta.link}
                  label={data.cta.label}
                  appearance="default"
                  size="lg"
                  className="w-full justify-center"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
