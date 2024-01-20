---
outline: deep
---

# 安装

<Badges name="shikiji" />

使用 npm 安装，或 [使用 CDN](#cdn-usage)：
::: code-group

```sh [npm]
npm install -D shikiji
```

```sh [yarn]
yarn add -D shikiji
```

```sh [pnpm]
pnpm add -D shikiji
```

```sh [bun]
bun add -D shikiji
```

:::

## 集成

我们也提供了一些集成：

- [Markdown It 插件](/zh/packages/markdown-it)
- [Rehype 插件](/zh/packages/rehype)
- [TypeScript Twoslash 插件](/zh/packages/twoslash)
- [Monaco Editor 语法高亮](/zh/packages/monaco)
- [CLI](/zh/packages/cli)
- [常用转换器（Transformers）](/zh/packages/transformers)

## 使用方法

### 简写

使用 `shikiji` 的最快方式是使用我们提供的简写函数。它会根据需求加载必要的主题和语言，并自动将其缓存到内存中。

将你的代码片段传给 `codeToHtml` 函数并指定 `lang` 和 `theme`，它将返回一个带有高亮显示的 HTML 字符串，你可以嵌入到页面中。生成的 HTML 中的标记都有相应的内联样式，因此你不需要额外的 CSS 来进行样式设置。

```ts twoslash
import { codeToHtml } from 'shikiji'

const code = 'const a = 1' // 输入代码
const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'vitesse-dark'
})

console.log(html) // 带有高亮显示的 HTML 字符串
```

更进一步，你还可以使用 `codeToThemedTokens` 或 `codeToHast` 来获取中间数据结构，并自行渲染它们：

```ts twoslash theme:min-dark
import { codeToThemedTokens } from 'shikiji'

const tokens = await codeToThemedTokens('<div class="foo">bar</div>', {
  lang: 'html',
  theme: 'min-dark'
})
```

```ts twoslash theme:catppuccin-mocha
import { codeToHast } from 'shikiji'

const hast = codeToHast('.text-red { color: red; }', {
  lang: 'css',
  theme: 'catppuccin-mocha'
})
```

### 高亮器用法

我们提供的 [简写](#简写) 是异步执行的，因为我们使用了 WASM，并在内部按需加载主题和语言。在某些情况下，你可能需要同步地高亮代码，因此我们提供了 `getHighlighter` 函数来创建一个可以在后续同步使用的高亮器实例。

用法与 `shiki` 基本相同，其中，每个主题和语言文件都是动态导入的 ES 模块。最好**显式地**列出语言和主题以获得最佳性能。

```ts twoslash theme:nord
import { getHighlighter } from 'shikiji'

// `getHighlighter` 是异步的，它会初始化内部（internal）
// 并加载指定的语言和主题。
const highlighter = await getHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
})

// 然后你就可以同步地使用 `highlighter.codeToHtml`
// 并使用你刚刚指定的其中一个主题和语言。
const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'nord'
})
```

此外，如果要在创建高亮器后加载主题和语言，可以使用 `loadTheme` 和 `loadLanguage` 方法。

```ts twoslash
import { getHighlighter } from 'shikiji'
const highlighter = await getHighlighter({ themes: [], langs: [] })
// ---cut---
// 在创建后加载主题和语言
await highlighter.loadTheme('vitesse-light')
await highlighter.loadLanguage('css')
```

与默认加载所有主题和语言的 `shiki` 不同，`shikiji` 要求所有的主题和语言被显式的加载。

```ts theme:slack-dark twoslash
import { getHighlighter } from 'shikiji'

const highlighter = await getHighlighter({ /* ... */ })

highlighter.codeToHtml(
  'const a = 1',
  { lang: 'javascript', theme: 'slack-dark' }
)
// @error: Throw error, `javascript` is not loaded

await highlighter.loadLanguage('javascript') // 加载语言
```

如果你想加载所有主题和语言（并不建议），你可以遍历 `bundledLanguages` 和 `bundledThemes` 中的所有键。

```ts twoslash theme:poimandres
import { bundledLanguages, bundledThemes, getHighlighter } from 'shikiji'

const highlighter = await getHighlighter({
  themes: Object.keys(bundledThemes),
  langs: Object.keys(bundledLanguages),
})

highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'poimandres'
})
```

### 细粒度捆绑

当导入 `shikiji` 时，所有的主题和语言都被捆绑为异步块。通常情况下，如果你不使用它们，你就不必关注，因为它们不会被加载。某些情况下，如果你要控制这些捆绑包的内容，你可以使用核心（`shikiji/core`）来组合自己的捆绑包。

```ts twoslash theme:material-theme-ocean
// @noErrors
// `shikiji/core` 不包含任何主题、语言和 WASM 二进制文件
import { getHighlighterCore } from 'shikiji/core'

// `shikiji/wasm` 包含以 BASE64 字符串内联的 WASM 二进制文件
import getWasm from 'shikiji/wasm'

// 直接导入你需要的主题和语言模块，只有你导入的模块会被捆绑
import nord from 'shikiji/themes/nord.mjs'

const highlighter = await getHighlighterCore({
  themes: [
    // 你需要传入你导入的包，而不是字符串
    nord,
    // 如果你需要块分割（chunk splitting），请使用动态导入
    import('shikiji/themes/material-theme-ocean.mjs')
  ],
  langs: [
    import('shikiji/langs/javascript.mjs'),
    // shikiji 会尝试使用模块的默认导出
    () => import('shikiji/langs/css.mjs'),
    // 或者一个返回自定义语法的 getter
    async () => JSON.parse(await fs.readFile('my-grammar.json', 'utf-8'))
  ],
  loadWasm: getWasm
})

// 可选的，在创建后加载主题和语言
await highlighter.loadTheme(import('shikiji/themes/vitesse-light.mjs'))

const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'material-theme-ocean'
})
```

::: info 注意
[简写](#简写) 只在 `shikiji` 捆绑包中可用。对于细粒度捆绑，你可以使用 [`createSingletonShorthands`](https://github.com/antfu/shikiji/blob/main/packages/shikiji-core/src/bundle-factory.ts) 来创建一个简写函数或者自己实现。
:::

### 预设捆绑包

为了使用方便，我们还提供了一些预制的捆绑包，你可以在 [捆绑包](/zh/guide/bundles) 部分了解更多信息。

### 使用 CJS

为了减小包的大小，`shikiji` 以仅 ESM 的形式发布。但由于 Node.js 支持在 CJS 中动态导入 ESM 模块，你仍可以在 CJS 中使用它。

例如，以下 ESM 代码：

```ts twoslash
// ESM
import { getHighlighter } from 'shikiji'

async function main() {
  const highlighter = await getHighlighter({
    themes: ['vitesse-dark'],
    langs: ['javascript'],
  })

  const code = highlighter.codeToHtml('const a = 1', {
    theme: 'vitesse-dark',
    lang: 'javascript',
  })
}
```

可以在 CJS 中写成：

```ts twoslash
// CJS
async function main() {
  const { getHighlighter } = await import('shikiji')

  const highlighter = await getHighlighter({
    themes: ['vitesse-dark'],
    langs: ['javascript'],
  })

  const code = highlighter.codeToHtml('const a = 1', {
    theme: 'vitesse-dark',
    lang: 'javascript'
  })
}
```

### 使用 CDN

要在浏览器中通过 CDN 来使用 `shikiji`，你可以使用 [esm.run](https://esm.run) 或者 [esm.sh](https://esm.sh)。

```html theme:rose-pine
<body>
  <div id="foo"></div>

  <script type="module">
    // 保证指定了确切的版本号
    import { codeToHtml } from 'https://esm.sh/shikiji@0.8.0'
    // 或
    // import { codeToHtml } from 'https://esm.run/shikiji@0.8.0'

    const foo = document.getElementById('foo')
    foo.innerHTML = await codeToHtml('console.log("Hi, Shiki on CDN :)")', {
      lang: 'js',
      theme: 'rose-pine'
    })
  </script>
</body>
```

这非常高效，因为它只会按需加载语言和主题。对于上面的代码片段，只会发出四个请求（`shikiji`、`shikiji/themes/vitesse-light.mjs`、`shikiji/langs/javascript.mjs` 和 `shikiji/wasm.mjs`），共计传输约 200KB 的数据。

[示例](https://jsfiddle.net/rdasqhxu/1/)

### Cloudflare Workers

Cloudflare Workers [不支持从二进制数据初始化 WebAssembly](https://community.cloudflare.com/t/fixed-cloudflare-workers-slow-with-moderate-sized-webassembly-bindings/184668/3)，因此默认的 WASM 构建将无法工作。你需要将 WASM 作为资源上传并直接导入。

同时，建议使用 [细粒度捆绑](#细粒度捆绑) 来减小捆绑的体积。

```ts twoslash theme:nord
// @noErrors
import { getHighlighterCore, loadWasm } from 'shikiji/core'
import nord from 'shikiji/themes/nord.mjs'
import js from 'shikiji/langs/javascript.mjs'

// 将 WASM 作为资产导入
await loadWasm(import('shikiji/onig.wasm'))

export default {
  async fetch() {
    const highlighter = await getHighlighterCore({
      themes: [nord],
      langs: [js],
    })

    return new Response(highlighter.codeToHtml('console.log(\'shiki\');', {
      theme: 'nord',
      lang: 'js'
    }))
  },
}
```
