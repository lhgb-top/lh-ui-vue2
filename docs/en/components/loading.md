# Loading

A loading overlay with two usage styles: the imperative `LhLoading.show()` (fullscreen or scoped, returns `{ close }`), or the `v-loading` directive attached directly to an element.

<DemoBlock name="loading" title="Loading mask" :height="260">

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

## Imperative API

```ts
// 不传 target 即全屏遮罩
const handle = LhLoading.show({ text: '正在渲染…' })
setTimeout(() => handle.close(), 1500)

// 挂在指定元素上（元素需 position: relative）
LhLoading.show({ target: el, text: '局部加载', background: 'rgba(0,0,0,.5)' })
```

`Vue.use(LhLoading)` registers the `v-loading` directive: `<div v-loading="isLoading" />`, where the value is `false | string | LhLoadingOptions`.

## Loading Props

Props of the mask component (`LhLoadingMask`); the options of `LhLoading.show` pass through to the fields with the same names:

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| fullscreen | Whether to cover the full screen (true when the target is body) | `boolean` | `false` |
| text | Loading text (falls back to the locale message loading.text when not provided) | `string` | — |
| background | Overlay background color (any CSS background value) | `string` | — |
| zIndex | z-index | `number` | — |
| spinner | Whether to show the spinner icon (defaults to true) | `boolean` | `true` |
| sx | sx layout shorthand props | — | — |
