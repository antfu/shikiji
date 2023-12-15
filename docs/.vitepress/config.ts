import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { rendererRich, transformerTwoSlash } from 'shikiji-twoslash'
import { version } from '../../package.json'
import vite from './vite.config'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/' },
  { text: 'Configuration', link: '/guide/config' },
  { text: 'Transformers', link: '/guide/transformers' },
  { text: 'API', link: '/guide/api' },
]

const INTEGRATIONS: DefaultTheme.NavItemWithLink[] = [
  { text: 'Common Transformers', link: '/packages/transformers' },
  { text: 'TypeScript TwoSlash', link: '/packages/twoslash' },
  { text: 'Markdown It', link: '/packages/markdown-it' },
  { text: 'Rehype', link: '/packages/rehype' },
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
    codeTransformers: [
      transformerTwoSlash({
        explicitTrigger: true,
        renderer: rendererRich(),
      }),
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
        text: 'Play',
        link: '/play',
      },
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
