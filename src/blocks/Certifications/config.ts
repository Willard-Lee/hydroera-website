import type { Block } from 'payload'

export const Certifications: Block = {
  slug: 'certifications',
  interfaceName: 'CertificationsBlock',
  labels: {
    plural: 'Certifications',
    singular: 'Certifications',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small uppercase label (e.g. "CERTIFICATIONS & AUTHORIZATIONS")',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Section heading (e.g. "Our Credentials")',
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
      defaultValue: 'carousel',
      options: [
        { label: 'Carousel (horizontal scroll with arrows)', value: 'carousel' },
        { label: 'Grid (all visible)', value: 'grid' },
      ],
    },
    {
      name: 'certificates',
      type: 'array',
      minRows: 1,
      maxRows: 20,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Certificate name (e.g. "EBARA SS Centre Appointment Letter")',
          },
        },
        {
          name: 'issuingBody',
          type: 'text',
          admin: {
            description: 'Who issued this (e.g. "EBARA Corporation", "SPAN", "CIDB")',
          },
        },
        {
          name: 'year',
          type: 'text',
          admin: {
            description: 'Year issued or valid period (e.g. "2023", "2023-2026")',
          },
        },
        {
          name: 'certificateImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description:
              'Upload a scan/photo of the certificate (JPG, PNG, or PDF). This is the main display image shown in the card.',
          },
        },
        {
          name: 'certificateFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional separate PDF file for download. If not provided, the certificate image will be used as the download link instead.',
          },
        },
        {
          name: 'enableDownload',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow visitors to download this certificate',
          },
        },
      ],
    },
  ],
}
