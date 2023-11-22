import type { ShikijiTransformer } from 'shikiji'
import type { Element } from 'hast'
import { addClassToHast } from 'shikiji'
import { isCommentLike } from './utils'

const regexMatch = /\[!code (\-\-|\+\+)\]/

export interface TransformerDiffNotationOptions {
  /**
   * Class for added lines
   */
  classAdded?: string
  /**
   * Class for removed lines
   */
  classRemoved?: string
  /**
   * Class added to the root element when the current code has diff
   */
  classRootActive?: string
}

/**
 * Use `[!code ++]` and `[!code --]` to mark added and removed lines.
 */
export function transformerDiffNotation(
  options: TransformerDiffNotationOptions = {},
): ShikijiTransformer {
  const {
    classAdded = 'diff added',
    classRemoved = 'diff removed',
    classRootActive = 'has-diff',
  } = options

  return {
    name: 'shikiji-transformers:diff-notation',
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
        const className = match[1] === '--'
          ? classRemoved
          : classAdded
        nodeToRemove = child
        addClassToHast(line, className)
        if (classRootActive)
          addClassToHast(this.pre, classRootActive)
        break
      }
      if (nodeToRemove)
        line.children.splice(line.children.indexOf(nodeToRemove), 1)
    },
  }
}
