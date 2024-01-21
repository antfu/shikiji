---
outline: deep
---

# shikiji-transformers

<Badges name="shikiji-transformers" />

受 [shiki-processor](https://github.com/innocenzi/shiki-processor) 启发，为 Shikiji 设计的常用转换器（Transformers）集合。

## 安装

```bash
npm i -D shikiji-transformers
```

```ts twoslash
import {
  codeToHtml,
} from 'shikiji'
import {
  transformerNotationDiff,
  // ...
} from 'shikiji-transformers'

const code = `console.log('hello')`
const html = await codeToHtml(code, {
  lang: 'ts',
  theme: 'nord',
  transformers: [
    transformerNotationDiff(),
    // ...
  ],
})
```

## 转换器

### `transformerNotationDiff`

使用 `[!code ++]` 和 `[!code --]` 来标记增删的行。

例如，如下代码：

````md
```ts
export function foo() {
  console.log('hewwo') // [\!code --]
  console.log('hello') // [\!code ++]
}
```
````

会被转换为：

```ts
export function foo() {
  console.log('hewwo') // [!code --]
  console.log('hello') // [!code ++]
}
```

::: details HTML 输出

```html
<!-- Output (stripped of `style` attributes for clarity) -->
<pre class="shiki has-diff"> <!-- Notice `has-diff` -->
  <code>
    <span class="line"></span>
    <span class="line"><span>function</span><span>()</span><span></span><span>{</span></span>
    <span class="line diff remove">  <!-- Notice `diff` and `remove` -->
      <span></span><span>console</span><span>.</span><span>log</span><span>(</span><span>&#39;</span><span>hewwo</span><span>&#39;</span><span>) </span>
    </span>
    <span class="line diff add">  <!-- Notice `diff` and `add` -->
      <span></span><span>console</span><span>.</span><span>log</span><span>(</span><span>&#39;</span><span>hello</span><span>&#39;</span><span>) </span>
    </span>
    <span class="line"><span></span><span>}</span></span>
    <span class="line"><span></span></span>
  </code>
</pre>
```

:::

---

### `transformerNotationHighlight`

使用 `[!code highlight]` 来高亮显示行（添加 `highlighted` 类名）。

````md
```ts
export function foo() {
  console.log('Highlighted') // [\!code highlight]
}
```
````

效果是：

```ts
export function foo() {
  console.log('Highlighted') // [!code highlight]
}
```

或者，你可以使用 [`transformerMetaHighlight`](#transformermetahighlight) 根据元字符串来高亮显示行。

---

### `transformerNotationWordHighlight`

使用 `[!code word:xxx]` 来高亮显示词（添加 `highlighted-word` 类名）。

````md
```ts
export function foo() { // [\!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // 打印 Hello World
}
```
````

效果是：

```ts
export function foo() { // [!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // 打印 Hello World
}
```

你还可以指定高亮显示的次数，例如 `[!code word:options:2]` 会高亮显示近两个 `options`。

````md
```ts
// [\!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // 这个不会被高亮显示
```
````

```ts
// [!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // 这个不会被高亮显示
```

---

### `transformerNotationFocus`

使用 `[!code focus]` 来聚焦显示行（添加 `focused` 类名）。

````md
```ts
export function foo() {
  console.log('Focused') // [\!code focus]
}
```
````

效果是：

```ts
export function foo() {
  console.log('Focused') // [!code focus]
}
```

---

### `transformerNotationErrorLevel`

使用 `[!code error]` 和 `[!code warning]` 来指定行的日志等级（添加 `highlighted error` 和 `highlighted warning` 类名）。

````md
```ts
export function foo() {
  console.error('Error') // [\!code error]
  console.warn('Warning') // [\!code warning]
}
```
````

效果是：

```ts
export function foo() {
  console.error('Error') // [!code error]
  console.warn('Warning') // [!code warning]
}
```

---

### `transformerRenderWhitespace`

将空白字符（Tab 和空格）渲染为单独的标签（具有 `tab` 或 `space` 类名）。

使用一些 CSS，可以使其看起来像这样：

<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre v-pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">function</span><span class="space"> </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">block</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">{</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">space</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span></span>
<span class="line"><span class="tab">&#9;</span><span class="tab">&#9;</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">table</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> </span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre></div>

::: details 示例 CSS

```css
.vp-code .tab,
.vp-code .space {
  position: relative;
}

.vp-code .tab::before {
  content: '⇥';
  position: absolute;
  opacity: 0.3;
}

.vp-code .space::before {
  content: '·';
  position: absolute;
  opacity: 0.3;
}
```

:::

---

### `transformerMetaHighlight`

根据代码片段上提供的元字符串，高亮显示行。需要集成支持。

````md
```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```
````

效果是：

```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```

### `transformerMetaWordHighlight`

根据代码片段中提供的元字符串，高亮显示词。需要集成支持。

````md
```js /Hello/
const msg = 'Hello World'
console.log(msg)
console.log(msg) // 打印 Hello World
```
````

效果是：

```js /Hello/
const msg = 'Hello World'
console.log(msg) // 打印 Hello World
```

---

### `transformerCompactLineOptions`

在 `shikiji` 中删除的对 `shiki` 的 `lineOptions` 的支持。

---

### `transformerRemoveLineBreak`

删除 `<span class="line">` 之间的换行符。当你在 CSS 中将 `display: block` 设置为 `.line` 时这有可能用。
