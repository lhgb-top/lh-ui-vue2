# 主题

lh-ui 家族的主题体系在 `@lh-ui/share` 定义（唯一源），Vue2 库通过 CSS 变量消费。

## CSS 变量

所有令牌命名 `--lh-*`，由 `@lh-ui/vue2/theme.css` 注入 `:root`：

```css
:root {
  --lh-primary-color: #2B4C7C;
  --lh-bg-color: #FAF6F0;
  --lh-text-color: #2C2A26;
  /* 完整清单见 share 仓库 theme 源 */
}
```

## 暗色模式

```html
<link rel="stylesheet" href="@lh-ui/vue2/theme-dark.css" />
```

```html
<html data-theme="dark">
```

同时支持 `.dark` class 形式。变量级联自 ConfigProvider 或 `:root`，组件自身不重复声明。

## ConfigProvider 局部定制

```vue
<template>
  <LhConfigProvider :theme-vars="{ 'primary-color': '#4A6741' }">
    <LhButton type="primary">竹青按钮</LhButton>
  </LhConfigProvider>
</template>
```

优先级：**组件自身 themeVars > componentTheme[组件名] > 全局 themeVars**；
`bg-pattern` 花纹额外受 `patternComponents` 白名单控制。

## 预设主题与预设切换

`@lh-ui/vue2/theme` 转发 share 的 TS 预设（青花瓷、松花绿等），配套 `useLhPresetTheme`：

```ts
import { useLhPresetTheme } from '@lh-ui/vue2'

const { preset, setPreset, presets, themeVars } = useLhPresetTheme()
setPreset('songhua') // 写入 :root；themeVars 亦可交给 ConfigProvider 局部作用
```

`useLhTheme` 负责明暗切换（`data-theme` + localStorage 持久化）。
