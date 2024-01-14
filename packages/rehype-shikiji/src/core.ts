import { addClassToHast } from 'shikiji/core'
import type { CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptions, HighlighterGeneric, ShikijiTransformer, TransformerOptions } from 'shikiji/core'
import type { Element, Root } from 'hast'
import type { BuiltinTheme } from 'shikiji'
import type { Plugin } from 'unified'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import { parseHighlightLines } from '../../shared/line-highlight'
import { parseHighlightWords } from '../../shared/word-highlight'

export interface MapLike<K = any, V = any> {
  get(key: K): V | undefined
  set(key: K, value: V): this
}

export interface RehypeShikijiExtraOptions {
  /**
   * Add `highlighted` class to lines defined in after codeblock
   *
   * @default true
   */
  highlightLines?: boolean | string

  /**
   * Add `highlighted-word` class to words defined in after codeblock
   *
   * @default true
   */
  highlightWords?: boolean | string

  /**
   * Add `language-*` class to code element
   *
   * @default false
   */
  addLanguageClass?: boolean

  /**
   * Custom meta string parser
   * Return an object to merge with `meta`
   *
   * The special key `_attrs` will be used to filter meta string before processing highlights
   */
  parseMetaString?: (
    metaString: string,
    node: Element,
    tree: Root
  ) => Record<string, any> | undefined | null

  /**
   * Custom map to cache transformed codeToHast result
   *
   * @default undefined
   */
  cache?: MapLike

  /**
   * Chance to handle the error
   * If not provided, the error will be thrown
   */
  onError?: (error: unknown) => void
}

export type RehypeShikijiCoreOptions =
  & CodeOptionsThemes<BuiltinTheme>
  & TransformerOptions
  & CodeOptionsMeta
  & RehypeShikijiExtraOptions

const rehypeShikijiFromHighlighter: Plugin<[HighlighterGeneric<any, any>, RehypeShikijiCoreOptions], Root> = function (
  highlighter,
  options,
) {
  const {
    highlightLines = true,
    addLanguageClass = false,
    highlightWords = true,
    parseMetaString,
    cache,
    ...rest
  } = options

  const prefix = 'language-'

  return function (tree) {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null || node.tagName !== 'pre')
        return

      const head = node.children[0]

      if (
        !head
        || head.type !== 'element'
        || head.tagName !== 'code'
        || !head.properties
      )
        return

      const classes = head.properties.className

      if (!Array.isArray(classes))
        return

      const language = classes.find(
        d => typeof d === 'string' && d.startsWith(prefix),
      )

      if (typeof language !== 'string')
        return

      const code = toString(head as any)

      const cachedValue = cache?.get(code)

      if (cachedValue) {
        parent.children.splice(index, 1, ...cachedValue)
        return
      }

      const raw = head.data && 'meta' in head.data ? head.data.meta as string : ''
      const meta = parseMetaString?.(raw, node, tree) || {}
      const highlightMeta = typeof meta._attrs === 'string' ? meta._attrs : raw

      const codeOptions: CodeToHastOptions = {
        ...rest,
        lang: language.slice(prefix.length),
        meta: {
          ...rest.meta,
          ...meta,
          __raw: raw,
        },
      }

      if (addLanguageClass) {
        codeOptions.transformers ||= []
        codeOptions.transformers.push({
          name: 'rehype-shikiji:code-language-class',
          code(node) {
            addClassToHast(node, language)
            return node
          },
        })
      }

      if (highlightLines) {
        const lines = parseHighlightLines(highlightMeta)
        if (lines) {
          const className = highlightLines === true
            ? 'highlighted'
            : highlightLines

          codeOptions.transformers ||= []
          codeOptions.transformers.push({
            name: 'rehype-shikiji:line-class',
            line(node, line) {
              if (lines.includes(line))
                addClassToHast(node, className)
              return node
            },
          })
        }
      }

      if (highlightWords) {
        const words = parseHighlightWords(highlightMeta)

        if (words) {
          const className = highlightWords === true
            ? 'highlighted-word'
            : highlightWords

          codeOptions.transformers ||= []
          codeOptions.transformers.push(transformerWordHighlight(words, className))
        }
      }

      try {
        const fragment = highlighter.codeToHast(code, codeOptions)
        cache?.set(code, fragment.children)
        parent.children.splice(index, 1, ...fragment.children)
      }
      catch (error) {
        if (options.onError)
          options.onError(error)
        else
          throw error
      }
    })
  }
}

function inheritElement(original: Element, overrides: Partial<Element>): Element {
  return {
    // Dereference properties
    ...structuredClone(original),
    ...overrides,
  }
}

function transformerWordHighlight(words: string[], className: string): ShikijiTransformer {
  return {
    name: 'rehype-shikiji:word-class',
    token(node, _line, _col, lineEl) {
      const textNode = node.children[0]

      if (textNode.type !== 'text')
        return node
      // This may include whitespaces, we should only highlight the specified word
      const originalText = textNode.value
      const trimmedText = textNode.value.trim()

      const createNode = (value: string) => inheritElement(node, {
        children: [
          {
            type: 'text',
            value,
          },
        ],
      })

      for (const word of words) {
        if (trimmedText !== word)
          continue
        const index = textNode.value.indexOf(word)
        const nodes: Element[] = []

        if (index > 0)
          nodes.push(createNode(originalText.slice(0, index)))

        const highlightedNode = createNode(word)
        addClassToHast(highlightedNode, className)
        nodes.push(highlightedNode)

        if (index + word.length < originalText.length)
          nodes.push(createNode(originalText.slice(index + word.length)))

        // To insert
        lineEl.children.push(...nodes.slice(0, -1))
        return nodes[nodes.length - 1]
      }
    },
  }
}

export default rehypeShikijiFromHighlighter
