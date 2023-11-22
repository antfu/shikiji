import type { ShikijiTransformer } from 'shikiji'
import type { Element } from 'hast'
import { addClassToHast } from 'shikiji'

const regexMatch = /\[!code (.*?)\]/

export interface TransformerDiffNotationOptions {
  /**
   * Class for focused lines
   */
  classFocused?: string
  /**
   * Class added to the root element when the code has focused lines
   */
  classRootHasFocus?: string
}

/**
 * Use `[!code focus]` to mark focused lines.
 */
export function transformerFocusNotation(
  options: TransformerDiffNotationOptions = {},
): ShikijiTransformer {
  const {
    classFocused = 'focused',
    classRootHasFocus = 'has-focused',
  } = options

  return {
    name: 'shikiji-transformers:focus-notation',
    pre(code) {
      let hasMatched = false
      const codeEl = code.children[0] as Element
      for (const line of codeEl.children) {
        if (line.type !== 'element')
          continue
        let nodeToRemove: Element | undefined
        for (const child of line.children) {
          if (child.type !== 'element')
            continue
          const text = child.children[0]
          if (text.type !== 'text')
            continue
          const match = text.value.match(regexMatch)
          if (!match)
            continue
          if (match[1] === 'focus') {
            nodeToRemove = child
            addClassToHast(line, classFocused)
            hasMatched = true
            break
          }
        }
        if (nodeToRemove)
          line.children.splice(line.children.indexOf(nodeToRemove), 1)
      }

      if (hasMatched && classRootHasFocus)
        addClassToHast(code, classRootHasFocus)
    },
  }
}
