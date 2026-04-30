import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  TextStateFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      admin: {
        description: 'Breadcrumb trail displayed above the heading',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'URL path to link to (e.g. "/", "/about", "/products"). Leave empty for the current page (last item).',
          },
        },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading (e.g. "Leading Pump Solutions in Malaysia")',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
    },
    {
      name: 'textAlignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Alignment of the hero text content',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
    },
    {
      name: 'overlayOpacity',
      type: 'select',
      defaultValue: '60',
      options: [
        { label: 'None', value: '0' },
        { label: 'Light (30%)', value: '30' },
        { label: 'Medium (60%)', value: '60' },
        { label: 'Heavy (80%)', value: '80' },
        { label: 'Full (100%)', value: '100' },
      ],
      admin: {
        description: 'Darkness of the overlay on the background image',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            TextStateFeature({
              state: {
                color: {
                  white: { label: 'White', css: { color: '#ffffff' } },
                  blue: { label: 'Blue', css: { color: '#0B4F8A' } },
                  'light-blue': { label: 'Light Blue', css: { color: '#2196F3' } },
                  cyan: { label: 'Cyan', css: { color: '#06B6D4' } },
                  green: { label: 'Green', css: { color: '#22C55E' } },
                  yellow: { label: 'Yellow', css: { color: '#EAB308' } },
                  red: { label: 'Red', css: { color: '#EF4444' } },
                  muted: { label: 'Muted', css: { color: 'rgba(255,255,255,0.6)' } },
                },
              },
            }),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'showStats',
      type: 'checkbox',
      label: 'Show stats in hero',
      defaultValue: false,
      admin: {
        description: 'Display key numbers (e.g. years of experience, projects) inside the hero section',
        condition: (_, { type } = {}) => type === 'highImpact',
      },
    },
    {
      name: 'heroStats',
      type: 'array',
      label: 'Hero Statistics',
      minRows: 2,
      maxRows: 4,
      admin: {
        initCollapsed: true,
        condition: (_, { type, showStats } = {}) => type === 'highImpact' && Boolean(showStats),
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
          admin: { description: 'After the number (e.g. "+", "%")' },
        },
        {
          name: 'prefix',
          type: 'text',
          admin: { description: 'Before the number (e.g. ">", "$")' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'Description (e.g. "Years of Experience")' },
        },
      ],
    },
  ],
  label: false,
}
