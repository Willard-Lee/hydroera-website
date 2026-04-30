import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ServicesGridBlock } from './ServicesGrid/Component'
import { StatsCounterBlock } from './StatsCounter/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { FeatureSplitBlock } from './FeatureSplit/Component'
import { ProjectsShowcaseBlock } from './ProjectShowcase/Component'
import { CertificationsBlock } from './Certifications/Component'
import { LogoGridBlock } from './LogoGrid/Component'
import { MediaContentAccordionBlock } from './MediaContentAccordion/Component'
import { DownloadBlock } from './Download/Component'
import { IndustriesGridBlock } from './IndustriesGrid/Component'
import { TrustBandBlock } from './TrustBand/Component'
import { ScrollReveal } from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'

type Animation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  servicesGrid: ServicesGridBlock,
  statsCounter: StatsCounterBlock,
  testimonials: TestimonialsBlock,
  featureSplit: FeatureSplitBlock,
  projectsShowcase: ProjectsShowcaseBlock,
  certifications: CertificationsBlock,
  logoGrid: LogoGridBlock,
  mediaContentAccordion: MediaContentAccordionBlock,
  download: DownloadBlock,
  industriesGrid: IndustriesGridBlock,
  trustBand: TrustBandBlock,
}

const animations: Animation[] = ['fade-up', 'fade-up', 'zoom-in', 'fade-left', 'fade-right', 'fade-up']

/* Zebra palette — cycles through these backgrounds */
const zebraPalette = [
  { bg: 'bg-background', text: '' },
  { bg: 'bg-secondary', text: '' },
  { bg: 'bg-background', text: '' },
  { bg: 'bg-hydroera-slate-dark', text: 'text-white' },
]

/* Blocks that manage their own background — skip zebra for these */
const selfStyledBlocks = new Set([
  'cta',
  'trustBand',
  'statsCounter',
  'industriesGrid',
  'projectsShowcase',
])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    let zebraIndex = 0

    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const isSelfStyled = selfStyledBlocks.has(blockType)
              const palette = zebraPalette[zebraIndex % zebraPalette.length]

              if (!isSelfStyled) {
                zebraIndex++
              }

              return (
                <ScrollReveal
                  key={index}
                  animation={animations[index % animations.length]}
                  delay={index === 0 ? 100 : 0}
                  duration={700}
                >
                  {isSelfStyled ? (
                    <div className="py-16">
                      {/* @ts-expect-error there may be some mismatch between the expected types here */}
                      <Block {...block} disableInnerContainer />
                    </div>
                  ) : (
                    <section className={cn('py-16', palette.bg, palette.text)}>
                      {/* @ts-expect-error there may be some mismatch between the expected types here */}
                      <Block {...block} disableInnerContainer />
                    </section>
                  )}
                </ScrollReveal>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
