import { type ShikijiTransformer, addClassToHast } from 'shikiji'
import type { Element } from 'hast'
import { parseHighlightLines } from './line-highlight'
import { parseHighlightWords } from './word-highlight'

export interface HighlightOptions {
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
}

export function configureHighlights(attrs: string, { highlightLines = true, highlightWords = true }: HighlightOptions): ShikijiTransformer[] {
  const transformers: ShikijiTransformer[] = []

  if (highlightLines) {
    const lines = parseHighlightLines(attrs)

    if (lines) {
      const className = highlightLines === true
        ? 'highlighted'
        : highlightLines

      transformers.push({
        name: 'shikiji-builtin:line-class',
        line(node, line) {
          if (lines.includes(line))
            addClassToHast(node, className)
          return node
        },
      })
    }
  }

  if (highlightWords) {
    const words = parseHighlightWords(attrs)

    if (words) {
      const className = highlightWords === true
        ? 'highlighted-word'
        : highlightWords

      transformers.push(transformerWordHighlight(words, className))
    }
  }

  return transformers
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
    name: 'shikiji-builtin:word-class',
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
