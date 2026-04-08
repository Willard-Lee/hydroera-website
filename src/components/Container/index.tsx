import React from 'react'
import { cn } from '@/utilities/ui'

type ContainerProps = {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide'
}

const sizeClasses: Record<string, string> = {
  default: 'max-w-7xl',
  narrow: 'max-w-4xl',
  wide: 'max-w-[1400px]',
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'default',
}) => {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  )
}
