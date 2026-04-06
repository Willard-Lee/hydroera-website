import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const MediaContentAccordion: Block = {
  slug: 'mediaContentAccordion',
  interfaceName: 'MediaContentAccordionBlock',
  labels: {
    plural: 'Media Content Accordions',
    singular: 'Media Content Accordion',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small uppercase label above the heading',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Section heading',
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image displayed alongside the accordion items',
      },
    },
    {
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Media on Left', value: 'left' },
        { label: 'Media on Right', value: 'right' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Accordion Items',
      minRows: 1,
      maxRows: 10,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Accordion item heading — shown when collapsed',
          },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
          admin: {
            description: 'Content shown when expanded',
          },
        },
      ],
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'grey' },
      ],
    },
  ],
}
