---
outline: deep
---

# VitePress 集成

[VitePress](https://vitepress.dev/) 在底层使用了 Shikiji，所以你不需要显式地集成。

VitePress 提供了 [一些 Shikiji 的自定义选项](https://github.com/vuejs/vitepress/blob/main/src/node/markdown/markdown.ts#L66-L112)，在 [VitePress 文档](https://vitepress.dev/zh/reference/site-config#markdown) 上查看更多。

## Twoslash

要在 Vitepress 中启用 [TypeScript Twoslash](/packages/twoslash)（类型悬停显示），使用我们提供的插件来快速开始，它借助 [Floating Vue](https://floating-vue.starpad.dev/) 在容器外显示具有样式的类型信息。

<Badges name="vitepress-plugin-twoslash" />

### 安装

```bash
npm i -D vitepress-plugin-twoslash
```

在 [`.vitepress/config.ts`](https://vitepress.dev/reference/site-config) 配置文件中：

```ts twoslash
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from 'vitepress-plugin-twoslash' // [!code hl]

export default defineConfig({
  markdown: {
    codeTransformers: [
      transformerTwoslash() // [!code hl]
    ]
  }
})
```

然后在你的 [`.vitepress/theme/index.ts`](https://vitepress.dev/guide/custom-theme) 中，安装 Vue 插件并通过 `vitepress-plugin-twoslash/styles.css` 导入 CSS。

```ts twoslash
// @noErrors: true
// .vitepress/theme/index.ts
import Theme from 'vitepress/theme'
import TwoslashFloatingVue from 'vitepress-plugin-twoslash/client' // [!code hl]
import 'vitepress-plugin-twoslash/style.css' // [!code hl]
import type { EnhanceAppContext } from 'vitepress'

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue) // [!code hl]
  },
}
```

::: details 关于 style.css

方便起见，`vitepress-plugin-twoslash/styles.css` 包含了 `floating-vue` 和 `shikiji-twoslash/style-rich.css` 中的样式，所以你只需要引入这一项。如果你使用的是自定义 `floating-vue` 样式，或者需要对样式进行更多控制，你可以将它展开成如下几项：

```ts
import 'vitepress-plugin-twoslash/style.css'

// 等同于：
import 'shikiji-twoslash/style-rich.css'
import 'floating-vue/dist/style.css'
import 'vitepress-plugin-twoslash/style-core.css'
```

:::

现在，你可以在你的 Markdown 文件中使用 `ts twoslash` 来启用美观的类型悬停显示。

````md
```ts twoslash
console.log('hello')
//      ^?
```
````

它会被渲染为：

```ts twoslash
console.log('hello')
//      ^?
```

<br> <!-- leaving some space for the query above -->

### Vue 单文件组件

此外，这个插件集成了 [`twoslash-vue`](https://github.com/antfu/twoslash-vue)，所以你可以使用 `vue twoslash` 高亮 Vue SFC 块：

```vue twoslash
<script setup>
import { onMounted, ref } from 'vue'

// 响应式状态
const count = ref(0)
//             ^?

// 修改状态并出发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">
    Count is: {{ count }}
  </button>
</template>
```
