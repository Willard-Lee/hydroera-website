import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'highImpact',
      eyebrow: 'Leading Pump Solutions in Malaysia',
      textAlignment: 'left',
      overlayOpacity: '60',
      media: heroImage.id,
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Our Solutions',
            url: '/products',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Contact Us',
            url: '/contact',
          },
        },
      ],
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
                  text: 'Complete Pump Solutions for Every Application',
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
                  text: 'HydroEra delivers reliable pump systems for drainage, irrigation, water supply, and industrial applications across Malaysia. Trusted by engineers and contractors for over two decades.',
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
    layout: [
      {
        blockName: 'Services Grid',
        blockType: 'servicesGrid',
        heading: 'Our Core Services',
        subheading:
          'From supply and installation to maintenance and consultancy, we provide end-to-end pump solutions tailored to your project requirements.',
        layout: 'threeColumn',
        services: [
          {
            icon: 'pump',
            title: 'Pump Supply',
            description:
              'Wide range of submersible, centrifugal, and booster pumps sourced from leading global manufacturers.',
            enableLink: false,
          },
          {
            icon: 'installation',
            title: 'Pump Installation',
            description:
              'Professional installation by certified technicians for residential, commercial, and industrial projects.',
            enableLink: false,
          },
          {
            icon: 'maintenance',
            title: 'Maintenance & Repair',
            description:
              'Scheduled preventive maintenance and rapid-response repair services to minimise downtime.',
            enableLink: false,
          },
          {
            icon: 'engineering',
            title: 'System Engineering',
            description:
              'Custom pump system design and hydraulic engineering to match project-specific flow and pressure requirements.',
            enableLink: false,
          },
          {
            icon: 'waterTreatment',
            title: 'Water Treatment',
            description:
              'Integrated solutions for water treatment plants, including dosing pumps and filtration systems.',
            enableLink: false,
          },
          {
            icon: 'consulting',
            title: 'Technical Consultancy',
            description:
              'Expert guidance on pump selection, energy efficiency, and compliance with local standards and regulations.',
            enableLink: false,
          },
        ],
      },
      {
        blockName: 'Stats Counter',
        blockType: 'statsCounter',
        heading: 'HydroEra in Numbers',
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
            value: 98,
            suffix: '%',
            label: 'Client Satisfaction Rate',
            icon: 'star',
          },
          {
            value: 12,
            suffix: '+',
            label: 'States Served Nationwide',
            icon: 'globe',
          },
        ],
      },
      {
        blockName: 'CTA',
        blockType: 'cta',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Get a Free Quote',
              url: '/contact',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'View Our Projects',
              url: '/projects',
            },
          },
        ],
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
                    text: 'Ready to Start Your Project?',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                tag: 'h3',
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
                    text: 'Contact our team today for a consultation and competitive quotation. We serve clients across Peninsular Malaysia and East Malaysia.',
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
    meta: {
      description:
        'HydroEra — Malaysia\'s trusted pump solutions provider. Supply, installation, maintenance, and engineering for drainage, irrigation, and water supply systems.',
      image: metaImage.id,
      title: 'HydroEra | Complete Pump Solutions in Malaysia',
    },
    title: 'Home',
  }
}
