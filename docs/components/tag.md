# Tag 标签

轻量标签。type 语义色 + round/hit 形态 + 可关闭。

<DemoBlock name="tag" title="标签" :height="160">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 语义色 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| closable | 显示关闭按钮（aria-label 走语言包） | `boolean` | `false` |
| disabled | 禁用（关闭按钮拦截） | `boolean` | `false` |
| round / hit | 圆角 / 描边强调 | `boolean` | `false` |
| onClose | 关闭回调（与 close 事件并存） | `(e: Event) => void` | — |
| sx | sx 快速布局 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击时触发 | `(e: MouseEvent)` |
| close | 关闭按钮点击时触发（与 onClose prop 并存） | `(e: Event)` |
