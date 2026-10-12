# Alert

A static semantic alert bar. Four types, an icon, a plain style, and closable support.

<DemoBlock name="alert" title="Alert" :height="340">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 520px; gap: 12px">
    <LhAlert type="info" title="馆藏公告" show-icon>《溪山行旅图》数字高清版已上线，欢迎观赏。</LhAlert>
    <LhAlert type="success" title="采集完成" show-icon closable>120 幅宋画高清采集已完成归档。</LhAlert>
    <LhAlert type="warning" title="校色偏差" show-icon plain closable>3 处色值偏离基准，建议复核。</LhAlert>
    <LhAlert type="danger" :title="titleText" closable :close-label="closeLabel">
      无图标 + 自定义关闭按钮无障碍名称。
    </LhAlert>
    <LhAlert type="info" plain>纯文本朴素样式（plain），无标题。</LhAlert>
  </div>
</template>

<script>
export default {
  data: () => ({
    titleText: '审校驳回',
    closeLabel: '关闭此警示',
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Semantic type | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | Title (the title slot works as well) | `string` | — |
| closable | Whether the alert is closable | `boolean` | `false` |
| showIcon | Whether to show the semantic icon | `boolean` | `false` |
| plain | Whether to use the light plain style | `boolean` | `false` |
| closeLabel | Accessible name of the close button (falls back to the locale message alert.close when not provided) | `string` | — |
| sx | sx layout shorthand props | — | — |

## Slots

| Slot | Description |
| --- | --- |
| title | Title area (defaults to the title prop) |
| default | Body description |
