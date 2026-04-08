import React from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/ui'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type CMSImageProps = {
  media: Media | string | null | undefined
  className?: string
  imgClassName?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
}

export const CMSImage: React.FC<CMSImageProps> = ({
  media,
  className,
  imgClassName,
  fill,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
}) => {
  if (!media || typeof media !== 'object') return null
  if (!media.mimeType?.startsWith('image/')) return null

  const rawUrl = media.url
  const url = rawUrl?.startsWith('http') ? rawUrl : getMediaUrl(rawUrl)
  if (!url) return null

  const alt = media.alt || ''

  if (fill) {
    return (
      <div className={cn('relative', className)}>
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', imgClassName)}
        />
      </div>
    )
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width || media.width || 800}
      height={height || media.height || 600}
      sizes={sizes}
      priority={priority}
      className={cn(className, imgClassName)}
    />
  )
}
