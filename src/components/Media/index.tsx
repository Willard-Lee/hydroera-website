import React, { Fragment } from 'react'

import type { Props } from './types'


import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const mimeType = typeof resource === 'object' ? resource?.mimeType : undefined
  const isVideo = mimeType?.includes('video')
  const isImage = !mimeType || mimeType.startsWith('image/')
  const Tag = htmlElement || Fragment

  if (!isVideo && !isImage) return null

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  )
}
