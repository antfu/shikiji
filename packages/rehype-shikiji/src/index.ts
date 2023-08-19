import type { BuiltinLanguage, BuiltinTheme, CodeOptionsThemes, LanguageInput } from 'shikiji'
import { bundledLanguages, getHighlighter } from 'shikiji'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'hast'

export type RehypeShikijiOptions = CodeOptionsThemes<BuiltinTheme> & {
  /**
   * Language names to include.
   *
   * @default Object.keys(bundledLanguages)
   */
  langs?: Array<LanguageInput | BuiltinLanguage>
}

const rehypeShikiji: Plugin<[RehypeShikijiOptions], Root> = function (options = {} as any) {
  const prefix = 'language-'
  const themeNames = ('themes' in options ? Object.values(options.themes) : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const promise = getHighlighter({
    themes: themeNames,
    langs: options.langs || Object.keys(bundledLanguages) as BuiltinLanguage[],
  })

  return async function (tree) {
    const highlighter = await promise

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

      const fragment = highlighter.codeToHast(toString(head as any), {
        ...options,
        lang: language.slice(prefix.length),
      })

      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'div',
        properties: {
          className: [
            'highlight',
          ],
        },
        children: fragment.children as any,
      })
    })
  }
}

export default rehypeShikiji
