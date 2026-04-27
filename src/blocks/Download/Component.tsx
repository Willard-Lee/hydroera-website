'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { Download as DownloadIcon, FileText, FileSpreadsheet, Image, PenTool, File } from 'lucide-react'
import { Media } from '@/components/Media'
import type { DownloadBlock as DownloadBlockProps, Media as MediaType } from '@/payload-types'

type FileItem = NonNullable<DownloadBlockProps['files']>[number]

function getMediaUrl(media: number | MediaType | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

const fileTypeIcons: Record<string, React.FC<{ className?: string }>> = {
  pdf: FileText,
  xls: FileSpreadsheet,
  image: Image,
  cad: PenTool,
  other: File,
}

const fileTypeColors: Record<string, string> = {
  pdf: 'bg-red-50 text-red-600',
  xls: 'bg-green-50 text-green-600',
  image: 'bg-purple-50 text-purple-600',
  cad: 'bg-amber-50 text-amber-600',
  other: 'bg-muted text-muted-foreground',
}

function FileCard({ item, layout }: { item: FileItem; layout: 'grid' | 'list' }) {
  const downloadUrl = getMediaUrl(item.file)
  const Icon = fileTypeIcons[item.fileType ?? 'other'] ?? File
  const colorClass = fileTypeColors[item.fileType ?? 'other'] ?? fileTypeColors.other

  if (!downloadUrl) return null

  if (layout === 'list') {
    return (
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="flex items-center gap-4 px-5 py-4 rounded-lg border border-border bg-white hover:border-hydroera-blue/30 hover:shadow-sm transition-all group"
      >
        <div className={cn('shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate group-hover:text-hydroera-blue transition-colors">
            {item.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {(item.fileType ?? 'other').toUpperCase()}
            {item.fileSize ? ` · ${item.fileSize}` : ''}
          </p>
        </div>
        <DownloadIcon className="w-4 h-4 text-muted-foreground group-hover:text-hydroera-blue transition-colors shrink-0" />
      </a>
    )
  }

  // Grid card
  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="group flex flex-col rounded-lg border border-border bg-white overflow-hidden hover:border-hydroera-blue/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Thumbnail or icon */}
      <div className="aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
        {item.thumbnail && typeof item.thumbnail === 'object' ? (
          <Media
            resource={item.thumbnail}
            imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={cn('w-16 h-16 rounded-xl flex items-center justify-center', colorClass)}>
            <Icon className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-hydroera-blue transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-auto">
          {(item.fileType ?? 'other').toUpperCase()}
          {item.fileSize ? ` · ${item.fileSize}` : ''}
        </p>
      </div>

      {/* Download bar */}
      <div className="px-4 pb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-hydroera-blue">
          <DownloadIcon className="w-3.5 h-3.5" />
          Download
        </span>
      </div>
    </a>
  )
}

export const DownloadBlock: React.FC<DownloadBlockProps & { id?: string }> = (props) => {
  const { id, eyebrow, heading, description, layout, files, background } = props

  if (!files || files.length === 0) return null

  return (
    <section
      className={cn('py-16 md:py-24', {
        'bg-white': background === 'white',
        'bg-secondary': background === 'grey',
      })}
      id={id ? `block-${id}` : undefined}
    >
      <div className="container">
        {/* Header */}
        {(eyebrow || heading || description) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{heading}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {/* Grid layout */}
        {layout === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((item, i) => (
              <FileCard key={item.id || i} item={item} layout="grid" />
            ))}
          </div>
        )}

        {/* List layout */}
        {layout === 'list' && (
          <div className="flex flex-col gap-3 max-w-3xl">
            {files.map((item, i) => (
              <FileCard key={item.id || i} item={item} layout="list" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
