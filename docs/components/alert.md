# Alert 警告提示

静态的语义警示条。四种类型、图标、朴素样式与可关闭。

<DemoBlock name="alert" title="警告提示" :height="340">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 语义类型 | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | 标题（也可用 title 插槽） | `string` | — |
| closable | 是否可关闭 | `boolean` | `false` |
| showIcon | 是否显示语义图标 | `boolean` | `false` |
| plain | 是否浅色朴素样式 | `boolean` | `false` |
| closeLabel | 关闭按钮的无障碍名称（未传时取语言包 alert.close） | `string` | — |
| sx | sx 快速布局属性 | — | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| title | 标题区（默认取 title prop） |
| default | 正文描述 |
