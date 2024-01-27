// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { createPinia } from 'pinia'
import TwoslashFloatingVue from '../../../packages/vitepress-plugin-twoslash/src/client'

import '../../../packages/shikiji-twoslash/style-rich.css'
import 'floating-vue/dist/style.css'
import '../../../packages/vitepress-plugin-twoslash/src/style.css'
import 'uno.css'
import './style.css'
import './transformers.css'

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(createPinia())
    app.use(TwoslashFloatingVue)
  },
}

if (typeof window !== 'undefined') {
  const div = document.createElement('div')
  const a = document.createElement('a')
  a.href = 'https://shiki.style'
  a.textContent = 'shiki.style'
  a.className = 'underline font-bold'
  // @unocss-include
  div.className = 'bg-orange:10 text-orange p2 text-center'
  div.append(
    document.createTextNode('Shikiji has merged back to Shiki, this documentation will no longer updates. Please visit '),
    a,
    document.createTextNode(' for the latest documentation.'),
  )
  document.body.prepend(div)
}
