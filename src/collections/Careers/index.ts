import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateDelete, revalidateCareer } from './hooks/revalidateCareers'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'


export const Careers: CollectionConfig<'careers'> = {
  slug: 'careers',

  // ── Access control ──────────────────────────────────────────────────────────
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  // ── defaultPopulate ─────────────────────────────────────────────────────────
  // Fields included when a career is referenced from another collection.
  // Kept lean — only what the job listing card needs.
  defaultPopulate: {
    title: true,
    slug: true,
    department: true,
    location: true,
    employmentType: true,
    experienceLevel: true,
    isOpen: true,
    featured: true,
  },

  // ── Admin UI ────────────────────────────────────────────────────────────────
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'location', 'isOpen', 'featured', 'updatedAt'],
    description: 'Manage job listings shown on the Careers page.',
  },

  // ── Fields ──────────────────────────────────────────────────────────────────
  fields: [

    // Job title — always visible above the tabs
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title e.g. "Senior Water Treatment Engineer"',
      },
    },

    // ── TABS ───────────────────────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [

        // ── TAB 1: Job Details ────────────────────────────────────────────────
        // The main content of the job listing — what the role is, what
        // the candidate will do, and what they need to qualify.
        // ─────────────────────────────────────────────────────────────────────
        {
          label: 'Job Details',
          fields: [
            {
              // Short paragraph shown on the job listing card and at the top
              // of the job detail page. Separate from the full description
              // so editors can control compact view independently.
              name: 'excerpt',
              type: 'textarea',
              label: 'Role summary',
              required: true,
              admin: {
                description: 'Brief summary shown on job cards. Keep under 200 characters.',
                rows: 3,
              },
            },
            {
              // Full job description — what the company offers, team context,
              // growth opportunities. Uses Banner block for highlighting
              // key points like perks or urgent requirements.
              name: 'description',
              type: 'richText',
              label: 'Full job description',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                  BlocksFeature({
                    blocks: [
                      // Banner — highlight perks, urgent notes, or key info
                      Banner,
                    ],
                  }),
                ],
              }),
            },
            {
              // Day-to-day tasks and responsibilities.
              // Each row is one bullet point — renders as a bulleted list.
              name: 'responsibilities',
              type: 'array',
              label: 'Responsibilities',
              admin: {
                description: 'Add one row per responsibility.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g. Design and commission pump systems for industrial clients',
                  },
                },
              ],
            },
            {
              // Must-have qualifications — candidates without these will not
              // be considered. Renders as a bulleted list with a "Required" heading.
              name: 'requirements',
              type: 'array',
              label: 'Requirements',
              admin: {
                description: 'Must-have qualifications. Add one row per requirement.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g. Degree in Mechanical or Civil Engineering',
                  },
                },
              ],
            },
            {
              // Good-to-have qualifications — not dealbreakers but preferred.
              // Renders as a bulleted list with a "Nice to have" heading.
              name: 'niceToHave',
              type: 'array',
              label: 'Nice to have',
              admin: {
                description: 'Preferred but not required. Add one row per item.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  admin: {
                    placeholder: 'e.g. Experience with EBARA pump systems',
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 2: Benefits ───────────────────────────────────────────────────
        // What HydroEra offers the successful candidate.
        // Kept as a separate tab so it can be updated independently
        // without touching the job requirements.
        // ─────────────────────────────────────────────────────────────────────
        {
          label: 'Benefits',
          fields: [
            {
              // Salary range or compensation details — optional, some roles
              // prefer not to advertise the exact figure publicly.
              name: 'salaryRange',
              type: 'text',
              label: 'Salary range',
              admin: {
                placeholder: 'e.g. RM 4,000 – RM 6,500 / month',
                description: 'Leave empty to show "Competitive salary" on the listing.',
              },
            },
            {
              // List of benefits — each row is one benefit item.
              // Renders as an icon + text grid on the job detail page.
              name: 'benefits',
              type: 'array',
              label: 'Benefits',
              admin: {
                description: 'Add one row per benefit offered.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'benefit',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g. Medical and dental coverage, Annual performance bonus',
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 3: SEO ────────────────────────────────────────────────────────
        // Search engine meta data for the individual job detail page.
        // ─────────────────────────────────────────────────────────────────────
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            // Overview panel — live summary of all three SEO fields
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            // Blue link text in Google results
            MetaTitleField({ hasGenerateFn: true }),
            // Image shown when shared on WhatsApp, LinkedIn etc.
            MetaImageField({ relationTo: 'media' }),
            // Grey snippet text under the blue link in Google
            MetaDescriptionField({}),
            // Live Google preview panel
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },

      ],
    },

    // ── SIDEBAR FIELDS ─────────────────────────────────────────────────────────
    // Right column — classification, status, and publish control.
    // ──────────────────────────────────────────────────────────────────────────

    {
      // Which team this role belongs to — used to group jobs on the careers page
      name: 'department',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Used to group roles on the careers page.',
      },
      options: [
        { label: 'Engineering',          value: 'engineering' },
        { label: 'Sales',                value: 'sales' },
        { label: 'Service & Maintenance',value: 'service' },
        { label: 'Operations',           value: 'operations' },
        { label: 'Research & Development', value: 'rd' },
        { label: 'Quality Assurance',    value: 'qa' },
        { label: 'Administration',       value: 'administration' },
      ],
    },
    {
      // Where the candidate needs to be based
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        placeholder: 'e.g. Penang / Selangor',
      },
    },
    {
      // Full-time, part-time, or contract
      name: 'employmentType',
      type: 'select',
      required: true,
      defaultValue: 'full-time',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Contract',  value: 'contract' },
        { label: 'Internship', value: 'internship' },
      ],
    },
    {
      // Years of experience required — shown as a badge on the job card
      name: 'experienceLevel',
      type: 'text',
      label: 'Experience required',
      admin: {
        position: 'sidebar',
        placeholder: 'e.g. 3–5 years, Fresh graduate',
      },
    },
    {
      // This is the most important sidebar field.
      // When a position is filled, editors uncheck this — the job disappears
      // from the frontend without deleting the record from the database.
      // Default is true so new jobs are open by default.
      name: 'isOpen',
      type: 'checkbox',
      label: 'Position is open',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck when the position has been filled. The listing will be hidden from the website.',
      },
    },
    {
      // Featured roles are highlighted at the top of the careers page
      name: 'featured',
      type: 'checkbox',
      label: 'Featured role',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Pin this role to the top of the careers page.',
      },
    },
    {
      // Auto-set when the job is first published.
      // Can also be set manually to back-date or schedule.
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

    // Slug — auto-generated from the title field. Always last.
    slugField(),

  ],

  // ── Hooks ────────────────────────────────────────────────────────────────────
  hooks: {
    // Rebuild cached pages after every save
    afterChange: [revalidateCareer],
    // Auto-set publishedAt date before saving
    beforeChange: [populatePublishedAt],
    // Clear cached page after deletion
    afterDelete: [revalidateDelete],
  },

  // ── Versions / drafts ─────────────────────────────────────────────────────────
  // Enables draft/publish workflow and live preview.
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}