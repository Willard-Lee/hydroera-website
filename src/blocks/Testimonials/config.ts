import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    plural: 'Testimonials',
    singular: 'Testimonials',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional section heading (e.g. "What Our Clients Say")',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        description: 'Optional text below the heading',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'carousel',
      required: true,
      options: [
        { label: 'Carousel (one at a time)', value: 'carousel' },
        { label: 'Grid (all visible)', value: 'grid' },
        { label: 'Featured (large single quote)', value: 'featured' },
      ],
      admin: {
        description: 'How the testimonials are displayed',
      },
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Auto (featured / latest)', value: 'collection' },
        { label: 'Hand-pick testimonials', value: 'selection' },
      ],
      admin: {
        description: '"Auto" pulls featured or most recent testimonials. "Hand-pick" lets you choose specific ones.',
      },
    },
    {
      name: 'onlyFeatured',
      type: 'checkbox',
      label: 'Only show featured testimonials',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
        description: 'When checked, only testimonials marked as "Featured" will appear.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
        step: 1,
        description: 'Maximum number of testimonials to show',
      },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Choose testimonials',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
        description: 'Select specific testimonials to display',
      },
    },
    {
      name: 'showCompletionLetters',
      type: 'checkbox',
      label: 'Show completion letter downloads',
      defaultValue: false,
      admin: {
        description: 'Display a download button for public completion letters (surat penyelesaian)',
      },
    },
    {
      name: 'showRating',
      type: 'checkbox',
      label: 'Show star ratings',
      defaultValue: true,
      admin: {
        description: 'Display the star rating when available',
      },
    },
    {
      name: 'showCompanyLogo',
      type: 'checkbox',
      label: 'Show company logos',
      defaultValue: true,
      admin: {
        description: 'Display the client company logo alongside the quote',
      },
    },
  ],
};