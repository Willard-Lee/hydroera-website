import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ProjectsShowcase: Block = {
  slug: 'projectsShowcase',
  interfaceName: 'ProjectsShowcaseBlock',
  labels: {
    plural: 'Project Showcases',
    singular: 'Project Showcase',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small uppercase label (e.g. "OUR PROJECTS")',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Section heading (e.g. "Recent Completed Projects")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short intro text below the heading',
      },
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Auto (featured / latest)', value: 'collection' },
        { label: 'Hand-pick projects', value: 'selection' },
      ],
    },
    {
      name: 'onlyFeatured',
      type: 'checkbox',
      label: 'Only show featured projects',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
        step: 1,
        description: 'Number of projects to show',
      },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: 'Choose projects',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
      },
    },
    {
      name: 'enableViewAll',
      type: 'checkbox',
      label: 'Show "View All Projects" link',
      defaultValue: true,
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        name: 'viewAllLink',
        label: 'View All Link',
        admin: {
          condition: (_data, siblingData) => Boolean(siblingData?.enableViewAll),
        },
      },
    }),
  ],
}