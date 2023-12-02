import { describe, expect, it } from 'vitest'
import { getHighlighter } from '../src'

describe('should', () => {
  it('works', async () => {
    const shiki = await getHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    expect(shiki.codeToHtml('console.log', { lang: 'js', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#B07D48">log</span></span></code></pre>"`)
  })

  it('dynamic load theme and lang', async () => {
    const shiki = await getHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript', 'ts'],
    })

    await shiki.loadLanguage('python')
    await shiki.loadTheme('min-dark')

    expect(shiki.getLoadedLanguages())
      .toMatchInlineSnapshot(`
        [
          "javascript",
          "typescript",
          "python",
          "js",
          "ts",
          "py",
        ]
      `)
    expect(shiki.getLoadedThemes())
      .toMatchInlineSnapshot(`
        [
          "vitesse-light",
          "min-dark",
        ]
      `)

    expect(shiki.codeToHtml('print 1', { lang: 'python', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`"<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#B392F0">print </span><span style="color:#F8F8F8">1</span></span></code></pre>"`)
  })

  it('requires nested lang', async () => {
    const shiki = await getHighlighter({
      themes: ['nord'],
      langs: [
        'vue',
      ],
    })

    expect(shiki.getLoadedLanguages().sort())
      .toMatchInlineSnapshot(`
        [
          "coffee",
          "css",
          "gql",
          "graphql",
          "html",
          "jade",
          "javascript",
          "js",
          "json",
          "json5",
          "jsonc",
          "jsx",
          "less",
          "markdown",
          "md",
          "pug",
          "sass",
          "scss",
          "styl",
          "stylus",
          "toml",
          "ts",
          "tsx",
          "typescript",
          "vue",
          "yaml",
          "yml",
        ]
      `)
  })

  // https://github.com/antfu/shikiji/issues/35
  it('dynamic load theme and lang with md', async () => {
    const shiki = await getHighlighter({})

    await shiki.loadTheme('min-dark')
    await shiki.loadLanguage('md')
    await shiki.loadLanguage('js')

    expect(shiki.getLoadedLanguages())
      .toMatchInlineSnapshot()
    expect(shiki.getLoadedThemes())
      .toMatchInlineSnapshot()

    expect(shiki.codeToHtml('console.log(1)', { lang: 'js', theme: 'min-dark' }))
      .toMatchInlineSnapshot()
  })
})

describe('errors', () => {
  it('throw on invalid theme', async () => {
    await expect(() => getHighlighter({
      themes: ['invalid' as any],
      langs: ['javascript'],
    }))
      .rejects
      .toThrowErrorMatchingInlineSnapshot(`[Error: [shikiji] Theme \`invalid\` is not built-in.]`)
  })

  it('throw on invalid lang', async () => {
    await expect(() => getHighlighter({
      themes: ['nord'],
      langs: ['invalid' as any],
    }))
      .rejects
      .toThrowErrorMatchingInlineSnapshot(`[Error: [shikiji] Language \`invalid\` is not built-in.]`)
  })
})
