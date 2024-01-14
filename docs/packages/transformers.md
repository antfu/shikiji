# shikiji-transformers

<Badges name="shikiji-transformers" />

Collective of common transformers for Shikiji, inspired by [shiki-processor](https://github.com/innocenzi/shiki-processor).

## Install

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

## Transformers

### `transformerNotationDiff`

Use `[!code ++]` and `[!code --]` to mark added and removed lines.

For example, the following code

````md
```ts
export function foo() {
  console.log('hewwo') // [\!code --]
  console.log('hello') // [\!code ++]
}
```
````

will be transformed to

```ts
export function foo() {
  console.log('hewwo') // [!code --]
  console.log('hello') // [!code ++]
}
```

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

### `transformerNotationHighlight`

Use `[!code highlight]` to highlight a line (adding `highlighted` class).

```ts
export function foo() {
  console.log('Highlighted') // [!code highlight]
}
```

### `transformerNotationWordHighlight`

Use `[!code highlight[word]]` to highlight a word (adding `highlighted-word` class).

```ts
export function foo() {
  const a = 'Hello World' // [!code highlight[a]]
}
```

### `transformerNotationFocus`

Use `[!code focus]` to focus a line (adding `focused` class).

```ts
export function foo() {
  console.log('Focused') // [!code focus]
}
```

### `transformerNotationErrorLevel`

Use `[!code error]`, `[!code warning]`, to mark a line with an error level (adding `highlighted error`, `highlighted warning` class).

```ts
export function foo() {
  console.error('Error') // [!code error]
  console.warn('Warning') // [!code warning]
}
```

### `transformerRenderWhitespace`

Render whitespaces (tabs and spaces) as individual spans, with classes `tab` and `space`.

With some CSS, you can make it look like this:

<img width="293" alt="image" src="https://github.com/antfu/shikiji/assets/11247099/01b7c4ba-6d63-4e74-8fd7-68a9f901f3de">

### `transformerCompactLineOptions`

Support for `shiki`'s `lineOptions` that is removed in `shikiji`.

### `transformerRemoveLineBreak`

Remove line breaks between `<span class="line">`. Useful when you set `display: block` to `.line` in CSS.
