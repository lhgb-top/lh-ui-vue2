# Notification

Card-style notifications in the top-right corner (any of the four corners is configurable), suited to longer feedback such as workflow milestones.

<DemoBlock name="notification" title="Notification" :height="200">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhButton @click="show('info')">信息</LhButton>
      <LhButton type="primary" @click="show('success')">成功</LhButton>
      <LhButton type="warning" @click="show('warning')">警告</LhButton>
      <LhButton type="danger" @click="show('danger')">危险</LhButton>
      <LhButton @click="showClickable">可点击卡片</LhButton>
      <LhButton @click="closeAll">全部关闭</LhButton>
    </div>
    <p class="demo-note">LhNotification.success({ title, content })；onClick 传入后卡片可点击。</p>
  </div>
</template>

<script>
export default {
  methods: {
    show(type) {
      LhNotification[type]({
        title: type + ' 通知',
        content: '《溪山行旅图》数字化流程节点已更新。',
        showClose: true,
      })
    },
    showClickable() {
      LhNotification.info({
        title: '点击我试试',
        content: 'onClick 传入后整张卡片可点击。',
        onClick() {
          LhMessage.success('卡片被点击了')
        },
      })
    },
    closeAll() {
      LhNotification.closeAll()
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Imperative API

```ts
LhNotification.success({ title: '采集完成', content: '120 幅已归档' })
// info / success / warning / danger，第二个参数为 options
LhNotification.info({ title: '点击我', content: '...', onClick: () => {} })
LhNotification.closeAll()
```

## Notification Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Type | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | Title | `string` | — |
| content | Body text | `string` | — |
| showClose | Whether to show the close button | `boolean` | `false` |
| closeLabel | Accessible name of the close button (falls back to the locale message notification.close when not provided) | `string` | — |
| onClick | Makes the card clickable when provided | `() => void` | — |
| sx | sx layout shorthand props | — | — |

::: tip
The notification position (`position`: `top-right` / `top-left` / `bottom-right` / `bottom-left`) is configured in the options of `openNotification`; it defaults to the top-right corner.
:::
