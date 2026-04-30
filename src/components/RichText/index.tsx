import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
  TextJSXConverter,
} from '@payloadcms/richtext-lexical/react'

import React from 'react'
import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

// Map of TextStateFeature color keys → CSS values (must match hero config + defaultLexical config)
const textStateColorMap: Record<string, Record<string, string>> = {
  black: { color: '#000000'},
  grey: {color: '#808080'},
  white: { color: '#ffffff' },
  blue: { color: '#0B4F8A' },
  'light-blue': { color: '#2196F3' },
  cyan: { color: '#06B6D4' },
  green: { color: '#22C55E' },
  yellow: { color: '#EAB308' },
  red: { color: '#EF4444' },
  muted: { color: 'rgba(150,150,150,0.6)' },
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  // Custom text converter that handles TextStateFeature colors
  text: (args) => {
    // First, use the default text converter for format (bold, italic, etc.)
    const converter = TextJSXConverter.text
    const base = typeof converter === 'function' ? converter(args) : args.node.text
    // Check for state data (serialized under '$' key)
    const stateData = (args.node as Record<string, unknown>)['$'] as Record<string, string> | undefined
    if (stateData?.color && textStateColorMap[stateData.color]) {
      return <span style={textStateColorMap[stateData.color]}>{base}</span>
    }
    return base
  },
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
