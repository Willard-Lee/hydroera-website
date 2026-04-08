import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ServicesGrid: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  labels: {
    plural: 'Services Grids',
    singular: 'Services Grid',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading (e.g. "Our Services")',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main section heading (e.g. "Our Services")',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        description: 'Optional text that appears below the heading',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'threeColumn',
      options: [
        { label: '3-Column Grid', value: 'threeColumn' },
        { label: '2-Column Grid', value: 'twoColumn' },
        { label: '4-Column Grid', value: 'fourColumn' },
      ],
      admin: {
        description: 'Choose how the service cards are arranged',
      },
    },
    {
      name: 'services',
      type: 'array',
      label: 'Service Cards',
      minRows: 1,
      maxRows: 12,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/ServicesGrid/RowLabel#ServicesGridRowLabel',
        },
        description: 'Add service cards that will appear in the grid',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image for this service card',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Service name (e.g. "Pump Installation")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          maxLength: 200,
          admin: {
            description: 'Short description of this service (max 200 characters)',
          },
        },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: 'Add a link',
          admin: {
            description: 'Enable to link this card to a page or URL',
          },
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
            },
          },
        }),
      ],
    },
  ],
}
