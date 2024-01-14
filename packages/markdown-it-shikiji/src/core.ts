import type MarkdownIt from 'markdown-it'
import type { BuiltinTheme, CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptions, HighlighterGeneric, ShikijiTransformer, TransformerOptions } from 'shikiji'
import type { HighlightOptions } from '../../shared/highlight-transformer'
import { configureHighlights } from '../../shared/highlight-transformer'

export interface MarkdownItShikijiExtraOptions extends HighlightOptions {
  /**
   * Custom meta string parser
   * Return an object to merge with `meta`
   *
   * The special key `_attrs` will be used to filter meta string before processing highlights
   */
  parseMetaString?: (
    metaString: string,
    code: string,
    lang: string,
  ) => Record<string, any> | undefined | null
}

export type MarkdownItShikijiSetupOptions =
  & CodeOptionsThemes<BuiltinTheme>
  & TransformerOptions
  & CodeOptionsMeta
  & MarkdownItShikijiExtraOptions

export function setupMarkdownIt(
  markdownit: MarkdownIt,
  highlighter: HighlighterGeneric<any, any>,
  options: MarkdownItShikijiSetupOptions,
) {
  const {
    highlightLines,
    highlightWords,
    parseMetaString,
  } = options

  markdownit.options.highlight = (code, lang = 'text', attrs) => {
    const meta = parseMetaString?.(attrs, code, lang) || {}
    const highlightMeta = typeof meta._attrs === 'string' ? meta._attrs : attrs
    const codeOptions: CodeToHastOptions = {
      ...options,
      lang,
      meta: {
        ...options.meta,
        ...meta,
        __raw: attrs,
      },
    }

    const builtInTransformer: ShikijiTransformer[] = []

    builtInTransformer.push(...configureHighlights(highlightMeta, { highlightLines, highlightWords }))

    builtInTransformer.push({
      name: 'markdown-it-shikiji:block-class',
      code(node) {
        node.properties.class = `language-${lang}`
      },
    })

    return highlighter.codeToHtml(
      code,
      {
        ...codeOptions,
        transformers: [
          ...builtInTransformer,
          ...codeOptions.transformers || [],
        ],
      },
    )
  }
}

export function fromHighlighter(
  highlighter: HighlighterGeneric<any, any>,
  options: MarkdownItShikijiSetupOptions,
) {
  return function (markdownit: MarkdownIt) {
    setupMarkdownIt(markdownit, highlighter, options)
  }
}
