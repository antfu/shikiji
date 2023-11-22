/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import type { ShikijiTransformer } from 'shikiji'
import { codeToHtml } from 'shikiji'
import { transformerDiffNotation, transformerRenderWhitespace } from '../src'

function suite(
  name: string,
  files: Record<string, string>,
  transformers: ShikijiTransformer[],
  replace?: (code: string) => string,
) {
  describe(name, () => {
    for (const path of Object.keys(files)) {
      if (path.endsWith('.output.html'))
        continue

      it(path, async () => {
        const ext = path.split('.').pop()!

        let code = await codeToHtml(files[path], {
          lang: ext,
          theme: 'github-dark',
          transformers,
        })

        if (replace)
          code = replace(code)

        expect(code)
          .toMatchFileSnapshot(`${path}.output.html`)
      })
    }
  })
}

suite(
  'diff',
  import.meta.glob('./fixtures/diff/*.*', { as: 'raw', eager: true }),
  [transformerDiffNotation()],
  code => `${code}
<style>
.has-diff .diff.added {
  background-color: #0505;
}
.has-diff .diff.removed {
  background-color: #8005;
}
</style>`,
)

suite(
  'whitespace',
  import.meta.glob('./fixtures/whitespace/*.*', { as: 'raw', eager: true }),
  [transformerRenderWhitespace()],
  code => `${code}
<style>
* {
  tab-size: 4;
}
.tab, .space { position: relative; }
.tab::before { content: "\\21E5"; position: absolute; opacity: 0.3; }
.space::before { content: "\\B7"; position: absolute; opacity: 0.3; }
</style>`,
)
