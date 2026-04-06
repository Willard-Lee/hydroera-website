import type { Block } from 'payload'

import { link } from '@/fields/link'

export const LogoGrid: Block = {
  slug: 'logoGrid',
  interfaceName: 'LogoGridBlock',
  labels: {
    plural: 'Logo Grids',
    singular: 'Logo Grid',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small uppercase label (e.g. "TRUSTED BY")',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Section heading (e.g. "Our Partners & Principals")',
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
      name: 'style',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Inline marquee', value: 'marquee' },
      ],
      admin: {
        description: 'Grid shows all logos at once. Marquee auto-scrolls horizontally.',
      },
    },
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      maxRows: 30,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Logo image — transparent PNG recommended, ideally 200-400px wide.',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Company/brand name — used as alt text and tooltip.',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Optional link to the partner website.',
          },
        },
      ],
    },
    {
      name: 'enableCta',
      type: 'checkbox',
      label: 'Show CTA link',
      defaultValue: false,
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        name: 'ctaLink',
        label: 'CTA Link',
        admin: {
          condition: (_data, siblingData) => Boolean(siblingData?.enableCta),
        },
      },
    }),
  ],
}
