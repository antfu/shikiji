# shikiji-cli

<Badges name="shikiji-cli" />

在命令行中使用 Shikiji。

## 使用方法

Shikiji CLI 与 `cat` 命令类似，不过它会输出具有语法高亮的内容。

```bash
npx shikiji-cli README.md
```

## 安装

你可以将它全局安装，命令别名有 `shikiji-cli`、`shikiji` 和 `skat`。

```bash
npm i -g shikiji-cli

skat src/index.ts
```

## 选项

### `--theme`

指定使用的主题，默认为 `vitesse-dark`。

```bash
npx shikiji-cli README.md --theme=nord
```

### `--lang`

语言默认从文件拓展名自动推断，你可以使用 `--lang` 选项覆盖。

```bash
npx shikiji-cli src/index.js --lang=ts
```
