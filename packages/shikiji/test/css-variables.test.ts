import { describe, expect, it } from 'vitest'
import { getHighlighter } from '../src'

describe('should', () => {
  it('works', async () => {
    const shiki = await getHighlighter({
      themes: [
        Object.freeze({
          name: 'my-css-variables',
          bg: 'var(--bg)',
          fg: 'var(--fg)',
          settings: [
            {
              scope: 'keyword',
              settings: {
                foreground: 'var(--keyword)',
              },
            },
            {
              scope: [
                'string',
              ],
              settings: {
                foreground: 'var(--string)',
              },
            },
          ],
        }),
      ],
      langs: ['javascript'],
    })

    const theme = shiki.getTheme('my-css-variables')

    expect(theme).toMatchInlineSnapshot(`
      {
        "bg": "var(--bg)",
        "colorReplacements": {
          "#000001": "var(--fg)",
          "#000002": "var(--bg)",
          "#000003": "var(--keyword)",
          "#000004": "var(--string)",
        },
        "fg": "var(--fg)",
        "name": "my-css-variables",
        "settings": [
          {
            "settings": {
              "background": "#000002",
              "foreground": "#000001",
            },
          },
          {
            "scope": "keyword",
            "settings": {
              "foreground": "#000003",
            },
          },
          {
            "scope": [
              "string",
            ],
            "settings": {
              "foreground": "#000004",
            },
          },
        ],
        "type": "dark",
      }
    `)

    expect(shiki.codeToHtml('console.log("Hello")', { lang: 'js', theme: 'my-css-variables' }))
      .toMatchInlineSnapshot(`"<pre class="shiki my-css-variables" style="background-color:var(--bg);color:var(--fg)" tabindex="0"><code><span class="line"><span style="color:var(--fg)">console.log(</span><span style="color:var(--string)">"Hello"</span><span style="color:var(--fg)">)</span></span></code></pre>"`)
  })
})
