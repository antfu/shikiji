import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: '开始', link: '/zh/guide/' },
  { text: '安装', link: '/zh/guide/install' },
  { text: '捆绑包', link: '/zh/guide/bundles' },
  { text: '双主题', link: '/zh/guide/dual-themes' },
  { text: '转换器', link: '/zh/guide/transformers' },
  { text: '主题颜色控制', link: '/zh/guide/theme-colors' },
  { text: '兼容构建', link: '/zh/guide/compat' },
  { text: '自定义主题', link: '/zh/guide/load-theme' },
  { text: '自定义语言', link: '/zh/guide/load-lang' },
]

const REFERENCES: DefaultTheme.NavItemWithLink[] = [
  { text: '主题', link: '/zh/themes' },
  { text: '语言', link: '/zh/languages' },
]

const INTEGRATIONS: DefaultTheme.NavItemWithLink[] = [
  { text: 'TypeScript Twoslash', link: '/zh/packages/twoslash' },
  { text: 'Markdown It', link: '/zh/packages/markdown-it' },
  { text: 'Rehype', link: '/zh/packages/rehype' },
  { text: 'Monaco Editor', link: '/zh/packages/monaco' },
  { text: 'VitePress', link: '/zh/packages/vitepress' },
  { text: 'Astro', link: '/zh/packages/astro' },
  { text: '常用转换器', link: '/zh/packages/transformers' },
  { text: 'CLI', link: '/zh/packages/cli' },
]

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/zh' },
  { text: `发布说明`, link: 'https://github.com/antfu/shikiji/releases' },
  { text: `贡献`, link: 'https://github.com/antfu/shikiji/blob/main/CONTRIBUTING.md' },
]

export const zhConfig = defineConfig({
  lang: 'zh-CN',
  description: '美观而强大的语法高亮显示器',

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
    nav: [
      {
        text: '指南',
        items: [
          {
            items: GUIDES,
          },
        ],
      },
      {
        text: '集成',
        items: INTEGRATIONS,
      },
      {
        text: '参考',
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
            text: '指南',
            items: GUIDES,
          },
          {
            text: '集成',
            items: INTEGRATIONS,
          },
          {
            text: '参考',
            items: REFERENCES,
          },
        ],
      },
    ),

    editLink: {
      pattern: 'https://github.com/antfu/shikiji/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    outline: {
      label: '目录',
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    footer: {
      message: '以 MIT 许可证发布',
      copyright: '版权所有 © 2021 Pine Wu，2023-PRESENT Anthony Fu.',
    },
  },
})
