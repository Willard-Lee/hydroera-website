import type { Block } from 'payload'

export const Download: Block = {
  slug: 'download',
  interfaceName: 'DownloadBlock',
  labels: {
    plural: 'Download Sections',
    singular: 'Download Section',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small uppercase label (e.g. "RESOURCES")',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Section heading (e.g. "Downloads & Resources")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short intro text below the heading',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Card grid', value: 'grid' },
        { label: 'Compact list', value: 'list' },
      ],
    },
    {
      name: 'files',
      type: 'array',
      label: 'Downloadable files',
      minRows: 1,
      maxRows: 20,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Display name (e.g. "EBARA Product Catalogue 2024")',
          },
        },
        {
          name: 'fileType',
          type: 'select',
          defaultValue: 'pdf',
          options: [
            { label: 'PDF', value: 'pdf' },
            { label: 'Spreadsheet', value: 'xls' },
            { label: 'Image', value: 'image' },
            { label: 'CAD / Drawing', value: 'cad' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            description: 'File type — controls the icon shown on the card.',
          },
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'The file to download.',
          },
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional preview thumbnail (shown in grid layout). Falls back to a file type icon if empty.',
          },
        },
        {
          name: 'fileSize',
          type: 'text',
          admin: {
            description: 'Optional file size label (e.g. "2.4 MB")',
          },
        },
      ],
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'grey' },
      ],
    },
  ],
}
