import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from 'payload'
import { revalidateTestimonial, revalidateDeleteTestimonial } from './hooks/revalidateTestimonials'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'company', 'featured', 'updatedAt'],
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The testimonial quote from the client.',
        rows: 4,
      },
    },
    {
      name: 'authorName',
      type: 'text',
      label: 'Author name',
      required: true,
      admin: {
        placeholder: 'e.g. Ahmad bin Razak',
      },
    },
    {
      name: 'authorRole',
      type: 'text',
      label: 'Author role / position',
      admin: {
        placeholder: 'e.g. Head of Engineering',
      },
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company / organisation',
      admin: {
        placeholder: 'e.g. PBA Holdings Sdn Bhd',
      },
    },
    {
      name: 'companyLogo',
      type: 'upload',
      label: 'Company logo',
      relationTo: 'media',
      admin: {
        description: 'Optional logo shown alongside the testimonial.',
      },
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Rating (1–5)',
      min: 1,
      max: 5,
      admin: {
        description: 'Optional star rating.',
        step: 1,
      },
    },

    // ── Completion letter ─────────────────────────────────────────────────────
    {
      name: 'completionLetter',
      type: 'group',
      label: 'Completion letter (Surat Penyelesaian)',
      admin: {
        description: 'Upload the official completion letter from the client.',
      },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'PDF file',
          admin: {
            description: 'Upload the surat penyelesaian projek as a PDF.',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Document label',
          admin: {
            placeholder: 'e.g. Surat Penyelesaian Projek — PBA Holdings 2023',
            description: 'Name shown on the download button. Auto-uses company name if left empty.',
          },
        },
        {
          name: 'isPublic',
          type: 'checkbox',
          label: 'Show download button on website',
          defaultValue: false,
          admin: {
            description: 'If unchecked, the letter is saved for records but not shown publicly.',
          },
        },
      ],
    },

    // ── Sidebar fields ────────────────────────────────────────────────────────
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured testimonial',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this testimonial on the homepage and featured sections.',
      },
    },
    {
      name: 'relatedProject',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Related project',
      admin: {
        position: 'sidebar',
        description: 'Link this testimonial to the project it came from.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },

    slugField(),
  ],
  hooks: {
    afterChange: [revalidateTestimonial],
    afterDelete: [revalidateDeleteTestimonial],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}