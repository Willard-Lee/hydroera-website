import type { Block } from 'payload'

export const TrustBand: Block = {
  slug: 'trustBand',
  interfaceName: 'TrustBandBlock',
  labels: {
    plural: 'Trust Bands',
    singular: 'Trust Band',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above stats (e.g. "WHY CHOOSE US")',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Section heading (e.g. "Trusted Across Malaysia")',
      },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      minRows: 2,
      maxRows: 4,
      required: true,
      admin: {
        initCollapsed: true,
        description: 'Key numbers that build credibility (e.g. years, projects, clients)',
      },
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          admin: { description: 'The number (e.g. 25, 500)', step: 1 },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: { description: 'After the number (e.g. "+", "%", " years")', width: '50%' },
        },
        {
          name: 'prefix',
          type: 'text',
          admin: { description: 'Before the number (e.g. ">", "$")', width: '50%' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'Description (e.g. "Years of Experience")' },
        },
      ],
    },
    {
      name: 'showLogos',
      type: 'checkbox',
      label: 'Show partner logos below stats',
      defaultValue: true,
    },
    {
      name: 'logosLabel',
      type: 'text',
      defaultValue: 'Trusted by leading brands',
      admin: {
        description: 'Label above the logo strip',
        condition: (_data, siblingData) => Boolean(siblingData?.showLogos),
      },
    },
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      maxRows: 20,
      admin: {
        initCollapsed: true,
        condition: (_data, siblingData) => Boolean(siblingData?.showLogos),
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Logo image — transparent PNG, white version recommended for dark background.' },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Brand name (alt text)' },
        },
      ],
    },
  ],
}
