import type { ThemeRegisteration, ThemedToken } from '../types'
import { _syncThemedTokens } from './renderer-html-dual-themes'

export function renderToThemedTokensDualThemes(
  themes: [string, ThemedToken[][], ThemeRegisteration][],
  cssVariablePrefix = '--shiki-',
  defaultColor = true,
): { rootStyle: string; rootClass: string; tokens: ThemedToken[][] } {
  const synced = _syncThemedTokens(...themes.map(t => t[1]))

  const merged: ThemedToken[][] = []
  for (let i = 0; i < synced[0].length; i++) {
    const lines = synced.map(t => t[i])
    const lineout: any[] = []
    merged.push(lineout)
    for (let j = 0; j < lines[0].length; j++) {
      const tokens = lines.map(t => t[j])
      const colors = tokens.map((t, idx) => `${idx === 0 && defaultColor ? '' : `${cssVariablePrefix + themes[idx][0]}:`}${t.color || 'inherit'}`).join(';')
      lineout.push({
        ...tokens[0],
        color: colors,
        htmlStyle: defaultColor ? undefined : colors,
      })
    }
  }

  const fg = themes.map((t, idx) => idx === 0 && defaultColor ? `color: ${t[2].fg}; ${cssVariablePrefix + t[0]}: ${t[2].fg}` : `${cssVariablePrefix + t[0]}: ${t[2].fg}`).join(';')
  const bg = themes.map((t, idx) => idx === 0 && defaultColor ? `background-color: ${t[2].bg}; ${cssVariablePrefix + t[0]}-bg: ${t[2].bg}` : `${cssVariablePrefix + t[0]}-bg: ${t[2].bg}`).join(';')

  return {
    tokens: merged,
    rootClass: `shiki shiki-dual-themes ${themes.map(t => t[2].name).join(' ')}`,
    rootStyle: `${fg};${bg}`,
  }
}
