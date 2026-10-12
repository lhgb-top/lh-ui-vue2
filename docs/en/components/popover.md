# Popover

An informational floating layer triggered by click or hover. 12 placements, four trigger modes, with customizable arrow and width.

<DemoBlock name="popover" title="Popover" :height="320">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="padding: 40px 0">
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhPopover title="标题" content="click 触发（默认）" placement="top">
        <LhButton>click 顶部</LhButton>
      </LhPopover>
      <LhPopover content="click 触发" placement="right" trigger="click">
        <LhButton>click 右侧</LhButton>
      </LhPopover>
      <LhPopover content="focus 触发" placement="bottom" trigger="focus">
        <LhButton>focus 底部</LhButton>
      </LhPopover>
      <LhPopover content="箭头关闭 + 自定义宽度" placement="left" :arrow="false" :width="240">
        <LhButton>无箭头 左侧</LhButton>
      </LhPopover>
      <LhPopover content="严格按 left 定位" placement="left" :flip="false">
        <LhButton>flip=false</LhButton>
      </LhPopover>
    </div>
    <p class="demo-note">manual 触发配 :visible.sync 手动控制；disabled 禁用弹出；popperClass 自定义类名。</p>
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhPopover :visible.sync="manual" content="由按钮开关控制" placement="top" trigger="manual">
        <LhButton @click="manual = !manual">manual 开关（{{ manual ? '开' : '关' }}）</LhButton>
      </LhPopover>
      <LhPopover content="禁用状态" disabled>
        <LhButton disabled>disabled</LhButton>
      </LhPopover>
      <LhPopover content="延迟显示/隐藏" placement="top" :show-after="300" :hide-after="500">
        <LhButton>showAfter/hideAfter</LhButton>
      </LhPopover>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    manual: false,
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| placement | Display position | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| flip | Whether to flip along the main axis when space is insufficient (on by default); set false to position strictly by placement and allow viewport overflow | `boolean` | `true` |
| trigger | Trigger mode | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'hover'` |
| title | Title | `string` | — |
| visible | Manually controlled visibility (:visible.sync) | `boolean` | — |
| disabled | Whether to disable | `boolean` | `false` |
| arrow | Whether to show the arrow | `boolean` | `true` |
| width | Popover width | `string \| number` | — |
| popperClass | Custom class for the popover | `string` | — |
| teleportTarget | Popover mount target (selector or element, default body; 2.7 has no Teleport, implemented via host movement) | `string \| HTMLElement` | — |
| showAfter | Delay before showing, in ms | `number` | — |
| hideAfter | Delay before hiding, in ms | `number` | — |
| themeVars | Component-level theme variables, overriding the ConfigProvider configuration | `Record<string, string>` | — |
| bgPattern | Component-level background pattern, overriding the ConfigProvider configuration | `string` | — |
| sx | sx shorthand layout props (applied to the trigger root element) | — | — |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger |
| title | Title area (defaults to the title prop) |
| content | Popover body (falls back to the content prop) |
