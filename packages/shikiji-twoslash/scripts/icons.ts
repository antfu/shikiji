import fs from 'node:fs/promises'
import { icons as codicon } from '@iconify-json/codicon'
import { icons as carbon } from '@iconify-json/carbon'
import { fromHtml } from 'hast-util-from-html'
import type { TwoSlashReturn } from '@typescript/twoslash'

type CompletionItem = NonNullable<TwoSlashReturn['queries'][0]['completions']>[0]

const iconsMap: Partial<Record<CompletionItem['kind'], string>> = {
  module: 'carbon:3d-mpr-toggle',
  class: 'carbon:data-class',
  method: 'carbon:function',
  property: 'carbon:tools',
  constructor: 'carbon:3d-software',
  interface: 'carbon:connect',
  function: 'carbon:function',
  string: 'carbon:string-text',
}

const result = Object.fromEntries(
  Object.entries(iconsMap).map(([key, value]) => {
    const iconset = value.startsWith('codicon:') ? codicon : carbon
    const icon = iconset.icons[value.split(':')[1]]
    if (!icon)
      throw new Error(`icon not found: ${value}`)
    const str = `<svg viewBox="0 0 ${carbon.height} ${carbon.height}">${icon.body}</svg>`
    const hast = fromHtml(str, { space: 'svg', fragment: true }).children[0]
    return [key, hast]
  }),
)

await fs.writeFile(
  './src/completion-icons.json',
  `${JSON.stringify(result, (r, v) => {
    if (v?.position)
      delete v.position
    return v
  }, 2)}\n`,
  'utf-8',
)
