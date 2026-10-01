# Tooltip 文字提示

悬停/点击/聚焦触发的浮层提示。fixed 定位 + 视口翻转（flip/shift），触发器滚出视口自动收起。

<DemoBlock name="tooltip" title="文字提示" :height="220">

```vue
<template>
  <LhTooltip content="上方的提示" placement="top">
    <LhButton>上</LhButton>
  </LhTooltip>
  <LhTooltip content="点击触发" trigger="click">
    <LhButton type="primary">点击</LhButton>
  </LhTooltip>
  <LhTooltip content="主题色提示" type="primary">
    <LhButton>主题色</LhButton>
  </LhTooltip>
</template>
```

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | `string` | `''` |
| placement | 12 方位 | `'top' \| 'top-start' \| … \| 'right-end'` | `'top'` |
| trigger | 触发方式 | `'hover' \| 'click' \| 'focus'` | `'hover'` |
| manual / visible | 手动受控模式 | `boolean` | `false` / — |
| showAfter / hideAfter | 显隐延迟（ms） | `number` | `0` |
| effect | 明暗主题 | `'dark' \| 'light'` | `'dark'` |
| type | 内置主题色（覆盖 effect 背景） | `'primary' \| 'success' \| …` | — |
| bgColor | 自定义背景色（最高优先） | `string` | — |
| maxWidth | 最大宽度 | `string \| number` | `'200px'` |
| teleportTarget | 弹层挂载目标（DOM 移动实现） | `string \| HTMLElement` | `'body'` |
| disabled / themeVars / bgPattern / sx | — | — | — |

## Events / 方法

显隐由触发逻辑内部管理；`manual` 模式下用实例方法 `show() / hide() / toggle()`（defineExpose）。

::: tip
sx 作用于触发器根元素（popper 已挂到 body，不适用 sx）。
:::
