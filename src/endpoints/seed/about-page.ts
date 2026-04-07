import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type AboutArgs = {
  heroImage: Media
  metaImage: Media
}

export const aboutPage: (args: AboutArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => {
  return {
    slug: 'about',
    _status: 'published',
    hero: {
      type: 'mediumImpact',
      eyebrow: 'About Us',
      textAlignment: 'left',
      overlayOpacity: '60',
      media: heroImage.id,
      richText: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Trusted Pump Solutions Partner',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h1',
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'For over two decades, HydroEra has been the partner of choice for engineers, contractors, and facility managers seeking reliable pump solutions across Malaysia.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      links: [],
    },
    layout: [
      {
        blockName: 'Company Story',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Our Story',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    tag: 'h2',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          {
            enableLink: false,
            size: 'half',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Founded in Kuala Lumpur, HydroEra Sdn Bhd began as a specialist pump distributor serving the construction and water utility sectors. Recognising the growing complexity of pump system requirements in Malaysia\'s rapidly developing infrastructure, we expanded our scope to offer full turnkey solutions — from hydraulic design through to commissioning and long-term maintenance.',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          {
            enableLink: false,
            size: 'half',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Today, our team of engineers and certified technicians serves clients across all 13 states and Federal Territories. We are registered with CIDB, SPAN, and JPS — enabling us to undertake government and utility projects alongside private sector contracts. Our partnerships with global pump manufacturers ensure access to premium, energy-efficient equipment at competitive prices.',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
      },
      {
        blockName: 'Feature Split',
        blockType: 'featureSplit',
        eyebrow: 'Why Choose HydroEra',
        richText: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Expertise You Can Rely On',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                tag: 'h2',
                version: 1,
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Our in-house engineering team combines local market knowledge with international standards. From small residential booster systems to large-scale industrial pump stations, we bring the same rigour and attention to detail to every project.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        highlights: [
          {
            title: 'Certified Technical Authority',
            description: 'Registered with CIDB, SPAN, and JPS for utility and government projects.',
          },
          {
            title: 'OEM Authorised Partner',
            description: 'Authorised distributor and service centre for leading pump brands.',
          },
          {
            title: 'End-to-End Solutions',
            description: 'Design, supply, installation, testing, and annual maintenance contracts.',
          },
          {
            title: 'Nationwide Coverage',
            description: 'Service teams in Klang Valley, Johor, Penang, and East Malaysia.',
          },
        ],
        enableLink: true,
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'View Our Projects',
          url: '/projects',
        },
        media: heroImage.id,
        mediaPosition: 'right',
        background: 'grey',
      },
      {
        blockName: 'About Stats',
        blockType: 'statsCounter',
        heading: 'Our Track Record',
        theme: 'dark',
        stats: [
          {
            value: 500,
            suffix: '+',
            label: 'Projects Completed',
            icon: 'building',
          },
          {
            value: 20,
            suffix: '+',
            label: 'Years of Experience',
            icon: 'clock',
          },
          {
            value: 150,
            suffix: '+',
            label: 'Skilled Professionals',
            icon: 'users',
          },
          {
            value: 35,
            suffix: '+',
            label: 'Brand Partnerships',
            icon: 'trophy',
          },
        ],
      },
    ],
    meta: {
      description:
        'Learn about HydroEra — Malaysia\'s trusted pump solutions company with over 20 years of experience in supply, installation, and maintenance.',
      image: metaImage.id,
      title: 'About Us | HydroEra',
    },
    title: 'About Us',
  }
}
