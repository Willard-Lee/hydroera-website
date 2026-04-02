import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Footer brand logo (light version recommended for dark background)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief company description shown below the logo',
      },
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Link Columns',
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Column heading (e.g. "Company", "Services")',
          },
        },
        {
          name: 'links',
          type: 'array',
          maxRows: 8,
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Phone number (e.g. +60 12-345 6789)',
          },
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'address',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'WhatsApp', value: 'whatsapp' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Profile URL',
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: 'HydroEra Sdn Bhd. All rights reserved.',
      admin: {
        description: 'Copyright text shown in the bottom bar',
      },
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links (Bottom Bar)',
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
