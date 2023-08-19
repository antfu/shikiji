# rehype-shikiji

[rehype](https://github.com/rehypejs/rehype) plugin for [shikiji](https://github.com/antfu/shikiji).

## Install

```bash
npm i -D rehype-shikiji
```

## Usage

```ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiji from 'rehype-shikiji'
import { expect, test } from 'vitest'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShikiji, {
    // or `theme` for a single theme
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    }
  })
  .use(rehypeStringify)
  .process(await fs.readFile('./input.md'))
```

## License

MIT
