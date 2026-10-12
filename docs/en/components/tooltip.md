# Tooltip

A floating tip triggered by hover / click / focus. Fixed positioning with viewport flipping (flip / shift); when the trigger scrolls out of the viewport the tip collapses automatically.

<DemoBlock name="tooltip" title="Tooltip" :height="280">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| content | Tip content | `string` | `''` |
| placement | 12 placements | `'top' \| 'top-start' \| … \| 'right-end'` | `'top'` |
| flip | Flip along the main axis when space is insufficient; set false to position strictly by placement | `boolean` | `true` |
| trigger | Trigger mode | `'hover' \| 'click' \| 'focus'` | `'hover'` |
| manual / visible | Manually controlled mode | `boolean` | `false` / — |
| showAfter / hideAfter | Show / hide delay, in ms | `number` | `0` |
| openDelay / closeDelay | Aliases for showAfter / hideAfter (synonymous, lower priority) | `number` | — |
| effect | Light / dark theme | `'dark' \| 'light'` | `'dark'` |
| type | Built-in theme color (overrides the effect background) | `'primary' \| 'success' \| …` | — |
| bgColor | Custom background color (highest priority) | `string` | — |
| maxWidth | Maximum width | `string \| number` | `'200px'` |
| teleportTarget | Floating layer mount target (implemented via DOM movement) | `string \| HTMLElement` | `'body'` |
| disabled / themeVars / bgPattern / sx | — | — | — |

## Events

Show / hide are managed internally by the trigger logic.

## Methods

In `manual` mode use the instance methods `show() / hide() / toggle()` (defineExpose).

::: tip
sx applies to the trigger root element (the popper is already appended to the body, so sx does not apply).
:::
