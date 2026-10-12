# Dialog 对话框

模态对话框。Vue2 无 Teleport：弹层宿主在 mounted 时挂到 body（fixed 定位），组件保持完整响应式连接；遮罩点击 / ESC / 关闭按钮 / `beforeClose` 均可控制关闭，支持拖拽与滚动锁定。

<DemoBlock name="dialog" title="对话框" :height="200">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 显隐（model: modelValue/input；也兼容 `:visible.sync` 之外的标准 v-model 用法） | `boolean` | `false` |
| title | 标题 | `string` | `''` |
| width | 宽度 | `string \| number` | `'480px'` |
| position | 位置 | `'top' \| 'center' \| 'bottom'` | `'center'` |
| center | 标题与底部按钮居中排列 | `boolean` | `false` |
| fullscreen | 全屏 | `boolean` | `false` |
| showClose | 显示关闭按钮 | `boolean` | `true` |
| closeOnClickModal / closeOnPressEscape | 遮罩 / ESC 关闭 | `boolean` | `true` |
| draggable | 头部拖拽（视口边界约束） | `boolean` | `false` |
| lockScroll | 锁定 body 滚动 | `boolean` | `true` |
| beforeClose | 关闭前拦截，调 `done()` 真正关闭 | `(done) => void` | — |
| top | 顶部距离（position=top 时生效） | `string` | `'15vh'` |
| zIndex / themeVars / bgPattern / sx | 层级与主题覆盖 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| input | v-model 显隐同步 | `boolean` |
| open | 打开开始（进入过渡） | — |
| opened | 打开结束（过渡完成） | — |
| close | 关闭开始（离开过渡） | — |
| closed | 关闭结束（过渡完成） | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 正文 |
| header | 自定义标题 |
| footer | 底部操作区 |

## 方法

| 方法 | 说明 |
| --- | --- |
| close() | 关闭对话框 |
| isVisible | 当前是否显示（defineExpose） |
