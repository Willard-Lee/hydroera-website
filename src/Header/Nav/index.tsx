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
    <nav className="flex items-center gap-1">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-black/5 dark:hover:bg-white/10 ${
              isTransparent
                ? 'text-white/90 hover:text-white'
                : 'text-foreground/80 hover:text-foreground'
            }`}
          />
        )
      })}
      <Link
        href="/search"
        className={`ml-2 p-2 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
          isTransparent ? 'text-white/90 hover:text-white' : 'text-foreground/80 hover:text-foreground'
        }`}
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-4 h-4" />
      </Link>
    </nav>
  )
}
