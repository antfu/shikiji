---
outline: deep
---

# 捆绑包

主要的 `shikiji` 入口通过延迟的动态导入捆绑了所有支持的主题和语言。对于大多数情况来说，效率不应该是一个问题，因为语法只有在使用时才会被导入或下载。 然而，当你将 Shikiji 捆绑到浏览器运行时或 Web Worker 中时，即使这些文件没有被导入，它们仍然会增加你的分发大小。我们提供了 [细粒度捆绑](/zh/guide/install#细粒度捆绑) 以帮助你根据需要逐个组合语言和主题。

方便起见，我们还提供了一些预制的捆绑供你使用。

## `shikiji/bundle/full`

> [捆绑包大小](/zh/guide/#捆绑包大小): 6.4 MB (minified)，1.2 MB (gzip)，包含异步块

与 `shikiji` 相同，这个捆绑包包含了所有的主题和语言。

## `shikiji/bundle/web`

> [捆绑包大小](/zh/guide/#捆绑包大小): 3.8 MB (minified)，695 KB (gzip)，包含异步块

这个捆绑包包含了所有的主题和一些常见的 Web 语言（例如 HTML，CSS，JS，TS，JSON 和 Markdown 等）以及一些框架支持（例如 Vue，JSX 和 Svelte 等）。

和正常情况一样，该捆绑包中也可使用 `shikiji` 的所有功能。

```ts twoslash
import {
  BundledLanguage,
  BundledTheme,
  codeToHtml,
  getHighlighter
} from 'shikiji/bundle/web' // [!code highlight]

const highlighter = await getHighlighter({
  langs: ['html', 'css', 'js'],
  themes: ['github-dark', 'github-light'],
})
```
