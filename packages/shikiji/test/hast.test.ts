import { describe, expect, it } from 'vitest'
import { toHtml } from 'hast-util-to-html'
import { getHighlighter } from '../src'

describe('should', () => {
  it('works', async () => {
    const shiki = await getHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    const hast = shiki.codeToHast('console.log\nfoo.bar', { lang: 'js', theme: 'vitesse-light' })

    expect(toHtml(hast))
      .toMatchInlineSnapshot(`
        "<pre class=\\"shiki vitesse-light\\" style=\\"background-color:#ffffff;color:#393a34\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color:#B07D48\\">console</span><span style=\\"color:#999999\\">.</span><span style=\\"color:#B07D48\\">log</span></span>
        <span class=\\"line\\"><span style=\\"color:#B07D48\\">foo</span><span style=\\"color:#999999\\">.</span><span style=\\"color:#B07D48\\">bar</span></span></code></pre>"
      `)
  })
})
