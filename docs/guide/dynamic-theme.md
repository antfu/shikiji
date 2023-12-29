# Dynamic Theme Colors

## Arbitrary Color Values

Usually, TextMate themes would expect the color values of each token to be a hex color value. The limitation is inherit from [`vscode-textmate`](https://github.com/microsoft/vscode-textmate). Since Shikiji v0.9.15, we introduced an automatic workaround by replacing non-hex color values with a placeholder and replaced them back on tokenization. This would allows you to use themes with arbitrary color values for the rendering:

```ts twoslash
import { getHighlighter } from 'shikiji'

const highlighter = await getHighlighter({
  langs: ['javascript'],
  themes: [
    {
      name: 'my-theme',
      settings: [
        {
          scope: ['comment'],
          settings: {
            // use `rgb`, `hsl`, `hsla` any anything here // [!code hl:2]
            foreground: 'rgb(128, 128, 128)'
          }
        },
        {
          scope: ['string'],
          settings: {
            foreground: 'var(--code-string)' // CSS variable // [!code hl:1]
          }
        },
        // ...more
      ],
      // Background and foreground colors // [!code hl:3]
      bg: 'var(--code-bg)',
      fg: 'var(--code-fg)'
    }
  ]
})

const html = highlighter.codeToHtml('const foo = "bar"', { lang: 'javascript', theme: 'my-theme' })
```

::: info Notice
Use this with caution as this will diverge from the TextMate theme compatibility. And may **break** non-web usage like [`shikiji-cli`](/packages/cli) and [`shikiji-monaco`](/packages/monaco).
:::

Learn more about how to [load themes](./load-theme).

## Color Replacements

You can also use the `colorReplacements` option to replace the color values of the theme. This is useful when you want to use a theme with a different color palette. It can be provided on both the theme object and the `codeToHast` `codeToHtml` options.

## CSS Variables Theme

// TODO:
