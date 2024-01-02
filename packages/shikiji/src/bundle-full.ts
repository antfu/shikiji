import type { HighlighterGeneric } from 'shikiji-core'
import getWasm from 'shikiji/auto.wasm'
import { createSingletonShorthands, createdBundledHighlighter } from './core'
import type { BundledLanguage } from './assets/langs-bundle-full'
import type { BundledTheme } from './themes'
import { bundledLanguages } from './assets/langs-bundle-full'
import { bundledThemes } from './themes'

export * from './core'
export * from './themes'
export * from './assets/langs-bundle-full'
export * from './wasm'

export type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

export const getHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
>(
  bundledLanguages,
  bundledThemes,
  getWasm,
)

export const {
  codeToHtml,
  codeToHast,
  codeToThemedTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
} = /* @__PURE__ */ createSingletonShorthands<
  BundledLanguage,
  BundledTheme
>(
  getHighlighter,
)
