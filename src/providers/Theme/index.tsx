'use client'

import React, { createContext, use, useEffect } from 'react'

import type { ThemeContextType } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: 'light',
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  return <ThemeContext value={{ setTheme: () => null, theme: 'light' }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
