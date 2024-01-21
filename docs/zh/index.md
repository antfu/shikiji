---
layout: home

hero:
  name: "式辞 Shikiji"
  text: "语法高亮显示器"
  tagline: 美观而强大的语法高亮显示器
  image:
    src: /logo.svg
    alt: Shikiji Logo
  actions:
    - theme: brand
      text: 开始
      link: /zh/guide/
    - theme: alt
      text: 安装
      link: /zh/guide/install/

features:
  - title: 精确 & 美观
    icon: 🌈
    details: TextMate 语法驱动，与你的编辑器一样准确。并随着你的编辑器的改进不断改善。
  - title: 零运行时
    icon: ⏱️
    details: 预先运行，不载入任何 JavaScript 代码，并获得完美的语法高亮。
  - title: 高度自定义化
    icon: 🧩
    details: 基于 HAST，提供高度可定制化的插件和转换功能。
  - title: ESM & 通用
    icon: 🎄
    details: 高度可除屑优化（Tree-shaking）的 ESM，在任何 JavaScript 运行时上运行，包括但不限于浏览器，Node.js，Cloudflare Worker。
---

<HomeDemo />
