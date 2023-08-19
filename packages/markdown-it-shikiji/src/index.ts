import type MarkdownIt from 'markdown-it'
import { bundledLanguages, getHighlighter } from 'shikiji'
import type { BuiltinLanguage, BuiltinTheme, CodeOptionsThemes, Highlighter, LanguageInput } from 'shikiji'

export type MarkdownItShikijiOptions = MarkdownItShikijiSetupOptions & {
  /**
   * Language names to include.
   *
   * @default Object.keys(bundledLanguages)
   */
  langs?: Array<LanguageInput | BuiltinLanguage>
}

export type MarkdownItShikijiSetupOptions = CodeOptionsThemes<BuiltinTheme>

function setup(markdownit: MarkdownIt, highlighter: Highlighter, options: MarkdownItShikijiSetupOptions) {
  markdownit.options.highlight = (code, lang = 'text', attrs) => {
    return highlighter.codeToHtml(
      code,
      {
        ...options,
        lang: lang as any,
      },
    ).replace('<code>', `<code class="language-${lang}">`)
  }
}

export default async function markdownItShikiji(options: MarkdownItShikijiOptions) {
  const themeNames = ('themes' in options ? Object.values(options.themes) : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const highlighter = await getHighlighter({
    themes: themeNames,
    langs: options.langs || Object.keys(bundledLanguages) as BuiltinLanguage[],
  })

  return function (markdownit: MarkdownIt) {
    setup(markdownit, highlighter, options)
  }
}
