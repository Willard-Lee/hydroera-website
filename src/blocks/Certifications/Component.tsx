import React from 'react'
import type { CertificationsBlock as CertificationsBlockProps } from '@/payload-types'
import { CertificationsClient } from './Client'

export const CertificationsBlock: React.FC<CertificationsBlockProps & { id?: string }> = (
  props,
) => {
  const { id, eyebrow, heading, description, layout, certificates } = props

  if (!certificates || certificates.length === 0) return null

  return (
    <div id={id ? `block-${id}` : undefined}>
      <CertificationsClient
        eyebrow={eyebrow}
        heading={heading}
        description={description}
        layout={layout ?? 'carousel'}
        certificates={certificates}
      />
    </div>
  )
}
