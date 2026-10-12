# Message 全局提示

全局轻量反馈条，挂在页面顶部。`LhMessage.success('已保存')` 即用即走，`loading` 类型需手动关闭。

<DemoBlock name="message" title="全局提示" :height="180">

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

## 服务 API

```ts
LhMessage('普通提示')                    // 默认 info
LhMessage.success('已保存')              // info / success / warning / danger / loading
LhMessage({ content: '可关闭', showClose: true, closeLabel: '知道了' })
LhMessage.closeAll()                     // 关闭全部
```

## Message Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | `string` | — |
| type | 类型 | `'info' \| 'success' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| showClose | 是否显示关闭按钮 | `boolean` | `false` |
| closeLabel | 关闭按钮的无障碍名称（未传时取语言包 message.close） | `string` | — |
| sx | sx 快速布局属性 | — | — |

::: tip
`loading` 类型不会自动关闭，需配合业务结束后 `LhMessage.closeAll()` 或自行持有句柄。
:::
