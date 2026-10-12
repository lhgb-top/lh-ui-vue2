# Notification 通知提醒

右上角（可配置四角）的卡片式通知，适合流程节点类的长反馈。

<DemoBlock name="notification" title="通知提醒" :height="200">

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

## 服务 API

```ts
LhNotification.success({ title: '采集完成', content: '120 幅已归档' })
// info / success / warning / danger，第二个参数为 options
LhNotification.info({ title: '点击我', content: '...', onClick: () => {} })
LhNotification.closeAll()
```

## Notification Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | 标题 | `string` | — |
| content | 正文 | `string` | — |
| showClose | 是否显示关闭按钮 | `boolean` | `false` |
| closeLabel | 关闭按钮的无障碍名称（未传时取语言包 notification.close） | `string` | — |
| onClick | 传入后卡片可点击 | `() => void` | — |
| sx | sx 快速布局属性 | — | — |

::: tip
通知弹出位置（`position`：`top-right` / `top-left` / `bottom-right` / `bottom-left`）在 `openNotification` 的 options 中配置，默认右上角。
:::
