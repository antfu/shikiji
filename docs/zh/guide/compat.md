---
outline: deep
---

# 兼容构建

我们趁着重写的机会做了一些重大的改变，我们认为这些改变对未来发展是有益的。可能的话，我们建议你尝试迁移这些变更，因为其中大部分应该都很简单。如果你有非常深层的集成，请尝试使用与 `shiki` 当前 API 更好兼容性的兼容构建。

## 安装 `shikiji-compat`

<Badges name="shikiji-compat" />

在 `package.json` 中将别名设置为 `shiki`：

```json
{
  "dependencies": {
    "shiki": "npm:shikiji-compat@0.9"
  }
}
```

## 破坏性改动

相比 [`shiki@0.14.3`](https://github.com/shikijs/shiki/releases/tag/v0.14.3)，有如下的破坏性改动：

### 硬性破坏性改动

`shikiji` 及 `shikiji-compat` 都具有的破坏性改动：

- CJS 和 IIFE 构建被移除。查看 [使用 CJS](/guide/install#cjs-usage) 和 [使用 CDN](/guide/install#cdn-usage) 获取更多详细信息。
- `codeToHtml` 在内部使用了 [`hast`](https://github.com/syntax-tree/hast)。 生成的 HTML 会略有不同，但行为一致。
- 不支持 `css-variables` 主题。请使用 [双主题](/guide/dual-themes)，或在 [主题颜色控制](/guide/theme-colors) 查看更多。

### 软性破坏性改动

`shikiji` 包含的破坏性更改，而 `shikiji-compat` 中不具有（屏蔽）：

- 顶级命名导出项 `setCDN`、`loadLanguage`、`loadTheme` 和 i877`setWasm` 被移除，因为其不再被需要。
- `BUNDLED_LANGUAGES`、`BUNDLED_THEMES` 被移动至 `shikiji/langs` 和 `shikiji/themes` 中并分别更名为 `bundledLanguages` 和 `bundledThemes`。
- `getHighlighter` 的 `theme` 选项被移除，请改用数组形式的 `themes`。
- 高亮器不再具有内部的默认主题上下文。 对于 `codeToHtml` 和 `codeToThemedTokens`，`theme` 选项是必须的。
- `codeToThemedTokens` 默认情况下将 `includeExplanation` 设置为 `false`。
- `.ansiToHtml` 作为一个特殊的语言 `ansi` 被合并至 `.codeToHtml`。请使用 `.codeToHtml(code, { lang: 'ansi' })`。
- `lineOptions` 被移除，取而代之的是完全可定制的 `transforms` 选项。
- `LanguageRegistration` 的 `grammar` 字段被展开到 `LanguageRegistration` 本身，参考类型定义获取详细信息。
