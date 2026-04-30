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
      name: 'label',
      type: 'text',
      defaultValue: 'Trusted by leading brands',
      admin: {
        description: 'Text displayed above the logos (e.g. "Trusted by", "Our Partners")',
      },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Gray', value: 'gray' },
        { label: 'Dark', value: 'dark' },
        { label: 'Dark Gradient', value: 'gradient' },
      ],
      admin: {
        description: 'Background color of the trust band section',
      },
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      minRows: 1,
      maxRows: 20,
      required: true,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Company logo — transparent PNG recommended' },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Company name (used for alt text and hover tooltip)' },
        },
      ],
    },
  ],
}
