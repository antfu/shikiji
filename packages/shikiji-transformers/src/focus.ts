import type { ShikijiTransformer } from 'shikiji'
import type { Element } from 'hast'
import { addClassToHast } from 'shikiji'
import { isCommentLike } from './utils'

const regexMatch = /\[!code (.*?)\]/

export interface TransformerDiffNotationOptions {
  /**
   * Class for focused lines
   */
  classFocused?: string
  /**
   * Class added to the root element when the code has focused lines
   */
  classRootActive?: string
}

/**
 * Use `[!code focus]` to mark focused lines.
 */
export function transformerFocusNotation(
  options: TransformerDiffNotationOptions = {},
): ShikijiTransformer {
  const {
    classFocused = 'focused',
    classRootActive = 'has-focused',
  } = options

  return {
    name: 'shikiji-transformers:focus-notation',
    line(line) {
      let nodeToRemove: Element | undefined
      for (const child of line.children) {
        if (child.type !== 'element')
          continue
        if (!isCommentLike(child, line))
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
          if (classRootActive)
            addClassToHast(this.pre, classRootActive)
          break
        }
      }
      if (nodeToRemove)
        line.children.splice(line.children.indexOf(nodeToRemove), 1)
    },
  }
}
