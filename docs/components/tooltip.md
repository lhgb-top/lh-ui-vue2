# Tooltip 文字提示

悬停/点击/聚焦触发的浮层提示。fixed 定位 + 视口翻转（flip/shift），触发器滚出视口自动收起。

<DemoBlock name="tooltip" title="文字提示" :height="280">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-row" style="justify-content: center; padding: 56px 0 72px">
    <LhTooltip content="上方的提示" placement="top">
      <LhButton>上</LhButton>
    </LhTooltip>
    <LhTooltip content="下方的提示" placement="bottom">
      <LhButton>下</LhButton>
    </LhTooltip>
    <LhTooltip content="左侧的提示" placement="left">
      <LhButton>左</LhButton>
    </LhTooltip>
    <LhTooltip content="右侧的提示" placement="right">
      <LhButton>右</LhButton>
    </LhTooltip>
    <LhTooltip content="点击触发" trigger="click">
      <LhButton type="primary">点击</LhButton>
    </LhTooltip>
    <LhTooltip content="严格按 top 定位，不翻转" placement="top" :flip="false">
      <LhButton>严格 top</LhButton>
    </LhTooltip>
    <LhTooltip content="主题色提示" type="primary">
      <LhButton>主题色</LhButton>
    </LhTooltip>
  </div>
</template>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | `string` | `''` |
| placement | 12 方位 | `'top' \| 'top-start' \| … \| 'right-end'` | `'top'` |
| flip | 主轴空间不足时翻转方向；设 false 严格按 placement 定位 | `boolean` | `true` |
| trigger | 触发方式 | `'hover' \| 'click' \| 'focus'` | `'hover'` |
| manual / visible | 手动受控模式 | `boolean` | `false` / — |
| showAfter / hideAfter | 显隐延迟（ms） | `number` | `0` |
| openDelay / closeDelay | 显隐延迟别名（与 showAfter/hideAfter 同义，优先级更低） | `number` | — |
| effect | 明暗主题 | `'dark' \| 'light'` | `'dark'` |
| type | 内置主题色（覆盖 effect 背景） | `'primary' \| 'success' \| …` | — |
| bgColor | 自定义背景色（最高优先） | `string` | — |
| maxWidth | 最大宽度 | `string \| number` | `'200px'` |
| teleportTarget | 弹层挂载目标（DOM 移动实现） | `string \| HTMLElement` | `'body'` |
| disabled / themeVars / bgPattern / sx | — | — | — |

## Events

显隐由触发逻辑内部管理。

## 方法

`manual` 模式下用实例方法 `show() / hide() / toggle()`（defineExpose）。

::: tip
sx 作用于触发器根元素（popper 已挂到 body，不适用 sx）。
:::
