import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { rendererRich, transformerTwoSlash } from 'shikiji-twoslash'
import { bundledThemes } from 'shikiji'
import { version } from '../../package.json'
import vite from './vite.config'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/' },
  { text: 'Shorthands', link: '/guide/shorthands' },
  { text: 'Dual Themes', link: '/guide/dual-themes' },
  { text: 'Transformers', link: '/guide/transformers' },
  { text: 'Compat Build', link: '/guide/compat' },
]

const REFERENCES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Themes', link: '/themes' },
  { text: 'Languages', link: '/languages' },
]

const INTEGRATIONS: DefaultTheme.NavItemWithLink[] = [
  { text: 'Common Transformers', link: '/packages/transformers' },
  { text: 'TypeScript TwoSlash', link: '/packages/twoslash' },
  { text: 'Markdown It', link: '/packages/markdown-it' },
  { text: 'Rehype', link: '/packages/rehype' },
  { text: 'Monaco Editor', link: '/packages/monaco' },
]

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: 'https://github.com/antfu/shikiji/releases' },
  { text: `Contributing`, link: 'https://github.com/antfu/shikiji/blob/main/CONTRIBUTING.md' },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Shikiji',
  description: 'A beautiful and powerful syntax highlighter',
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    async shikijiSetup(shikiji) {
      await Promise.all(Object.keys(bundledThemes).map(async (theme) => {
        await shikiji.loadTheme(theme as any)
      }))
    },
    codeTransformers: [
      transformerTwoSlash({
        explicitTrigger: true,
        renderer: rendererRich({
          formatInfo(info) {
            return info
              .replace(/\<"abap".*?\>/, '<BundledLanguages>')
              .replace(/\<"abap".*\.\.\./, '<BundledLanguages>...')
              .replace(/\<"css-variables".*?\>/, '<BundledThemes>')
              .replace(/\<"css-variables".*\.\.\./, '<BundledThemes>...')
          },
        }),
      }),
      {
        // Render custom themes with codeblocks
        name: 'shikiji:inline-theme',
        preprocess(code, options) {
          const reg = /\btheme:([\w,-]+)\b/
          const match = options.meta?.__raw?.match(reg)
          if (!match?.[1])
            return
          const theme = match[1]
          const themes = theme.split(',').map(i => i.trim())
          if (!themes.length)
            return
          if (themes.length === 1) {
            // @ts-expect-error anyway
            delete options.themes
            // @ts-expect-error anyway
            options.theme = themes[0]
          }
          else if (themes.length === 2) {
            // @ts-expect-error anyway
            delete options.theme
            // @ts-expect-error anyway
            options.themes = {
              light: themes[0],
              dark: themes[1],
            }
          }
          else {
            throw new Error(`Only 1 or 2 themes are supported, got ${themes.length}`)
          }
          return code
        },
      },
      {
        name: 'shikiji:vitepress-patch',
        preprocess(code, options) {
          const cleanup = options.transformers?.find(i => i.name === 'vitepress:clean-up')
          if (!cleanup)
            return
          options.transformers?.splice(options.transformers.indexOf(cleanup), 1)
        },
      },
    ],
  },

  cleanUrls: true,
  vite,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      {
        text: 'Guide',
        items: [
          {
            items: GUIDES,
          },
        ],
      },
      {
        text: 'Integrations',
        items: INTEGRATIONS,
      },
      {
        text: 'References',
        items: REFERENCES,
      },
      // {
      //   text: 'Play',
      //   link: '/play',
      // },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],

    sidebar: Object.assign(
      {},
      {
        '/': [
          {
            text: 'Guide',
            items: GUIDES,
          },
          {
            text: 'Integrations',
            items: INTEGRATIONS,
          },
          {
            text: 'References',
            items: REFERENCES,
          },
        ],
      },
    ),

    editLink: {
      pattern: 'https://github.com/antfu/shikiji/edit/main/:path',
      text: 'Suggest changes to this page',
    },
    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/antfu/shikiji' },
      { icon: 'discord', link: 'https://eslint.style/chat' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021 Pine Wu, 2023-PRESENT Anthony Fu.',
    },
  },

  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Pine Wu, Anthony Fu' }],
    // ['meta', { property: 'og:title', content: 'Shikiji' }],
    // ['meta', { property: 'og:image', content: 'https://shikiji.netlify.app/og.png' }],
    // ['meta', { property: 'og:description', content: 'A beautiful and powerful syntax highlighter' }],
    // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // ['meta', { name: 'twitter:image', content: 'https://shikiji.netlify.app/og.png' }],
    // ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
