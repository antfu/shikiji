# shikiji-monaco

<Badges name="shikiji-monaco" />

在 [Monaco Editor](https://microsoft.github.io/monaco-editor/) 中使用 Shikiji 来高亮。

Monaco 内置的高亮显示器没有使用完整的 TextMate 语法，所以它可能不够准确。该集成使你可以在 Monaco 中使用 Shikiji 的语法高亮引擎进行高亮显示，并共享 Shikiji 的语法和主题。

深受 [`monaco-editor-textmate`](https://github.com/zikaari/monaco-editor-textmate) 的启发。

## 安装

```bash
npm i -D shikiji-monaco
```

```ts
import { getHighlighter } from 'shikiji'
import { shikijiToMonaco } from 'shikiji-monaco'
import * as monaco from 'monaco-editor-core'

// 创建一个可复用的语法高亮显示器
const highlighter = await getHighlighter({
  themes: [
    'vitesse-dark',
    'vitesse-light',
  ],
  langs: [
    'javascript',
    'typescript',
    'vue'
  ],
})

// 首先注册你需要的语言的 IDs
monaco.languages.register({ id: 'vue' })
monaco.languages.register({ id: 'typescript' })
monaco.languages.register({ id: 'javascript' })

// 注册 Shikiji 主题，并为 Monaco 提供语法高亮 // [!code highlight:2]
shikijiToMonaco(highlighter, monaco)

// 创建编辑器
const editor = monaco.editor.create(document.getElementById('container'), {
  value: 'const a = 1',
  language: 'javascript',
  theme: 'vitesse-dark',
})

// 正常使用
```
