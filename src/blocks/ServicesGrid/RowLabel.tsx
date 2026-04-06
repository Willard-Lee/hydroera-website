'use client'

import { useRowLabel } from '@payloadcms/ui'

export const ServicesGridRowLabel = () => {
  const { data } = useRowLabel<{ title?: string; icon?: string }>()

  const label = data?.title || 'Untitled Service'
  const icon = data?.icon ? ` (${data.icon})` : ''

  return <span>{`${label}${icon}`}</span>
}

//  A small admin UI helper that shows the service title + icon type in the collapsed array
// so staff can see which card is which at a glance without expanding them.