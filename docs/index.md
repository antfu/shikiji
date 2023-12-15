---
layout: home

hero:
  name: "式辞 Shikiji"
  text: "Syntax highlighter"
  tagline: A beautiful and powerful syntax highlighter
  image:
    src: /logo.svg
    alt: Shikiji Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Integrations
      link: /integrations

features:
  - title: Accurate & Beautiful
    icon: 🌈
    details: TextMate grammar powered, as accurate as your Text Editor.
  - title: Ahead of time
    icon: ⏱️
    details: Runs on build time, ZERO runtime.
  - title: Customizable
    icon: 📦
    details: Addons, transformations, highly customizable.
---

<VPContent>
<div class="vp-doc ">

```ts twoslash
import { codeToHtml } from 'shikiji'

const html = await codeToHtml(
  `console.log('Hello World!')`,
  {
    theme: 'nord',
    lang: 'ts',
  }
)
```

</div>
</VPContent>
