/**
 * Generated by scripts/prepare.ts
 */
import type { DynamicImportLanguageRegistration, BundledLanguageInfo } from 'shikiji-core'

export const bundledLanguagesInfo: BundledLanguageInfo[] = [
  {
    'id': 'astro',
    'name': 'Astro',
    'import': (() => import('./langs/astro')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'blade',
    'name': 'Blade',
    'import': (() => import('./langs/blade')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'coffee',
    'name': 'CoffeeScript',
    'aliases': [
      'coffeescript'
    ],
    'import': (() => import('./langs/coffee')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'css',
    'name': 'CSS',
    'import': (() => import('./langs/css')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'graphql',
    'name': 'GraphQL',
    'aliases': [
      'gql'
    ],
    'import': (() => import('./langs/graphql')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'haml',
    'name': 'Ruby Haml',
    'import': (() => import('./langs/haml')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'handlebars',
    'name': 'Handlebars',
    'aliases': [
      'hbs'
    ],
    'import': (() => import('./langs/handlebars')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'html',
    'name': 'HTML',
    'import': (() => import('./langs/html')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'http',
    'name': 'HTTP',
    'import': (() => import('./langs/http')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'imba',
    'name': 'Imba',
    'import': (() => import('./langs/imba')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'javascript',
    'name': 'JavaScript',
    'aliases': [
      'js'
    ],
    'import': (() => import('./langs/javascript')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'jinja',
    'name': 'Jinja',
    'import': (() => import('./langs/jinja')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'jison',
    'name': 'Jison',
    'import': (() => import('./langs/jison')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'json',
    'name': 'JSON',
    'import': (() => import('./langs/json')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'jsonc',
    'name': 'JSON with Comments',
    'import': (() => import('./langs/jsonc')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'jsonl',
    'name': 'JSON Lines',
    'import': (() => import('./langs/jsonl')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'jsx',
    'name': 'JSX',
    'import': (() => import('./langs/jsx')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'julia',
    'name': 'Julia',
    'import': (() => import('./langs/julia')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'less',
    'name': 'Less',
    'import': (() => import('./langs/less')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'marko',
    'name': 'Marko',
    'import': (() => import('./langs/marko')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'mdc',
    'name': 'mdc',
    'import': (() => import('./langs/mdc')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'mdx',
    'name': 'MDX',
    'import': (() => import('./langs/mdx')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'php',
    'name': 'PHP',
    'import': (() => import('./langs/php')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'postcss',
    'name': 'PostCSS',
    'import': (() => import('./langs/postcss')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'pug',
    'name': 'Pug',
    'aliases': [
      'jade'
    ],
    'import': (() => import('./langs/pug')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'sass',
    'name': 'Sass',
    'import': (() => import('./langs/sass')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'scss',
    'name': 'SCSS',
    'import': (() => import('./langs/scss')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'stylus',
    'name': 'Stylus',
    'aliases': [
      'styl'
    ],
    'import': (() => import('./langs/stylus')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'svelte',
    'name': 'Svelte',
    'import': (() => import('./langs/svelte')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'tsx',
    'name': 'TSX',
    'import': (() => import('./langs/tsx')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'typescript',
    'name': 'TypeScript',
    'aliases': [
      'ts'
    ],
    'import': (() => import('./langs/typescript')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'vue',
    'name': 'Vue',
    'import': (() => import('./langs/vue')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'vue-html',
    'name': 'Vue HTML',
    'import': (() => import('./langs/vue-html')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'wasm',
    'name': 'WebAssembly',
    'import': (() => import('./langs/wasm')) as DynamicImportLanguageRegistration
  },
  {
    'id': 'wgsl',
    'name': 'WGSL',
    'import': (() => import('./langs/wgsl')) as DynamicImportLanguageRegistration
  }
]

export const bundledLanguagesBase = Object.fromEntries(bundledLanguagesInfo.map(i => [i.id, i.import]))

export const bundledLanguagesAlias = Object.fromEntries(bundledLanguagesInfo.flatMap(i => i.aliases?.map(a => [a, i.import]) || []))

export type BundledLanguage = 'astro' | 'blade' | 'coffee' | 'coffeescript' | 'css' | 'gql' | 'graphql' | 'haml' | 'handlebars' | 'hbs' | 'html' | 'http' | 'imba' | 'jade' | 'javascript' | 'jinja' | 'jison' | 'js' | 'json' | 'jsonc' | 'jsonl' | 'jsx' | 'julia' | 'less' | 'marko' | 'mdc' | 'mdx' | 'php' | 'postcss' | 'pug' | 'sass' | 'scss' | 'styl' | 'stylus' | 'svelte' | 'ts' | 'tsx' | 'typescript' | 'vue' | 'vue-html' | 'wasm' | 'wgsl'

export const bundledLanguages = {
  ...bundledLanguagesBase,
  ...bundledLanguagesAlias,
} as Record<BundledLanguage, DynamicImportLanguageRegistration>
