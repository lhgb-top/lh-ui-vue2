# Tag

Lightweight tag: semantic colors via `type`, round / hit shapes, and optional closable.

<DemoBlock name="tag" title="Tags" :height="160">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row">
      <LhTag>默认</LhTag>
      <LhTag type="primary">主要</LhTag>
      <LhTag type="success">成功</LhTag>
      <LhTag type="warning">警告</LhTag>
      <LhTag type="danger">危险</LhTag>
      <LhTag type="info">信息</LhTag>
    </div>
    <div class="demo-row">
      <LhTag size="small">小型</LhTag>
      <LhTag size="medium">默认尺寸</LhTag>
      <LhTag size="large">大型</LhTag>
      <LhTag type="primary" round>圆角</LhTag>
      <LhTag type="primary" hit>描边（hit）</LhTag>
    </div>
    <div class="demo-row">
      <LhTag type="primary" closable @close="closed = true">可关闭</LhTag>
      <LhTag v-if="!closed" type="info" round>已关闭后隐藏</LhTag>
      <LhTag type="warning" disabled>禁用</LhTag>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({ closed: false }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Semantic color | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| closable | Shows a close button (aria-label comes from the locale messages) | `boolean` | `false` |
| disabled | Disabled (intercepts the close button) | `boolean` | `false` |
| round / hit | Rounded / outlined emphasis | `boolean` | `false` |
| onClose | Close callback (coexists with the close event) | `(e: Event) => void` | — |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| click | Emitted on click | `(e: MouseEvent)` |
| close | Emitted when the close button is clicked (coexists with the onClose prop) | `(e: Event)` |
