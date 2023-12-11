import type { TwoSlashOptions, TwoSlashReturn } from '@typescript/twoslash'
import { twoslasher } from '@typescript/twoslash'
import type { CodeToHastOptions, ShikijiTransformer, ShikijiTransformerContext } from 'shikiji'
import { addClassToHast } from 'shikiji'
import type { Element, ElementContent, Text } from 'hast'

declare module 'shikiji' {
  interface ShikijiTransformerContextMeta {
    twoslash?: TwoSlashReturn
  }
}

export interface TransformerTwoSlashOptions {
  /**
   * Languages to apply this transformer to
   */
  langs?: string[]
  /**
   * Custom filter function to apply this transformer to
   * When specified, `langs` will be ignored
   */
  filter?: (code: string, options: CodeToHastOptions) => boolean
  /**
   * Options to pass to twoslash
   */
  twoslashOptions?: TwoSlashOptions
}

export function transformerTwoSlash(options: TransformerTwoSlashOptions = {}): ShikijiTransformer {
  const {
    langs = ['ts', 'tsx'],
  } = options
  const filter = options.filter || ((_, options) => langs.includes(options.lang))
  return {
    preprocess(code, shikijiOptions) {
      if (filter(code, shikijiOptions)) {
        shikijiOptions.mergeWhitespaces = false
        const twoslash = twoslasher(code, shikijiOptions.lang, options.twoslashOptions)
        this.meta.twoslash = twoslash
        return twoslash.code
      }
    },
    pre(pre) {
      if (this.meta.twoslash)
        addClassToHast(pre, 'twoslash lsp')
    },
    code(codeEl) {
      const twoslash = this.meta.twoslash
      if (!twoslash)
        return

      const insertAfterLine = (line: number, ...nodes: Element[]) => {
        const lineEl = this.lines[line]
        const index = codeEl.children.indexOf(lineEl)
        if (index === -1)
          return false

        // If there is a newline after this line, remove it because we have the error element take place.
        const nodeAfter = this.code.children[index + 1]
        if (nodeAfter && nodeAfter.type === 'text' && nodeAfter.value === '\n')
          this.code.children.splice(index + 1, 1)

        this.code.children.splice(index + 1, 0, ...nodes)
        return true
      }

      for (const info of twoslash.staticQuickInfos) {
        const token = locateTextToken(this, info.line, info.character)
        if (!token || token.type !== 'text')
          continue
        const text = { ...token }
        // Wrap the token with a <data-lsp> tag
        Object.assign(token, {
          type: 'element',
          tagName: 'data-lsp',
          properties: {
            lsp: info.text,
          },
          children: [text],
        })
      }

      for (const error of twoslash.errors) {
        if (error.line == null || error.character == null)
          return
        const token = locateTextToken(this, error.line, error.character)
        if (!token)
          continue

        const text = { ...token }
        // Wrap the token with a <data-err> tag
        Object.assign(token, {
          type: 'element',
          tagName: 'data-err',
          children: [text],
        })

        insertAfterLine(error.line, ...createErrorLine(error))
      }

      for (const query of twoslash.queries) {
        insertAfterLine(query.line, {
          type: 'element',
          tagName: 'div',
          properties: { class: 'meta-line' },
          children: query.kind === 'completions'
            ? createCompletions(query)
            : query.kind === 'query'
              ? createPopover(this, query)
              : [],
        })
      }
    },
  }
}

function createErrorLine(error: TwoSlashReturn['errors'][0]): Element[] {
  return [
    {
      type: 'element',
      tagName: 'div',
      properties: {
        class: 'error',
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [
            {
              type: 'text',
              value: error.renderedMessage,
            },
          ],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: 'code',
          },
          children: [
            {
              type: 'text',
              value: String(error.code),
            },
          ],
        },
      ],
    },
    {
      type: 'element',
      tagName: 'span',
      properties: {
        class: 'error-behind',
      },
      children: [
        {
          type: 'text',
          value: error.renderedMessage,
        },
      ],
    },
  ]
}

function createCompletions(query: TwoSlashReturn['queries'][0]): ElementContent[] {
  return [
    { type: 'text', value: ' '.repeat(query.offset) },
    {
      type: 'element',
      tagName: 'span',
      properties: { class: 'inline-completions' },
      children: [{
        type: 'element',
        tagName: 'ul',
        properties: { class: 'dropdown' },
        children: query.completions!
          .filter(i => i.name.startsWith(query.completionsPrefix || '____'))
          .map(i => ({
            type: 'element',
            tagName: 'li',
            properties: {
              class: i.kindModifiers?.split(',').includes('deprecated')
                ? 'deprecated'
                : undefined,
            },
            children: [{
              type: 'element',
              tagName: 'span',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { class: 'result-found' },
                  children: [
                    {
                      type: 'text',
                      value: query.completionsPrefix || '',
                    },
                  ],
                },
                {
                  type: 'text',
                  value: i.name.slice(query.completionsPrefix?.length || 0),
                },
              ],
            }],
          })),
      }],
    },
  ]
}

function createPopover(
  context: ShikijiTransformerContext,
  query: TwoSlashReturn['queries'][0],
): ElementContent[] {
  const targetNode = locateTextToken(context, query.line, query.offset)
  const targetText = targetNode?.type === 'text' ? targetNode.value : ''
  const offset = Math.max(0, (query.offset || 0) - Math.round(targetText.length / 2) - 1)
  return [
    { type: 'text', value: ' '.repeat(offset) },
    {
      type: 'element',
      tagName: 'span',
      properties: { class: 'popover' },
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: { class: 'arrow' },
          children: [],
        },
        {
          type: 'text',
          value: query.text || '',
        },
      ],
    },
  ]
}

function locateTextToken(
  context: ShikijiTransformerContext,
  line: number,
  character: number,
) {
  const lineEl = context.lines[line]
  if (!lineEl)
    return
  const textNodes = lineEl.children.flatMap(i => i.type === 'element' ? i.children || [] : []) as (Text | Element)[]
  let index = 0
  for (const token of textNodes) {
    if ('value' in token && typeof token.value === 'string')
      index += token.value.length

    if (index > character)
      return token
  }
}
