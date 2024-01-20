# 转换器

Shikiji 使用 [`hast`](https://github.com/syntax-tree/hast)，一种用于 HTML 的 AST 格式，来处理结果并生成 HTML。

你可以使用自己的 `transformers` 操作修改 hast 树来自定义生成的 HTML。你可以传递自定义函数来修改不同类型节点的树。例如：

```ts twoslash
import { addClassToHast, codeToHtml } from 'shikiji'

const code = await codeToHtml('foo\bar', {
  lang: 'js',
  theme: 'vitesse-light',
  transformers: [
    {
      code(node) {
        addClassToHast(node, 'language-js')
      },
      line(node, line) {
        node.properties['data-line'] = line
        if ([1, 3, 4].includes(line))
          addClassToHast(node, 'highlight')
      },
      span(node, line, col) {
        node.properties['data-token'] = `token:${line}:${col}`
      },
    },
  ]
})
```

我们也提供了一些常用转换器供你使用，查看 [`shikiji-transforms`](/zh/packages/transformers) 获取更多信息。

## `codeToHast`

你可以使用 `codeToHast`，通过 `hast` 进行自定义渲染，而无需将其序列化为 HTML 代码。你还可以进一步将 AST 与 [unified](https://github.com/unifiedjs) 生态系统集成。

```ts twoslash
import { getHighlighter } from 'shikiji'

const highlighter = await getHighlighter({
  themes: ['nord', 'min-light'],
  langs: ['javascript'],
})
// ---cut---
const root = highlighter.codeToHast(
  'const a = 1',
  { lang: 'javascript', theme: 'nord' }
)

console.log(root)
```

<!-- eslint-skip -->

```ts
{
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'pre',
      properties: {
        class: 'shiki vitesse-light',
        style: 'background-color:#ffffff;color:#393a34',
        tabindex: '0'
      },
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { class: 'line' },
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#AB5959' },
                  children: [ { type: 'text', value: 'const' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#B07D48' },
                  children: [ { type: 'text', value: ' a' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#999999' },
                  children: [ { type: 'text', value: ' =' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#2F798A' },
                  children: [ { type: 'text', value: ' 1' } ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```
