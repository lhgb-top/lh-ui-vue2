# Theming

The lh-ui family's theming system is defined in `@lh-ui/share` (the single source of truth); the Vue2 library consumes it through CSS variables.

## CSS variables

Every design token is named `--lh-*` and injected into `:root` by `@lh-ui/vue2/theme.css`:

```css
:root {
  --lh-primary-color: #2B4C7C;
  --lh-bg-color: #FAF6F0;
  --lh-text-color: #2C2A26;
  /* 完整清单见 share 仓库 theme 源 */
}
```

## Dark mode

```html
<link rel="stylesheet" href="@lh-ui/vue2/theme-dark.css" />
```

```html
<html data-theme="dark">
```

The `.dark` class form is also supported. Variables cascade from ConfigProvider or `:root`; components never redeclare them on their own.

## ConfigProvider-level customization

```vue
<template>
  <LhConfigProvider :theme-vars="{ 'primary-color': '#4A6741' }">
    <LhButton type="primary">竹青按钮</LhButton>
  </LhConfigProvider>
</template>
```

Precedence: **the component's own themeVars > componentTheme[component name] > global themeVars**;
the `bg-pattern` background pattern is additionally gated by the `patternComponents` allowlist.

## Presets and preset switching

`@lh-ui/vue2/theme` re-exports the TS presets from share (blue-and-white porcelain, pine-flower green, and so on), paired with `useLhPresetTheme`:

```ts
import { useLhPresetTheme } from '@lh-ui/vue2'

const { preset, setPreset, presets, themeVars } = useLhPresetTheme()
setPreset('songhua') // 写入 :root；themeVars 亦可交给 ConfigProvider 局部作用
```

`useLhTheme` handles the light/dark switch (`data-theme` plus localStorage persistence).
