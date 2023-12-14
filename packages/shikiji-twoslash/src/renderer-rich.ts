import type { Element, ElementContent } from 'hast'
import type { TwoSlashReturn } from '@typescript/twoslash'
import type { TwoSlashRenderers } from './types'
import icons from './completion-icons.json'

type CompletionItem = NonNullable<TwoSlashReturn['queries'][0]['completions']>[0]

export interface RendererRichOptions {
  /**
   * Custom icons for completion items.
   * A map from completion item kind to a HAST node.
   *
   * If `false`, no icons will be rendered.
   * @default rendererRichCompletionIcons
   */
  completionIcons?: Partial<Record<CompletionItem['kind'], ElementContent>> | false
}

export const rendererRichCompletionIcons: Record<CompletionItem['kind'], Element> = icons as any

/**
 * An alternative renderer that providers better prefixed class names,
 * with syntax highlight for the info text.
 */
export function rendererRich(options: RendererRichOptions = {}): TwoSlashRenderers {
  const {
    completionIcons = rendererRichCompletionIcons,
  } = options
  return {
    nodeStaticInfo(info, node) {
      let themedContent: ElementContent[]

      try {
        themedContent = ((this.codeToHast(info.text, {
          ...this.options,
          transformers: [],
          transforms: undefined,
        }).children[0] as Element).children[0] as Element).children
      }
      catch (e) {
        themedContent = [{
          type: 'text',
          value: info.text,
        }]
      }

      return {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'twoslash-hover',
        },
        children: [
          node,
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: 'twoslash-popup-info',
            },
            children: themedContent,
          },
        ],
      }
    },

    nodeQuery(query, node) {
      if (!query.text)
        return {}

      let themedContent: ElementContent[]

      try {
        themedContent = ((this.codeToHast(query.text, {
          ...this.options,
          transformers: [],
          transforms: undefined,
        }).children[0] as Element).children[0] as Element).children
      }
      catch (e) {
        themedContent = [{
          type: 'text',
          value: query.text,
        }]
      }

      return {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'twoslash-hover twoslash-query-presisted',
        },
        children: [
          node,
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: 'twoslash-popup-info',
            },
            children: [
              {
                type: 'element',
                tagName: 'div',
                properties: { class: 'twoslash-popup-arrow' },
                children: [],
              },
              ...themedContent,
            ],
          },
        ],
      }
    },

    nodeCompletions(query, node) {
      if (node.type !== 'text')
        throw new Error(`[shikiji-twoslash] nodeCompletions only works on text nodes, got ${node.type}`)

      const leftPart = query.completionsPrefix || ''
      const rightPart = node.value.slice(leftPart.length || 0)

      return {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [
          {
            type: 'text',
            value: leftPart,
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: 'twoslash-completions-list',
            },
            children: [{
              type: 'element',
              tagName: 'ul',
              properties: {},
              children: query.completions!
                .filter(i => i.name.startsWith(query.completionsPrefix || '____'))
                .map(i => ({
                  type: 'element',
                  tagName: 'li',
                  properties: {

                  },
                  children: [
                    ...completionIcons
                      ? [<Element>{
                        type: 'element',
                        tagName: 'span',
                        properties: { class: `twoslash-completions-icon completions-${i.kind.replace(/\s/g, '-')}` },
                        children: [
                          completionIcons[i.kind] || completionIcons.property,
                        ],
                      }]
                      : [],
                    {
                      type: 'element',
                      tagName: 'span',
                      properties: {
                        class: i.kindModifiers?.split(',').includes('deprecated')
                          ? 'deprecated'
                          : undefined,
                      },
                      children: [
                        {
                          type: 'element',
                          tagName: 'span',
                          properties: { class: 'twoslash-completions-matched' },
                          children: [
                            {
                              type: 'text',
                              value: query.completionsPrefix || '',
                            },
                          ],
                        },
                        {
                          type: 'element',
                          tagName: 'span',
                          properties: { class: 'twoslash-completions-unmatched' },
                          children: [
                            {
                              type: 'text',
                              value: i.name.slice(query.completionsPrefix?.length || 0),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                })),
            }],
          },
          {
            type: 'text',
            value: rightPart,
          },
        ],
      }
    },

    nodeError(_, node) {
      return {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'twoslash-error',
        },
        children: [node],
      }
    },

    lineError(error) {
      return [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            class: 'twoslash-meta-line twoslash-error-line',
          },
          children: [
            {
              type: 'text',
              value: error.renderedMessage,
            },
          ],
        },
      ]
    },

    lineCustomTag(tag) {
      return [
        {
          type: 'element',
          tagName: 'div',
          properties: { class: `twoslash-meta-line twoslash-tag-${tag.name}-line` },
          children: [
            {
              type: 'text',
              value: tag.annotation || '',
            },
          ],
        },
      ]
    },
  }
}
