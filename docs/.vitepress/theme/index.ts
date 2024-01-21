// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { createPinia } from 'pinia'
import TwoslashFloatingVue from '../../../packages/vitepress-plugin-twoslash/src/client'
import I18nCheckpointVue from '../components/I18nCheckpoint.vue'

import '../../../packages/shikiji-twoslash/style-rich.css'
import 'floating-vue/dist/style.css'
import '../../../packages/vitepress-plugin-twoslash/src/style.css'
import 'uno.css'
import './style.css'
import './transformers.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      'doc-after': () => h(I18nCheckpointVue),
    })
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(createPinia())
    app.use(TwoslashFloatingVue)
  },
}
