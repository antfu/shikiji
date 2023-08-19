# markdown-it-shikiji

[Markdown It](https://markdown-it.github.io/) plugin for [shikiji](https://github.com/antfu/shikiji)

## Install

```bash
npm i -D markdown-it-shikiji
```

## Usage

```ts
import MarkdownIt from 'markdown-it'
import Shikiji from 'markdown-it-shikiji'

const md = MarkdownIt()

md.use(await Shikiji({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  }
}))
```

## License

MIT
