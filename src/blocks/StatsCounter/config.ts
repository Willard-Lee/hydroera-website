import type { Block } from 'payload'

export const StatsCounter: Block = {
  slug: 'statsCounter',
  interfaceName: 'StatsCounterBlock',
  labels: {
    plural: 'Stats Counters',
    singular: 'Stats Counter',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading above the stats (e.g. "HydroEra in Numbers")',
      },
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'light',
      required: true,
      options: [
        { label: 'Light (white background)', value: 'light' },
        { label: 'Dark (blue background)', value: 'dark' },
        { label: 'Slate (dark grey background)', value: 'slate' },
      ],
      admin: {
        description: 'Choose the background style for this section',
      },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      minRows: 1,
      maxRows: 4,
      required: true,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/StatsCounter/RowLabel#StatsCounterRowLabel',
        },
        description: 'Add up to 4 statistics to display',
      },
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          admin: {
            description: 'The number to display (e.g. 25, 500, 98)',
            step: 1,
          },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: {
            description: 'Text after the number (e.g. "+", "%", "M", " years")',
            width: '50%',
          },
        },
        {
          name: 'prefix',
          type: 'text',
          admin: {
            description: 'Text before the number (e.g. "$", ">" )',
            width: '50%',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Description below the number (e.g. "Years of Experience")',
          },
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Trophy / Award', value: 'trophy' },
            { label: 'Users / Team', value: 'users' },
            { label: 'Globe / Global', value: 'globe' },
            { label: 'Check / Completed', value: 'check' },
            { label: 'Building / Projects', value: 'building' },
            { label: 'Star / Rating', value: 'star' },
            { label: 'Clock / Years', value: 'clock' },
            { label: 'Zap / Energy', value: 'zap' },
          ],
          defaultValue: 'none',
          admin: {
            description: 'Optional icon displayed above the number',
          },
        },
      ],
    },
  ],
}