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
        description: 'Small label above the heading (e.g. "What We Do")',
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
        { label: '2-Column Grid', value: 'twoColumn' },
        { label: '3-Column Grid', value: 'threeColumn' },
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
            description: 'Optional image for this service card. If set, the icon is hidden.',
          },
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Pump', value: 'pump' },
            { label: 'Maintenance / Wrench', value: 'maintenance' },
            { label: 'Installation / Settings', value: 'installation' },
            { label: 'Consulting / Lightbulb', value: 'consulting' },
            { label: 'Water Treatment / Droplets', value: 'waterTreatment' },
            { label: 'Testing / Gauge', value: 'testing' },
            { label: 'Engineering / Cog', value: 'engineering' },
            { label: 'Support / Headset', value: 'support' },
            { label: 'Delivery / Truck', value: 'delivery' },
            { label: 'Safety / Shield', value: 'safety' },
          ],
          admin: {
            description: 'Pick an icon (only shown when no image is uploaded)',
            condition: (_data, siblingData) => !siblingData?.image,
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
