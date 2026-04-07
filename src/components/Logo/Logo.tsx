import { cn } from '@/utilities/ui'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'light' | 'dark'
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    variant = 'dark',
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="HydroEra Logo"
      width={150}
      height={66}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={cn(
        'w-auto h-12', // adjust logo size here
        variant === 'light' && 'brightness-0 invert',
        className,
      )}
      src="/media/hydroera-logo.png"
    />
  )
}
