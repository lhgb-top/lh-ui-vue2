# Dialog

A modal dialog. Vue 2.7 has no Teleport, so the overlay host is moved to body on mount (fixed positioning) while the component keeps its fully reactive connection. Closing can be triggered by the mask click, ESC, or the close button, or guarded by `beforeClose`; dragging and scroll locking are also supported.

<DemoBlock name="dialog" title="Dialog" :height="200">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhButton type="primary" @click="basic = true">基础对话框</LhButton>
      <LhButton @click="center = true">position="center" 居中</LhButton>
      <LhButton @click="bottom = true">position="bottom" 底部</LhButton>
      <LhButton @click="full = true">fullscreen 全屏</LhButton>
      <LhButton @click="drag = true">draggable 可拖拽</LhButton>
      <LhButton @click="strict = true">禁止遮罩/Esc 关闭</LhButton>
      <LhButton @click="guard = true">beforeClose 拦截</LhButton>
      <LhButton @click="noClose = true">showClose=false</LhButton>
    </div>
    <LhDialog v-model="basic" title="题跋" width="420px" :top="top" :z-index="2000">
      <p style="margin: 0">对话框挂载到 body，遮罩与内容均为 fixed 定位。top 控制顶部距离，zIndex 控制层级。</p>
      <template #footer>
        <LhButton @click="basic = false">取消</LhButton>
        <LhButton type="primary" @click="basic = false">落款</LhButton>
      </template>
    </LhDialog>
    <LhDialog v-model="center" title="居中弹窗" position="center" width="360px" center>
      <p style="margin: 0">position="center" 垂直居中；center 使标题与底部按钮居中排列。</p>
      <template #footer>
        <LhButton type="primary" @click="center = false">知道了</LhButton>
      </template>
    </LhDialog>
    <LhDialog v-model="bottom" title="底部弹窗" position="bottom" width="480px">
      <p style="margin: 0">position="bottom" 贴底展示，适合移动端操作面板。</p>
    </LhDialog>
    <LhDialog v-model="full" title="全屏浏览" fullscreen>
      <p style="margin: 0">fullscreen 占满整个视口，内容区自适应剩余高度。</p>
      <template #footer>
        <LhButton type="primary" @click="full = false">关闭</LhButton>
      </template>
    </LhDialog>
    <LhDialog v-model="drag" title="按住标题栏拖动" draggable width="420px">
      <p style="margin: 0">draggable 开启后，按住标题栏即可拖动弹窗。</p>
    </LhDialog>
    <LhDialog
      v-model="strict"
      title="严格模式"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
    >
      <p style="margin: 0">closeOnClickModal / closeOnPressEscape 均关闭，lockScroll 锁定页面滚动，只能点按钮关闭。</p>
      <template #footer>
        <LhButton type="primary" @click="strict = false">仅此出口</LhButton>
      </template>
    </LhDialog>
    <LhDialog v-model="guard" title="关闭前拦截" width="400px" :before-close="beforeClose">
      <p style="margin: 0">beforeClose 拦截关闭动作，done() 才真正关闭（此处演示二次确认）。</p>
    </LhDialog>
    <LhDialog v-model="noClose" title="无关闭按钮" width="360px" :show-close="false">
      <p style="margin: 0">showClose=false 隐藏右上角关闭按钮。</p>
      <template #footer>
        <LhButton type="primary" @click="noClose = false">关闭</LhButton>
      </template>
    </LhDialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    basic: false,
    center: false,
    bottom: false,
    full: false,
    drag: false,
    strict: false,
    guard: false,
    noClose: false,
    top: '15vh',
  }),
  methods: {
    beforeClose(done) {
      if (window.confirm('确认关闭该对话框？')) done()
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Visibility (model: modelValue/input; also supports standard v-model usage beyond `:visible.sync`) | `boolean` | `false` |
| title | Title | `string` | `''` |
| width | Width | `string \| number` | `'480px'` |
| position | Position | `'top' \| 'center' \| 'bottom'` | `'center'` |
| center | Center the title and the footer buttons | `boolean` | `false` |
| fullscreen | Fullscreen | `boolean` | `false` |
| showClose | Whether to show the close button | `boolean` | `true` |
| closeOnClickModal / closeOnPressEscape | Close on mask click / ESC | `boolean` | `true` |
| draggable | Drag by the header (constrained to the viewport) | `boolean` | `false` |
| lockScroll | Lock body scrolling | `boolean` | `true` |
| beforeClose | Guard invoked before closing; call `done()` to actually close | `(done) => void` | — |
| top | Distance from the top (effective when position=top) | `string` | `'15vh'` |
| zIndex / themeVars / bgPattern / sx | z-index and theme overrides | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model visibility sync | `boolean` |
| open | Opening starts (enter transition) | — |
| opened | Opening ends (transition completed) | — |
| close | Closing starts (leave transition) | — |
| closed | Closing ends (transition completed) | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Body content |
| header | Custom title |
| footer | Footer action area |

## Methods

| Method | Description |
| --- | --- |
| close() | Close the dialog |
| isVisible | Whether the dialog is currently visible (defineExpose) |
