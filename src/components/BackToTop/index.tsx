'use client'

import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/utilities/ui'

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        'fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-hydroera-blue text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-hydroera-blue-dark hover:shadow-xl hover:-translate-y-0.5',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      )}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
