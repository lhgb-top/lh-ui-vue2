# Popconfirm 气泡确认框

用于二次确认的轻量气泡，替代对话框式的确认交互。三种语气、按钮可定制。

<DemoBlock name="popconfirm" title="气泡确认框" :height="340">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="padding: 40px 0">
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhPopconfirm title="确认删除该条著录？" @confirm="onOk">
        <LhButton type="danger">删除</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="警告语气" type="warning" placement="top" @confirm="onOk">
        <LhButton type="warning">warning</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="危险语气" type="danger" placement="right" @confirm="onOk">
        <LhButton type="danger">danger 右侧</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="hover 触发" trigger="hover" placement="bottom" @confirm="onOk">
        <LhButton>hover 底部</LhButton>
      </LhPopconfirm>
    </div>
    <p class="demo-note">自定义按钮文案与类型 / 无图标 / 严格定位</p>
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhPopconfirm
        title="自定义按钮"
        confirm-text="没问题"
        cancel-text="再想想"
        confirm-button-type="primary"
        placement="left"
        @confirm="onOk"
      >
        <LhButton>自定义按钮</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="无语气图标" :show-icon="false" placement="top" @confirm="onOk">
        <LhButton>showIcon=false</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="严格按 top 定位" placement="top" :flip="false" @confirm="onOk">
        <LhButton>flip=false</LhButton>
      </LhPopconfirm>
      <LhPopconfirm title="禁用" disabled>
        <LhButton disabled>disabled</LhButton>
      </LhPopconfirm>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onOk() {
      LhMessage.success('已确认')
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
| type | 确认语气 | `'info' \| 'warning' \| 'danger'` | `'info'` |
| placement | 展示位置 | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| flip | 主轴方向空间不足时是否翻转方向（默认开启）；设 false 则严格按 placement 定位，允许溢出视口 | `boolean` | `true` |
| trigger | 触发方式 | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | 确认内容（也可用 content 插槽） | `string` | — |
| confirmText | 确认按钮文案（未传时取语言包 popconfirm.confirm） | `string` | — |
| cancelText | 取消按钮文案（未传时取语言包 popconfirm.cancel） | `string` | — |
| confirmButtonType | 确认按钮类型 | `'default' \| 'primary'` | `'primary'` |
| visible | 手动控制的显示状态（:visible.sync） | `boolean` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| showIcon | 是否显示语气图标 | `boolean` | `true` |
| popperClass | 弹出层自定义类名 | `string` | — |
| teleportTarget | 弹出层挂载目标（选择器或元素，默认 body；2.7 无 Teleport，host 移动实现） | `string \| HTMLElement` | — |
| showAfter | 延迟显示时间(ms) | `number` | — |
| hideAfter | 延迟隐藏时间(ms) | `number` | — |
| themeVars | 组件级主题变量，覆盖 ConfigProvider 配置 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹，覆盖 ConfigProvider 配置 | `string` | — |
| sx | sx 快速布局属性（作用于触发器根元素） | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| confirm | 点击确认按钮 | — |
| cancel | 点击取消按钮 | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 触发器 |
| content | 确认内容（默认取 title prop） |
