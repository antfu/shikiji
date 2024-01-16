import { type ShikijiTransformer, addClassToHast } from 'shikiji'
import type { Element } from 'hast'
import { createCommentNotationTransformer } from '../utils'

export interface TransformerNotationWordHighlightOptions {
  /**
   * Class for highlighted words
   */
  classActiveWord?: string
  /**
   * Class added to the root element when the code has highlighted words
   */
  classActivePre?: string
}

export function transformerNotationWordHighlight(
  options: TransformerNotationWordHighlightOptions = {},
): ShikijiTransformer {
  const {
    classActiveWord = 'highlighted-word',
    classActivePre = undefined,
  } = options

  return createCommentNotationTransformer(
    'shikiji-transformers:notation-highlight-word',
    /^\s*(?:\/\/|\/\*|<!--|#)\s+\[!code word:(\w+)(:\d+)?\]\s*(?:\*\/|-->)?/,
    function ([_, word, range], _line, comment, lines, index) {
      const lineNum = range ? Number.parseInt(range.slice(1), 10) : lines.length

      lines
      // Don't include the comment itself
        .slice(index + 1, index + 1 + lineNum)
        .forEach((line) => {
          line.children = line.children.flatMap((span) => {
            if (span.type !== 'element' || span.tagName !== 'span' || span === comment)
              return span

            const textNode = span.children[0]

            if (textNode.type !== 'text')
              return span

            return replaceSpan(span, textNode.value, word, classActiveWord) ?? span
          })
        })

      if (classActivePre)
        addClassToHast(this.pre, classActivePre)
      return true
    },
  )
}

function inheritElement(original: Element, overrides: Partial<Element>): Element {
  return {
    // Dereference properties
    ...structuredClone(original),
    ...overrides,
  }
}

function replaceSpan(span: Element, text: string, word: string, className: string): Element[] | undefined {
  const index = text.indexOf(word)

  if (index === -1)
    return

  const createNode = (value: string) => inheritElement(span, {
    children: [
      {
        type: 'text',
        value,
      },
    ],
  })

  const nodes: Element[] = []

  if (index > 0)
    nodes.push(createNode(text.slice(0, index)))

  const highlightedNode = createNode(word)
  addClassToHast(highlightedNode, className)
  nodes.push(highlightedNode)

  if (index + word.length < text.length)
    nodes.push(createNode(text.slice(index + word.length)))

  return nodes
}
