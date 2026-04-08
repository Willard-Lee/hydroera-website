import React from 'react'
import { cn } from '@/utilities/ui'

type SectionProps = {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'grey' | 'blue' | 'dark' | null
  spacing?: 'sm' | 'md' | 'lg' | null
  id?: string
}

const bgClasses: Record<string, string> = {
  white: 'bg-background',
  grey: 'bg-muted/50',
  blue: 'bg-hydroera-blue text-white',
  dark: 'bg-[#0b1120] text-white',
}

const spacingClasses: Record<string, string> = {
  sm: 'py-10 md:py-12',
  md: 'py-14 md:py-20',
  lg: 'py-20 md:py-28',
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  background = 'white',
  spacing = 'md',
  id,
}) => {
  return (
    <section
      id={id}
      className={cn(
        spacingClasses[spacing || 'md'],
        bgClasses[background || 'white'],
        className,
      )}
    >
      {children}
    </section>
  )
}
