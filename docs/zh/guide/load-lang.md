# 加载自定义语言

请先查看 [所有内建语言](/languages)。

你可以通过将 TextMate 语法对象传递到 `langs` 数组中来加载自定义语言。

```ts twoslash
// @noErrors
import { getHighlighter } from 'shikiji'

const myLang = JSON.parse(fs.readFileSync('my-lang.json', 'utf8'))

const highlighter = await getHighlighter({
  langs: [myLang]
})

const html = highlighter.codeToHtml(code, {
  lang: 'my-lang',
})
```

同样的，你也可以在高亮器创建后载入自定义语言。

```ts twoslash
// @noErrors
import { getHighlighter } from 'shikiji'

const myLang = JSON.parse(fs.readFileSync('my-lang.json', 'utf8'))

const highlighter = await getHighlighter()

await highlighter.loadLanguage(myLang) // <--

const html = highlighter.codeToHtml(code, {
  lang: 'my-lang',
})
```

## 从 Shiki 迁移

由于 `shikiji` 是与环境无关的，所以我们无法访问文件系统。这意味着在 `shikiji` 中不可以使用 `shiki` 支持的路径属性，并且你必须手动读取文件并传入对象。

例如，以下代码不会工作：

```ts
const highlighter = await getHighlighter({
  langs: [
    {
      name: 'vue-vine',
      scopeName: 'source.vue-vine',
      // ‼️ 这不会工作！
      path: join(__dirname, './vine-ts.tmLanguage.json'),
      embeddedLangs: [
        'vue-html',
        'css',
        'scss',
        'sass',
        'less',
        'stylus',
      ],
    },
  ]
})
```

相反，手动加载文件（通过 `fs`，`import()` 或 `fetch()` 等）:

```ts
const vineGrammar = JSON.parse(fs.readFileSync(join(__dirname, './vine-ts.tmLanguage.json'), 'utf8'))

const highlighter = await getHighlighter({
  langs: [
    {
      name: 'vue-vine',
      scopeName: 'source.vue-vine',
      embeddedLangs: [
        'vue-html',
        'css',
        'scss',
        'sass',
        'less',
        'stylus',
      ],
      ...vineGrammar
    },
  ]
})
```
