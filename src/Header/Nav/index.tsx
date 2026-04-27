'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType; isTransparent?: boolean }> = ({
  data,
  isTransparent,
}) => {
  const navItems = data?.navItems || []

  return (
    /* ── Navigation wrapper ── */
    <nav className="flex items-center gap-1">

      {/* ── Nav links (from CMS global header → navItems) ── */}
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={`px-3 py-2 text-base font-medium transition-colors rounded-md hover:bg-black/5 ${
              isTransparent
                ? 'text-white/90 hover:text-white'
                : 'text-foreground/80 hover:text-primary'
            }`}
          />
        )
      })}

      {/* ── Search icon button ── */}
      <Link
        href="/search"
        className={`ml-2 p-2 rounded-md transition-colors hover:bg-black/5 ${
          isTransparent ? 'text-white/90 hover:text-white' : 'text-foreground/80 hover:text-primary'
        }`}
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 h-5" />
      </Link>
    </nav>
  )
}
