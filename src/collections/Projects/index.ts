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
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { slugField } from 'payload'
import { revalidateDelete, revalidateProject } from './hooks/revalidateProjects'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',

  // ── Access control ──────────────────────────────────────────────────────────
  // Public visitors can only see published projects.
  // Logged-in admins can see drafts too.
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  // ── defaultPopulate ─────────────────────────────────────────────────────────
  // Fields automatically included when a project is referenced from another
  // collection — e.g. when Products links to relatedProjects.
  // Keep this lean — only what cards and listings need.
  defaultPopulate: {
    title: true,
    slug: true,
    sector: true,
    projectStatus: true,
    location: true,
    completionYear: true,
    featuredImage: true,
    featured: true,
    summary: true,
    meta: {
      image: true,
      description: true,
    },
  },

  // ── Admin UI ────────────────────────────────────────────────────────────────
  admin: {
    // Field used as the document title in the admin list table
    useAsTitle: 'title',
    // Columns shown in the admin list view by default
    defaultColumns: ['title', 'sector', 'projectStatus', 'location', 'completionYear', 'updatedAt'],
    // Live preview — opens the frontend page alongside the admin editor
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'projects',
          req,
        }),
    },
    // Preview button in the top bar of the edit form
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'projects',
        req,
      }),
  },

  // ── Fields ──────────────────────────────────────────────────────────────────
  fields: [

    // Title sits above the tabs — always visible no matter which tab is active
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Project name e.g. "Batu Kawan Industrial Water Treatment System"',
      },
    },

    // ── TABS ───────────────────────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [

        // ── TAB 1: Overview ───────────────────────────────────────────────────
        // Visual content and the main narrative of the project.
        // This is what clients read first on the project detail page.
        // ─────────────────────────────────────────────────────────────────────
        {
          label: 'Overview',
          fields: [
            {
              // Hero image — shown at the top of the project detail page
              // and as the card thumbnail on the /projects listing page
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Main image shown on the project card and detail page.',
              },
            },
            {
              // Extra photos — editors can add as many as needed.
              // Each row is one image with an optional caption.
              // Renders as a photo grid on the detail page.
              name: 'gallery',
              type: 'array',
              label: 'Project gallery',
              admin: {
                description: 'Additional project photos. Shown as a grid on the detail page.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  admin: {
                    placeholder: 'e.g. Pump room after installation',
                  },
                },
              ],
            },
            {
              // Short text shown on the project card in listing pages.
              // Kept separate so editors control what appears in compact views.
              name: 'summary',
              type: 'textarea',
              label: 'Project summary',
              required: true,
              admin: {
                description: 'Brief summary shown on project cards. Keep under 160 characters.',
                rows: 3,
              },
            },
            {
              // The problem or situation that led to this project.
              // Rich text so editors can use headings, bold, and inline images.
              name: 'challenge',
              type: 'richText',
              label: 'The challenge',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                  BlocksFeature({
                    blocks: [
                      Banner,     // highlight key facts or constraints
                      MediaBlock, // embed diagrams or before photos inline
                    ],
                  }),
                ],
              }),
            },
            {
              // What HydroEra designed and delivered to solve the challenge.
              // Rich text with the same block options as the challenge field.
              name: 'solution',
              type: 'richText',
              label: 'The solution',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                  BlocksFeature({
                    blocks: [
                      Banner,     // highlight key design decisions
                      MediaBlock, // embed system diagrams or after photos inline
                    ],
                  }),
                ],
              }),
            },
          ],
        },

        // ── TAB 2: Details ────────────────────────────────────────────────────
        // Technical and commercial details about the project.
        // Used to build the detail page sidebar and the scope/outcomes sections.
        // ─────────────────────────────────────────────────────────────────────
        {
          label: 'Details',
          fields: [
            {
              // Client or organisation name — shown in the sidebar of detail page
              name: 'client',
              type: 'text',
              label: 'Client / organisation',
              admin: {
                placeholder: 'e.g. Penang Water Supply Corporation',
              },
            },
            {
              // Contract or approximate project value — used to signal scale
              name: 'projectValue',
              type: 'text',
              label: 'Project value',
              admin: {
                placeholder: 'e.g. RM 2.5M',
              },
            },
            {
              // How long the project ran from start to completion
              name: 'duration',
              type: 'text',
              label: 'Project duration',
              admin: {
                placeholder: 'e.g. 8 months',
              },
            },
            {
              // Number of engineers and technicians deployed on site
              name: 'teamSize',
              type: 'number',
              label: 'Team size',
              admin: {
                placeholder: 'e.g. 12',
                step: 1,
              },
            },
            {
              // What HydroEra was contracted to do — each row is one work item.
              // Renders as a bulleted list on the detail page.
              name: 'scope',
              type: 'array',
              label: 'Scope of work',
              admin: {
                description: 'Add one row per deliverable or work item.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g. Design and installation of booster pump system',
                  },
                },
              ],
            },
            {
              // Products installed in this project — links back to the Products
              // collection so the detail page can show a "Products used" section
              // with links to each product's own detail page.
              name: 'productsUsed',
              type: 'relationship',
              label: 'Products used',
              relationTo: 'products',
              hasMany: true,
              admin: {
                description: 'Link the pump products installed in this project.',
              },
            },
            {
              // Measurable results — each row is one outcome.
              // Renders as a highlight grid on the detail page.
              name: 'outcomes',
              type: 'array',
              label: 'Key outcomes',
              admin: {
                description: 'Add one row per measurable result.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'metric',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g. 40% reduction in energy consumption',
                  },
                },
              ],
            },
            {
              // Client testimonial specific to this project.
              // Stored as a group (a single record, not an array) because there
              // is only ever one testimonial per project.
              // Renders as a pull quote on the detail page.
              name: 'testimonial',
              type: 'group',
              label: 'Client testimonial',
              admin: {
                description: 'Optional quote from the client about this project.',
              },
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Quote',
                  admin: {
                    placeholder: 'e.g. HydroEra delivered the system on time and within budget...',
                    rows: 4,
                  },
                },
                {
                  name: 'authorName',
                  type: 'text',
                  label: 'Author name',
                  admin: {
                    placeholder: 'e.g. Ahmad bin Razak',
                  },
                },
                {
                  name: 'authorRole',
                  type: 'text',
                  label: 'Author role',
                  admin: {
                    placeholder: 'e.g. Head of Engineering, PBA Holdings',
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 3: SEO ────────────────────────────────────────────────────────
        // Search engine meta data.
        // The SEO plugin renders this tab automatically — editors get a live
        // Google preview, character counters, and auto-generate buttons.
        // ─────────────────────────────────────────────────────────────────────
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            // Overview panel — shows a summary of all three SEO fields at once
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            // Meta title — what appears as the blue link in Google results
            MetaTitleField({ hasGenerateFn: true }),
            // Meta image — shown when the page is shared on social media
            MetaImageField({ relationTo: 'media' }),
            // Meta description — the grey snippet text under the blue link
            MetaDescriptionField({}),
            // Live preview — shows exactly how this page looks in Google
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
    // These appear in the right column regardless of which tab is active.
    // Keep them short — they are for classification and publish control.
    // ──────────────────────────────────────────────────────────────────────────

    {
      // Industry sector — drives filtering on the /projects listing page
      name: 'sector',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Used to filter projects on the listing page.',
      },
      options: [
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Municipal',     value: 'municipal' },
        { label: 'Commercial',    value: 'commercial' },
        { label: 'Industrial',    value: 'industrial' },
        { label: 'Agricultural',  value: 'agricultural' },
      ],
    },
    {
      // Delivery / lifecycle state — shown as a badge on cards and detail page.
      // Named projectStatus (not "status") so Postgres enum does not collide with Payload draft _status.
      name: 'projectStatus',
      type: 'select',
      label: 'Project status',
      required: true,
      defaultValue: 'completed',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Completed',   value: 'completed' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Upcoming',    value: 'upcoming' },
      ],
    },
    {
      // Physical location — shown on cards and in the detail page sidebar
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        placeholder: 'e.g. Batu Kawan, Penang',
      },
    },
    {
      // Year the project was completed — shown on cards and used for filtering
      name: 'completionYear',
      type: 'number',
      label: 'Completion year',
      admin: {
        position: 'sidebar',
        placeholder: 'e.g. 2024',
        step: 1,
      },
    },
    {
      // Featured flag — checked projects appear in the featured strip on
      // the /projects page and can be pinned to the homepage
      name: 'featured',
      type: 'checkbox',
      label: 'Featured project',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Pin this project to the featured strip on the projects page.',
      },
    },
    {
      // Auto-set to the current date when a project is first published.
      // Editors can also set it manually to back-date or schedule.
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            // Only auto-set if publishing for the first time (no existing value)
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },

    // Slug — auto-generated from the title field.
    // Always put slugField() last.
    slugField(),

  ],

  // ── Hooks ────────────────────────────────────────────────────────────────────
  hooks: {
    // afterChange — runs after every save, tells Next.js to rebuild cached pages
    afterChange: [revalidateProject],
    // beforeChange — runs before saving, auto-sets publishedAt date
    beforeChange: [populatePublishedAt],
    // afterDelete — runs after deletion, clears the cached page
    afterDelete: [revalidateDelete],
  },

  // ── Versions / drafts ─────────────────────────────────────────────────────────
  // Enables the draft/publish workflow and live preview in the admin.
  // autosave saves a draft every 100ms while the editor is typing.
  // schedulePublish lets editors set a future publish date in the sidebar.
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}