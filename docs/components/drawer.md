# Drawer 抽屉

从屏幕边缘滑出的浮层，适合详情、筛选等次级操作。四个方向、可控尺寸与遮罩行为。

<DemoBlock name="drawer" title="抽屉" :height="200">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 是否显示（受控 modelValue prop） | `boolean` | `false` |
| title | 标题 | `string` | — |
| direction | 方向 | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | 尺寸：数字为 px，字符串支持百分比 | `string \| number` | — |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| showClose | 是否显示关闭按钮 | `boolean` | `true` |
| teleportTarget | 弹出层挂载目标（选择器或元素，默认 body；2.7 无 Teleport，host 移动实现） | `string \| HTMLElement` | — |
| lockScroll | 是否锁定页面滚动 | `boolean` | `true` |
| closeOnEsc | 是否响应 Esc 关闭 | `boolean` | `true` |
| themeVars | 组件级主题变量，覆盖 ConfigProvider 配置 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹，覆盖 ConfigProvider 配置 | `string` | — |
| sx | sx 快速布局属性（作用于面板） | — | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| header | 标题区（默认取 title prop） |
| default | 抽屉正文 |
| footer | 底部按钮区 |
