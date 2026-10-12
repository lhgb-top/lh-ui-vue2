# Popover 气泡卡片

点击/悬停触发的信息浮层。12 个方位、四种触发方式、箭头与宽度可定制。

<DemoBlock name="popover" title="气泡卡片" :height="320">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="padding: 40px 0">
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhPopover title="标题" content="click 触发（默认）" placement="top">
        <LhButton>click 顶部</LhButton>
      </LhPopover>
      <LhPopover content="click 触发" placement="right" trigger="click">
        <LhButton>click 右侧</LhButton>
      </LhPopover>
      <LhPopover content="focus 触发" placement="bottom" trigger="focus">
        <LhButton>focus 底部</LhButton>
      </LhPopover>
      <LhPopover content="箭头关闭 + 自定义宽度" placement="left" :arrow="false" :width="240">
        <LhButton>无箭头 左侧</LhButton>
      </LhPopover>
      <LhPopover content="严格按 left 定位" placement="left" :flip="false">
        <LhButton>flip=false</LhButton>
      </LhPopover>
    </div>
    <p class="demo-note">manual 触发配 :visible.sync 手动控制；disabled 禁用弹出；popperClass 自定义类名。</p>
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhPopover :visible.sync="manual" content="由按钮开关控制" placement="top" trigger="manual">
        <LhButton @click="manual = !manual">manual 开关（{{ manual ? '开' : '关' }}）</LhButton>
      </LhPopover>
      <LhPopover content="禁用状态" disabled>
        <LhButton disabled>disabled</LhButton>
      </LhPopover>
      <LhPopover content="延迟显示/隐藏" placement="top" :show-after="300" :hide-after="500">
        <LhButton>showAfter/hideAfter</LhButton>
      </LhPopover>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    manual: false,
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placement | 展示位置 | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| flip | 主轴方向空间不足时是否翻转方向（默认开启）；设 false 则严格按 placement 定位，允许溢出视口 | `boolean` | `true` |
| trigger | 触发方式 | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'hover'` |
| title | 标题 | `string` | — |
| visible | 手动控制的显示状态（:visible.sync） | `boolean` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| arrow | 是否显示箭头 | `boolean` | `true` |
| width | 弹出层宽度 | `string \| number` | — |
| popperClass | 弹出层自定义类名 | `string` | — |
| teleportTarget | 弹出层挂载目标（选择器或元素，默认 body；2.7 无 Teleport，host 移动实现） | `string \| HTMLElement` | — |
| showAfter | 延迟显示时间(ms) | `number` | — |
| hideAfter | 延迟隐藏时间(ms) | `number` | — |
| themeVars | 组件级主题变量，覆盖 ConfigProvider 配置 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹，覆盖 ConfigProvider 配置 | `string` | — |
| sx | sx 快速布局属性（作用于触发器根元素） | — | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 触发器 |
| title | 标题区（默认取 title prop） |
| content | 气泡正文（未传时取 content prop） |
