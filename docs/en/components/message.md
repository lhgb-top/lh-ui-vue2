# Message

A lightweight global feedback bar mounted at the top of the page. `LhMessage.success('已保存')` is fire-and-forget; the `loading` type must be closed manually.

<DemoBlock name="message" title="Message" :height="180">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhButton @click="show('info')">信息</LhButton>
      <LhButton type="primary" @click="show('success')">成功</LhButton>
      <LhButton type="warning" @click="show('warning')">警告</LhButton>
      <LhButton type="danger" @click="show('danger')">危险</LhButton>
      <LhButton @click="showLoading">加载中</LhButton>
      <LhButton @click="showClose">带关闭按钮</LhButton>
      <LhButton @click="closeAll">全部关闭</LhButton>
    </div>
    <p class="demo-note">LhMessage.success('已保存') 是最常用形态；loading 类型需手动关闭。</p>
  </div>
</template>

<script>
export default {
  methods: {
    show(type) {
      LhMessage[type]('这是一条 ' + type + ' 提示')
    },
    showLoading() {
      LhMessage.loading('正在保存…')
    },
    showClose() {
      LhMessage({ content: '可手动关闭的提示', showClose: true })
    },
    closeAll() {
      LhMessage.closeAll()
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Imperative API

```ts
LhMessage('普通提示')                    // 默认 info
LhMessage.success('已保存')              // info / success / warning / danger / loading
LhMessage({ content: '可关闭', showClose: true, closeLabel: '知道了' })
LhMessage.closeAll()                     // 关闭全部
```

## Message Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| content | Message content | `string` | — |
| type | Type | `'info' \| 'success' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| showClose | Whether to show the close button | `boolean` | `false` |
| closeLabel | Accessible name of the close button (falls back to the locale message message.close when not provided) | `string` | — |
| sx | sx layout shorthand props | — | — |

::: tip
The `loading` type does not close itself — call `LhMessage.closeAll()` once your task finishes, or hold on to the returned handle yourself.
:::
