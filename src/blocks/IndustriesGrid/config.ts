import type { Block } from 'payload'

export const IndustriesGrid: Block = {
  slug: 'industriesGrid',
  interfaceName: 'IndustriesGridBlock',
  labels: {
    plural: 'Industries Grids',
    singular: 'Industries Grid',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading (e.g. "Industries We Serve")',
        placeholder: 'Industries We Serve',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main section heading',
        placeholder: 'Trusted Across Industries',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        description: 'Optional supporting text below the heading',
      },
    },
    {
      name: 'industries',
      type: 'array',
      label: 'Industry Cards',
      minRows: 1,
      maxRows: 12,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/IndustriesGrid/RowLabel#IndustriesGridRowLabel',
        },
        description: 'Add industry cards with photos to display in the grid',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Background photo for this industry card',
          },
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Water Drop', value: 'water' },
            { label: 'Factory / Industrial', value: 'factory' },
            { label: 'Building / Commercial', value: 'building' },
            { label: 'Agriculture / Leaf', value: 'agriculture' },
            { label: 'Oil & Gas / Flame', value: 'oilgas' },
            { label: 'Power / Lightning', value: 'power' },
            { label: 'Mining / Mountain', value: 'mining' },
            { label: 'Government / Shield', value: 'government' },
            { label: 'Hospitality / Hotel', value: 'hospitality' },
            { label: 'Construction / Crane', value: 'construction' },
          ],
          admin: {
            description: 'Choose an icon that represents this industry',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Industry name (e.g. "Water & Wastewater Treatment")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 200,
          admin: {
            description: 'Short description of how HydroEra serves this industry (max 200 chars)',
          },
        },
      ],
    },
  ],
}
