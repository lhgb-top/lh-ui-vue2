# Icon

SVG icons. Render by name, or use the tree-shaking-friendly standalone icon components.

<DemoBlock name="icon" title="Basic icons">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row">
      <LhIcon name="star" size="24" />
      <LhIcon name="search" size="24" color="var(--lh-primary-color)" />
      <LhIcon name="loading" size="24" />
      <LhIcon name="arrow-down" size="24" />
      <LhIcon name="check" size="24" color="var(--lh-success-color)" />
      <LhIcon name="warning" size="24" color="var(--lh-warning-color)" />
    </div>
    <div class="demo-row">
      <LhIcon name="star" size="16" />
      <LhIcon name="star" size="20" />
      <LhIcon name="star" size="28" />
      <LhIcon name="star" size="36" color="var(--lh-danger-color)" />
    </div>
  </div>
</template>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| name | Icon name | `LhIconName` | — |
| size | Size (px) | `string \| number` | — |
| color | Color | `string` | — |
| themeVars / bgPattern | Theme overrides | — | — |

## Tree-shaking standalone icons

```ts
import { LhIconStar, LhIconSearch } from '@lh-ui/vue2'
// 每个图标是独立组件，只打包被引用的 SVG path
```

Available names are listed in `LH_ICON_SVGS_CONST`: star / search / check / close / arrow-up / arrow-down / arrow-left / arrow-right / warning / error / info / loading / plus / minus.

## Passthrough

`inheritAttrs: false`; undeclared attributes (such as `data-*` and events) fall through to the root element via `v-bind="$attrs"`.
