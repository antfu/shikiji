---
outline: deep
---

# 简介

<br>

<span text-xl text-green>
<b><span text-brand-yellow>Shiki</span><span text-brand-red>ji</span></b> <ruby text-brand-yellow>式<rt>shiki</rt></ruby><ruby text-brand-red>辞<rt>ji</rt></ruby>
</span> 是一款美观而强大的语法高亮器，它基于 TextMate 语法及主题，与 VS Code 的语法高亮引擎相同。它能为几乎所有主流的编程语言提供非常准确和快速的语法高亮显示。

没有需要维护的自定义正则表达式，没有需要维护的自定义 CSS，也没有需要维护的自定义 HTML；并随着你在 VS Code 中喜欢使用的语言和主题的发展，你的语法高亮也会相应的发展。

Shikiji 是对 [Shiki](https://github.com/shikijs/shiki) 的 ESM 重写，并做了一些改进。我们的目标是 [将本项目作为里程碑更新合并回 Shiki](https://github.com/shikijs/shiki/issues/510)。如果你要进行迁移，请查看 [Shikiji 兼容版本相对于 Shiki 的破坏性改动](/guide/compat)。

至于这个名字，<ruby text-lg text-brand-yellow>式<rt>shiki</rt></ruby><ruby text-lg text-brand-red>辞<rt>ji</rt></ruby> 是一个日语词汇，意为 [“仪式演讲（Ceremonial Speech）”](https://jisho.org/word/%E5%BC%8F%E8%BE%9E)。 <ruby text-brand-yellow text-lg>式<rt>shiki</rt></ruby> 继承自 [Shiki](https://github.com/shikijs/shiki)，意为 [“风格”](https://jisho.org/word/%E5%BC%8F)；<ruby text-brand-red text-lg>辞<rt>ji</rt></ruby> 意为 [“词”](https://jisho.org/word/%E8%BE%9E)。

哦对了，如你所愿，本文档中的所有代码块都是由 Shikiji 高亮的。

## 功能

- 所有语法 / 主题 / WASM 都以纯 ESM 的形式提供，不再需要 [CDN](https://github.com/shikijs/shiki#specify-a-custom-root-directory)，也没有其他 [资产](https://github.com/shikijs/shiki#specify-how-to-load-webassembly)
- 通用便携，不依赖于 Node.js API 和文件系统，可以在任何现代 JavaScript 运行时上运行
- 默认仅支持 ESM，不过你依然可以 [使用 CDN](/guide/install#cdn-usage) 或 [使用 CJS](/guide/install#cjs-usage)
- [语言与主题捆绑](/guide/install#fine-grained-bundle)
- [深色与浅色主题支持](/guide/dual-themes)
- [基于 AST 的转换器插件](/guide/transformers)
- [`hast` 支持](/guide/transformers#codetohast)
- [TypeScript Twoslash](/packages/twoslash)
- [Shiki 兼容版本](/guide/compat)

## 演练场

这里有一个小演练场供你尝试如何使用 Shikiji 高亮显示你的代码。与在构建时运行的其他代码块不同，此演练场在浏览器客户端上渲染，其相关主题和语言按需加载。

<ShikijiMiniPlayground />

在你的项目中 [安装 Shikiji](/guide/install)。

## 谁在使用？

依赖 Shikiji 的项目（按字母顺序排序）：

- [Astro](https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting)
- [Expressive Code](https://expressive-code.com/)
- [JSX email](https://jsx.email/)
- [Lobe UI](https://github.com/lobehub/lobe-ui)
- [Nuxt Content](https://content.nuxt.com/usage/markdown#code-highlighting)
- [Slidev](https://sli.dev/custom/highlighters.html#highlighters)
- [VitePress](https://vitepress.dev/guide/markdown#syntax-highlighting-in-code-blocks)
- [Vocs](https://github.com/wevm/vocs)

## 捆绑包大小

你可以在 [pkg-size.dev/shikiji](https://pkg-size.dev/shikiji) 上查看详细的捆绑包大小。

截止 `v0.9.11`，2023 年 12 月 21 日的数据如下：

| 捆绑包                | 大小 (minified) | 大小 (gzip) | 备注                                             |
| --------------------- | --------------: | ----------: | ------------------------------------------------ |
| `shikiji`             |          6.4 MB |      1.2 MB | 所有主题和语言的异步块（chunks）                 |
| `shikiji/bundle/full` |          6.4 MB |      1.2 MB | 与 `shikiji` 包相同                              |
| `shikiji/bundle/web`  |          3.8 MB |      695 KB | 所有主题和常用 Web 语言的异步块                  |
| `shikiji/core`        |          100 KB |       31 KB | 不带任何主题和语言的核心引擎，需要你自己构建它们 |
| `shikiji/wasm`        |          623 KB |      231 KB | 以 BASE64 字符串形式内联的 WASM 二进制文件       |
