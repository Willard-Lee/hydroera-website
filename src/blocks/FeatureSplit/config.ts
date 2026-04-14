import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const FeatureSplit: Block = {
  slug: 'featureSplit',
  interfaceName: 'FeatureSplitBlock',
  labels: {
    plural: 'Feature Splits',
    singular: 'Feature Split',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small uppercase label above the heading (e.g. "ABOUT HYDROERA")',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1','h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Content',
      admin: {
        description: 'Main heading and paragraph text for this section',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlight Points',
      maxRows: 5,
      admin: {
        initCollapsed: true,
        description: 'Checkmark bullet points shown below the text (e.g. "Certified Technical Authority")',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Bold title (e.g. "Certified Technical Authority")',
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Short description below the title',
          },
        },
      ],
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      label: 'Add a CTA button',
      defaultValue: true,
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        admin: {
          condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image for this section (landscape recommended, min 800px wide)',
      },
    },
    {
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Image on Left', value: 'left' },
        { label: 'Image on Right', value: 'right' },
      ],
      admin: {
        description: 'Which side the image appears on (text goes on the other side)',
      },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'grey' },
        { label: 'Dark (blue)', value: 'dark' },
      ],
      admin: {
        description: 'Background colour for this section',
      },
    },
  ],
}