---
outline: deep
---

# rehype-shikiji

<Badges name="rehype-shikiji" />

适用于 [rehype](https://github.com/rehypejs/rehype) 的 Shikiji 插件。

## 安装

```bash
npm i -D rehype-shikiji
```

## 使用方法

```ts twoslash
// @noErrors: true
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiji from 'rehype-shikiji'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShikiji, {
    // 或只有单个主题的 `theme` 字段
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    }
  })
  .use(rehypeStringify)
  .process(await fs.readFile('./input.md'))
```

## 细粒度捆绑

在默认情况下，会导入完整的 `shikiji` 捆绑包。如果你使用了一个 [细粒度捆绑](/zh/guide/install#细粒度捆绑)，你可以从 `rehype-shikiji/core` 中导入 `rehypeShikijiFromHighlighter` 并传入你自己的高亮器：

```ts twoslash
// @noErrors: true
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeShikijiFromHighlighter from 'rehype-shikiji/core'

import { fromHighlighter } from 'markdown-it-shikiji/core'
import { getHighlighterCore } from 'shikiji/core'
import getWasm from 'shikiji/wasm'

const highlighter = await getHighlighterCore({
  themes: [
    import('shikiji/themes/vitesse-light.mjs')
  ],
  langs: [
    import('shikiji/langs/javascript.mjs'),
  ],
  loadWasm: getWasm
})

const raw = await fs.readFile('./input.md')
const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShikijiFromHighlighter, highlighter, {
    // 或只有单个主题的 `theme` 字段
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    }
  })
  .use(rehypeStringify)
  .processSync(raw) // 也可以同步处理
```

## 功能

### 行高亮

::: warning 警告
已废弃，在 `v0.10.0` 版本中已被默认禁用，并会在下一个次版本（minor）中移除。应该考虑使用 [`transformerNotationHighlight`](/zh/packages/transformers#transformernotationhighlight)。
:::

除了支持 `shikiji` 的功能以外，此插件还支持行的高亮。你可以以 `{<line-numbers>}` 的格式在代码块语言标注后指定你要高亮的行；以逗号分隔行号（`<line-number>`），并用大括号包裹。每一个行号可以是一个单独的数（如 `{2}` 会高亮第 2 行， `{1,4}` 会高亮第 1 行和第 4 行），或者指定一个范围（如 `{5-7}` 会高亮第 5 到第 7 行，`{1-3,5-6}` 会高亮第 1 行到第 3 行，及第 5 行到第 6 行）。 例如：

````md
```js {1,3-4}
console.log('1') // 高亮
console.log('2')
console.log('3') // 高亮
console.log('4') // 高亮
```
````
