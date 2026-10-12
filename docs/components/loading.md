# Loading 加载

加载遮罩，两种用法：`LhLoading.show()` 服务式（可全屏可局部，返回 `{ close }`），或 `v-loading` 指令直接挂在元素上。

<DemoBlock name="loading" title="加载遮罩" :height="260">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhButton type="primary" @click="showFull">全屏遮罩（服务式）</LhButton>
      <LhButton @click="showLocal">局部遮罩（服务式）</LhButton>
      <LhButton @click="toggleDirective">v-loading 指令（{{ loading ? '关闭' : '开启' }}）</LhButton>
    </div>
    <div
      ref="panel"
      class="demo-note"
      v-loading="loading"
      style="
        position: relative;
        height: 140px;
        border: 1px dashed var(--lh-border-color, #d9d0c2);
        border-radius: 8px;
        margin: 0;
      "
    >
      <p style="padding: 12px; margin: 0">指令式遮罩挂在本元素上（position: relative 由内联样式提供）。</p>
    </div>
    <p class="demo-note">
      LhLoading.show 不传 target 即全屏；传 target 挂指定元素；v-loading 指令走 Vue.use(LhLoading) 注册。
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
  }),
  methods: {
    showFull() {
      const handle = LhLoading.show({ text: '正在高清渲染…' })
      setTimeout(() => handle.close(), 1500)
    },
    showLocal() {
      const handle = LhLoading.show({ target: this.$refs.panel, text: '局部加载' })
      setTimeout(() => handle.close(), 1500)
    },
    toggleDirective() {
      this.loading = !this.loading
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## 服务 API

```ts
// 不传 target 即全屏遮罩
const handle = LhLoading.show({ text: '正在渲染…' })
setTimeout(() => handle.close(), 1500)

// 挂在指定元素上（元素需 position: relative）
LhLoading.show({ target: el, text: '局部加载', background: 'rgba(0,0,0,.5)' })
```

`Vue.use(LhLoading)` 注册 `v-loading` 指令：`<div v-loading="isLoading" />`，值为 `false | string | LhLoadingOptions`。

## Loading Props

遮罩组件（`LhLoadingMask`）的 props，`LhLoading.show` 的 options 透传同名字段：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fullscreen | 是否全屏（目标是 body 时为 true） | `boolean` | `false` |
| text | 加载提示文案（未传时取语言包 loading.text） | `string` | — |
| background | 遮罩背景色（CSS background 值） | `string` | — |
| zIndex | 层级 | `number` | — |
| spinner | 是否显示旋转图标（默认 true） | `boolean` | `true` |
| sx | sx 快速布局属性 | — | — |
