import type { ShikijiTransformer } from 'shikiji'
import type { Element } from 'hast'
import { addClassToHast } from 'shikiji'

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
   * Class added to the root element when the file has diff
   */
  classHasDiff?: string
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
    classHasDiff = 'has-diff',
  } = options

  return {
    name: 'shikiji-transformers:diff-notation',
    pre(code) {
      let hasDiff = false
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
          const className = match[1] === '--'
            ? classRemoved
            : classAdded
          nodeToRemove = child
          addClassToHast(line, className)
          hasDiff = true
          break
        }
        if (nodeToRemove)
          line.children.splice(line.children.indexOf(nodeToRemove), 1)
      }

      if (hasDiff && classHasDiff)
        addClassToHast(code, classHasDiff)
    },
  }
}
