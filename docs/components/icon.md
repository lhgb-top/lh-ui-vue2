# Icon 图标

SVG 图标。按名称渲染，或用 tree-shaking 友好的独立图标组件。

<DemoBlock name="icon" title="基础图标">

```vue
<template>
  <LhIcon name="star" size="24" />
  <LhIcon name="search" size="24" color="var(--lh-primary-color)" />
  <LhIcon name="loading" size="24" />
</template>
```

</DemoBlock>

## 独立图标（tree-shaking）

```ts
import { LhIconStar, LhIconSearch } from '@lh-ui/vue2'
// 每个图标是独立组件，只打包被引用的 SVG path
```

可用名称见 `LH_ICON_SVGS_CONST`：star / search / check / close / arrow-up / arrow-down / arrow-left / arrow-right / warning / error / info / loading / plus / minus。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 图标名称 | `LhIconName` | — |
| size | 尺寸（px） | `string \| number` | — |
| color | 颜色 | `string` | — |
| themeVars / bgPattern | 主题覆盖 | — | — |

## 透传

`inheritAttrs: false`，未声明的属性（如 `data-*`、事件）通过 `v-bind="$attrs"` 落到根元素。
