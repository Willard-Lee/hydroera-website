// collections/Products/index.ts
import type { CollectionConfig } from "payload";

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Content } from '../../blocks/Content/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
  } from '@payloadcms/plugin-seo/fields' 
import { HorizontalRuleFeature, FixedToolbarFeature, HeadingFeature, BlocksFeature, InlineToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { CallToAction } from "@/blocks/CallToAction/config";
import { Banner } from "@/blocks/Banner/config";
import { revalidateDelete, revalidatePage } from "../Pages/hooks/revalidatePage";
import { revalidateProduct } from "./hooks/revalidateProducts";

/**
 * Summary of Requirements:
 * DONE Tab 1: Overview - featuredImage (upload), gallery (array), short description (text area), Description (richtext)
 * Tab 2: Specs (if needed) - Placeholder included below
 * Tab 3: Related Products - (linked by category)
 * Tab 4: SEO
 * Sidebar: category, publishedAt, slug
 */

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateProduct],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375, 
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {  // Above Tab: Product title
      name: 'title', 
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        // Tab 1: Overview (Image, Description, Gallery, short description)
        {
          label: 'Overview',
          fields: [
            { // Product Image
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Main Product image shown on the listing card and detail page.',
              },
            },
            { // Short description (text area)
              name: 'shortDescription',
              type: 'textarea',
              label: 'Short Description',
              admin: {
                description: 'A brief summary for cards and search results.',
              },
            },
            { // Gallery Images
              name: 'gallery',
              type: 'array', 
              label: 'Image Gallery',
              admin: {
                description: 'Additional Product Photos shown as thumbnails on the detail page',
                initCollapsed: true,
              },
              fields: [ // Array media upload for Product image
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
                    placeholder: 'e.g Front view with motor housing',
                  },
                },
              ],
            },
            { // Description (richtext)
              name: 'description',
              type: 'richText',
              label: 'Full Description',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),        
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                  BlocksFeature({
                    blocks: [Banner, MediaBlock, CallToAction],
                  }),
                ],
              }),
            },
          ],
        },
        // Tab 2: Specs (Placeholder for future use)
        {
          label: 'Specs',
          fields: [
            {
              name: 'specifications',
              type: 'group',
              fields: [
                {
                    name: 'material',
                    type: 'text',
                },
                {
                    name: 'dimensions',
                    type: 'text',
                }
              ]
            }
          ]
        },
        // Tab 3: Related Products (Manual selection or instructions)
        {
          label: 'Related Products',
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              admin: {
                description: 'Manually select related products or leave empty to auto-populate by category via frontend logic.',
              },
            },
          ],
        },
        // Tab 4: SEO
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    // SIDEBAR: category, publishedat, slug 
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Select the product category'
      },
    },
    { 
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
}