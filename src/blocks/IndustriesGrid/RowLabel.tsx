'use client'

import type { PayloadClientReactComponent, RowLabelComponent } from 'payload'
import { useRowLabel } from '@payloadcms/ui'

export const IndustriesGridRowLabel: PayloadClientReactComponent<RowLabelComponent> = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <div>{data?.title || `Industry ${String(rowNumber).padStart(2, '0')}`}</div>
}
