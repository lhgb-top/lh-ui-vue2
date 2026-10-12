# Drawer

An overlay that slides in from a screen edge, suited to secondary actions such as details and filtering. Four directions, controllable sizing, and mask behavior.

<DemoBlock name="drawer" title="Drawer" :height="200">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhButton type="primary" @click="open('right')">right 右侧</LhButton>
      <LhButton @click="open('left')">left 左侧</LhButton>
      <LhButton @click="open('top')">top 顶部</LhButton>
      <LhButton @click="open('bottom')">bottom 底部</LhButton>
      <LhButton @click="openNoMask">遮罩不关闭</LhButton>
    </div>
    <LhDrawer v-model="visible" :title="title" :direction="direction" :size="size">
      <p style="margin: 0 0 8px">direction 控制方向，size 控制尺寸（数字 px 或百分比字符串）。</p>
      <p class="demo-note">底部按钮可触发 lockScroll / closeOnEsc 等组合。</p>
      <template #footer>
        <LhButton @click="visible = false">取消</LhButton>
        <LhButton type="primary" @click="visible = false">保存</LhButton>
      </template>
    </LhDrawer>
    <LhDrawer
      v-model="noMask"
      title="点击遮罩不关闭"
      direction="right"
      size="30%"
      :mask-closable="false"
      :show-close="true"
      :lock-scroll="true"
      :close-on-esc="false"
    >
      <p style="margin: 0">maskClosable=false、closeOnEsc=false，只能点按钮或关闭图标。</p>
      <template #footer>
        <LhButton type="primary" @click="noMask = false">关闭</LhButton>
      </template>
    </LhDrawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    visible: false,
    noMask: false,
    title: '右侧抽屉',
    direction: 'right',
    size: '360px',
  }),
  methods: {
    open(dir) {
      this.direction = dir
      this.title = `${dir} 抽屉`
      this.size = dir === 'top' || dir === 'bottom' ? '30%' : '360px'
      this.visible = true
    },
    openNoMask() {
      this.noMask = true
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
| v-model | Whether the drawer is visible (controlled modelValue prop) | `boolean` | `false` |
| title | Title | `string` | — |
| direction | Direction | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | Size: numbers are px; strings support percentages | `string \| number` | — |
| maskClosable | Whether clicking the mask closes the drawer | `boolean` | `true` |
| showClose | Whether to show the close button | `boolean` | `true` |
| teleportTarget | Mount target of the overlay (selector or element, defaults to body; Vue 2.7 has no Teleport, the host element is moved instead) | `string \| HTMLElement` | — |
| lockScroll | Whether to lock page scrolling | `boolean` | `true` |
| closeOnEsc | Whether ESC closes the drawer | `boolean` | `true` |
| themeVars | Component-level theme variables, overriding the ConfigProvider configuration | `Record<string, string>` | — |
| bgPattern | Component-level background pattern, overriding the ConfigProvider configuration | `string` | — |
| sx | sx layout shorthand props (applied to the panel) | — | — |

## Slots

| Slot | Description |
| --- | --- |
| header | Title area (defaults to the title prop) |
| default | Drawer body |
| footer | Footer button area |
