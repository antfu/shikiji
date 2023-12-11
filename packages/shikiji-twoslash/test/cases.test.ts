import { expect, it } from 'vitest'
import { codeToHtml } from 'shikiji'
import type { TwoSlashReturn } from '@typescript/twoslash'
import { transformerTwoSlash } from '../src'

declare module 'shikiji' {
  interface ShikijiTransformerContextMeta {
    twoslash?: TwoSlashReturn
  }
}

const styleTag = `
<link rel="stylesheet" href="../../style.css" />
<style>
html, body { margin: 0; }
.shiki { padding: 2em; }
</style>
`

it('simple', async () => {
  const code = `
// Hello world
const a = "123"
const b = "345"
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'dark-plus',
    transformers: [
      transformerTwoSlash(),
    ],
  })

  expect(styleTag + html).toMatchFileSnapshot('./out/simple.html')
})

it('compiler_errors', async () => {
  const code = `
// @target: ES2015
// @errors: 7006

function fn(s) {
  console.log(s.subtr(3))
}

fn(42)
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-light',
    transformers: [
      transformerTwoSlash(),
    ],
  })

  expect(styleTag + html).toMatchFileSnapshot('./out/compiler_errors.html')
})

it('completions', async () => {
  const code = `
const a = Number.isNaN(123)
//                ^|
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-light',
    transformers: [
      transformerTwoSlash(),
    ],
  })

  expect(styleTag + html).toMatchFileSnapshot('./out/completions.html')
})

it('cuts_out_unnecessary_code', async () => {
  const code = `
interface IdLabel {
  id: number /* some fields */
}
interface NameLabel {
  name: string /* other fields */
}
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented"
}

let a = createLabel("typescript")
//  ^?

let b = createLabel(2.8)
    //  ^?

let c = createLabel(Math.random() ? "hello" : 42)
//                        ^|
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformerTwoSlash(),
    ],
  })

  expect(styleTag + html).toMatchFileSnapshot('./out/cuts_out_unnecessary_code.html')
})
