import { expect, it } from 'vitest'
import { codeToHtml } from 'shikiji'
import { rendererRich, transformerTwoSlash } from '../src'

const styleTag = `
<link rel="stylesheet" href="../../../style-rich.css" />
<style>
html, body { margin: 0; }
.shiki { padding: 2em; }

.dark .shiki,
.dark .shiki span {
  color: var(--shiki-dark, inherit);
  --twoslash-popup-bg: var(--shiki-dark-bg, inherit);
}

.dark .shiki {
  background-color: var(--shiki-dark-bg, inherit);
}

html:not(.dark) .shiki,
html:not(.dark) .shiki span {
  color: var(--shiki-light, inherit);
  --twoslash-popup-bg: var(--shiki-light-bg, inherit);
}

html:not(.dark) .shiki {
  background-color: var(--shiki-light-bg, inherit);
}
</style>
`

const colorToggle = `
<script>
function toggleColor() {
  const html = document.querySelector('html')
  html.classList.toggle('dark')
}
</script>
<div style="margin: 5em 2em">
<button onclick="toggleColor()">Toggle color</button>
</div>
`

it('rich', async () => {
  const code = `
// @errors: 2540
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users".toUpperCase(),
//  ^?
};

todo.title = "Hello";

Number.parseInt("123", 10);
//      ^|
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
    defaultColor: false,
    transformers: [
      transformerTwoSlash({
        renderer: rendererRich(),
      }),
    ],
  })

  expect(styleTag + html + colorToggle).toMatchFileSnapshot('./out/rich/rich.html')
})

it('no-icons', async () => {
  const code = `
const obj = {
  boo: 1,
  bar: () => 2,
  baz: 'string'
}
obj.boo
//   ^|
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'nord',
    defaultColor: false,
    transformers: [
      transformerTwoSlash({
        renderer: rendererRich({
          completionIcons: false,
        }),
      }),
    ],
  })

  expect(
    /* eslint-disable prefer-template */
    styleTag
    + html
    + '<style>:root {--twoslash-popup-bg: #2e3440;}</style>'
    + colorToggle,
  ).toMatchFileSnapshot('./out/rich/no-icons.html')
})
