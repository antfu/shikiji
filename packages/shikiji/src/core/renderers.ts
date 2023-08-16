import type { CodeToHtmlOptions, CodeToHtmlThemesOptions, CodeToThemedTokensOptions, CodeToTokensWithThemesOptions, HighlighterContext, ThemedToken } from '../types'
import { tokenizeWithTheme } from './themedTokenizer'
import { renderToHtml } from './renderer-html'
import { isPlaintext } from './utils'
import { renderToHtmlThemes, syncThemesTokenization } from './renderer-html-themes'

export function codeToThemedTokens(
  context: HighlighterContext,
  code: string,
  options: CodeToThemedTokensOptions = {},
): ThemedToken[][] {
  const {
    lang = 'text',
    theme: themeName = context.getLoadedThemes()[0],
    includeExplanation = true,
  } = options

  if (isPlaintext(lang)) {
    const lines = code.split(/\r\n|\r|\n/)
    return [...lines.map(line => [{ content: line }])]
  }
  const _grammar = context.getLangGrammar(lang)
  const { theme, colorMap } = context.setTheme(themeName)
  return tokenizeWithTheme(code, _grammar, theme, colorMap, {
    includeExplanation,
  })
}

/**
 * Get highlighted code in HTML.
 */
export function codeToHtml(
  context: HighlighterContext,
  code: string,
  options: CodeToHtmlOptions = {},
): string {
  const tokens = codeToThemedTokens(context, code, {
    ...options,
    includeExplanation: false,
  })
  const _theme = context.getTheme(options.theme || context.getLoadedThemes()[0])
  return renderToHtml(tokens, {
    fg: _theme.fg,
    bg: _theme.bg,
    lineOptions: options?.lineOptions,
    themeName: _theme.name,
  })
}

/**
 * Get tokens with multiple themes, with synced
 */
export function codeToTokensWithThemes(
  context: HighlighterContext,
  code: string,
  options: CodeToTokensWithThemesOptions,
) {
  const themes = Object.entries(options.themes)
    .filter(i => i[1]) as [string, string][]

  const tokens = syncThemesTokenization(
    ...themes.map(t => codeToThemedTokens(context, code, {
      ...options,
      theme: t[1],
      includeExplanation: false,
    })),
  )

  return themes.map(([color, theme], idx) => [
    color,
    theme,
    tokens[idx],
  ] as [string, string, ThemedToken[][]])
}

export function codeToHtmlThemes(
  context: HighlighterContext,
  code: string,
  options: CodeToHtmlThemesOptions,
): string {
  const {
    defaultColor = 'light',
    cssVariablePrefix = '--shiki-',
  } = options

  const tokens = codeToTokensWithThemes(context, code, options)
    .sort(a => a[0] === defaultColor ? -1 : 1)

  return renderToHtmlThemes(
    tokens,
    tokens.map(i => context.getTheme(i[1])),
    cssVariablePrefix,
    defaultColor !== false,
    options,
  )
}
