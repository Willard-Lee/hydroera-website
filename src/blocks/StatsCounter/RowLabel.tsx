'use client'

import { useRowLabel } from '@payloadcms/ui'

export const StatsCounterRowLabel = () => {
  const { data } = useRowLabel<{ label?: string; value?: number; suffix?: string }>()

  const value = data?.value ?? ''
  const suffix = data?.suffix ?? ''
  const label = data?.label || 'Untitled Stat'

  return <span>{`${value}${suffix} — ${label}`}</span>
}