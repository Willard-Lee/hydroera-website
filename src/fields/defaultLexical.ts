import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  HeadingFeature,
  AlignFeature,
  IndentFeature,
  OrderedListFeature,
  UnorderedListFeature,
  ChecklistFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  lexicalEditor,
  UnderlineFeature,
  TextStateFeature,
  InlineToolbarFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    AlignFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    ChecklistFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
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
          muted: { label: 'Muted', css: { color: 'rgba(150,150,150,0.6)' } },
        },
      },
    }),
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true // no validation needed, as no url should exist for internal links
              }
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
  ],
})
