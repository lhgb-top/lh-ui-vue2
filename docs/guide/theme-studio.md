# 主题定制台

不想只用预设？在下面的定制台里选一个预设作起点，逐令牌调成自己的配色，预览区实时生效，
最后导出一份 **scss 文件**直接放进项目——无需重新编译组件库。

<ThemeStudio />

## 采纳导出的主题

定制台导出的文件长这样（令牌源在 `@lh-ui/share/styles/theme/common/var.scss`）：

```scss
@use '@lh-ui/share/styles/index.scss';

:root {
  --lh-primary-color: #2B4C7C;
  /* ... */
}

[data-theme='dark'],
.dark {
  --lh-primary-color-bg: color-mix(in srgb, var(--lh-primary-color) 25%, transparent);
  --lh-selected-color: color-mix(in srgb, var(--lh-primary-color) 40%, #fff);
}
```

两种采纳方式：

**方式一：静态引入（推荐）**——把导出的 `lh-theme.scss` 放进项目，在入口引入：

```js
// main.js
import './lh-theme.scss'
```

`@use '@lh-ui/share/styles/index.scss'` 已包含全部组件样式与主题令牌，一行即可；
暗色块与 share 的预设机制同源，`data-theme="dark"` 下自动切换。

**方式二：运行时注入**——用 `LhConfigProvider` 的 `themeVars` 局部覆盖（键为简写，
自动补 `--lh-` 前缀），适合同一页面并列多套主题：

```vue
<template>
  <LhConfigProvider :theme-vars="{ primaryColor: '#2B4C7C', onPrimary: '#FFFFFF' }">
    <LhButton type="primary">主要按钮</LhButton>
  </LhConfigProvider>
</template>

<script>
import { LhConfigProvider, LhButton } from '@lh-ui/vue2'

export default {
  components: { LhConfigProvider, LhButton },
}
</script>
```

> 示例代码统一使用 npm 包名（`@lh-ui/vue2` / `@lh-ui/share`），拷贝即用；
> 本文档站点的实际运行走家族本地源码，因此改动即时可见。

## 注意事项

- **浅主色必须显式声明 `--lh-color-on-primary`**：白字在浅主色上不达 AA 对比度（4.5:1），
  预设里松花绿 / 藤黄都因此改用了墨字。定制台的「主色底文字」字段即对应此令牌。
- `--lh-selected-color` 留空时跟随 `--lh-primary-color-active` 的默认链路；
  浅主色下作选中文字往往需要单独加深（预设里同样有体现）。
- 对比度门禁：share 的 `pnpm verify:theme` 按真实消费配对复算每个预设的 AA 对比度，
  自定义主题建议照着 [主题](/guide/theme) 的说明自查一遍。
