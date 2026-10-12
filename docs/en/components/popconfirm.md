# Popconfirm

A lightweight confirmation popover for a second confirmation step, replacing the dialog-style confirmation flow. Three tones, with customizable buttons.

<DemoBlock name="popconfirm" title="Popconfirm" :height="340">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="padding: 40px 0">
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhPopconfirm title="确认删除该条著录？" @confirm="onOk">
        <LhButton type="danger">删除</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="警告语气" type="warning" placement="top" @confirm="onOk">
        <LhButton type="warning">warning</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="危险语气" type="danger" placement="right" @confirm="onOk">
        <LhButton type="danger">danger 右侧</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="hover 触发" trigger="hover" placement="bottom" @confirm="onOk">
        <LhButton>hover 底部</LhButton>
      </LhPopconfirm>
    </div>
    <p class="demo-note">自定义按钮文案与类型 / 无图标 / 严格定位</p>
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhPopconfirm
        title="自定义按钮"
        confirm-text="没问题"
        cancel-text="再想想"
        confirm-button-type="primary"
        placement="left"
        @confirm="onOk"
      >
        <LhButton>自定义按钮</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="无语气图标" :show-icon="false" placement="top" @confirm="onOk">
        <LhButton>showIcon=false</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="严格按 top 定位" placement="top" :flip="false" @confirm="onOk">
        <LhButton>flip=false</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="禁用" disabled>
        <LhButton disabled>disabled</LhButton>
      </LhPopconfirm>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onOk() {
      LhMessage.success('已确认')
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Confirmation tone | `'info' \| 'warning' \| 'danger'` | `'info'` |
| placement | Display position | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| flip | Whether to flip along the main axis when space is insufficient (on by default); set false to position strictly by placement and allow viewport overflow | `boolean` | `true` |
| trigger | Trigger mode | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | Confirmation content (the content slot also works) | `string` | — |
| confirmText | Confirm button label (falls back to the locale message popconfirm.confirm) | `string` | — |
| cancelText | Cancel button label (falls back to the locale message popconfirm.cancel) | `string` | — |
| confirmButtonType | Confirm button type | `'default' \| 'primary'` | `'primary'` |
| visible | Manually controlled visibility (:visible.sync) | `boolean` | — |
| disabled | Whether to disable | `boolean` | `false` |
| showIcon | Whether to show the tone icon | `boolean` | `true` |
| popperClass | Custom class for the popover | `string` | — |
| teleportTarget | Popover mount target (selector or element, default body; 2.7 has no Teleport, implemented via host movement) | `string \| HTMLElement` | — |
| showAfter | Delay before showing, in ms | `number` | — |
| hideAfter | Delay before hiding, in ms | `number` | — |
| themeVars | Component-level theme variables, overriding the ConfigProvider configuration | `Record<string, string>` | — |
| bgPattern | Component-level background pattern, overriding the ConfigProvider configuration | `string` | — |
| sx | sx shorthand layout props (applied to the trigger root element) | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| confirm | The confirm button is clicked | — |
| cancel | The cancel button is clicked | — |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger |
| content | Confirmation content (defaults to the title prop) |
