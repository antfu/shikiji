import type { HighlighterCoreOptions, HighlighterGeneric } from '../types'
import { codeToHtml } from './renderer-html'
import { codeToTokensWithThemes } from './renderer-html-themes'
import { codeToThemedTokens } from './tokenizer'
import { getShikiInternal } from './context'
import { codeToHast } from './renderer-hast'

export type HighlighterCore = HighlighterGeneric<never, never>

export async function getHighlighterCore(options: HighlighterCoreOptions = {}): Promise<HighlighterCore> {
  const context = await getShikiInternal(options)

  return {
    codeToThemedTokens: (code, options) => codeToThemedTokens(context, code, options),
    codeToTokensWithThemes: (code, options) => codeToTokensWithThemes(context, code, options),
    codeToHast: (code, options) => codeToHast(context, code, options),
    codeToHtml: (code, options) => codeToHtml(context, code, options),

    loadLanguage: context.loadLanguage,
    loadTheme: context.loadTheme,

    getTheme: context.getTheme,

    getLoadedThemes: context.getLoadedThemes,
    getLoadedLanguages: context.getLoadedLanguages,

    getInternalContext: () => context,
  }
}
