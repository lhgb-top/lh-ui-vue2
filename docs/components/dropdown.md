# Dropdown 下拉菜单

向下弹出的菜单列表。悬停/点击/右键三种触发，菜单项可带命令标识与分割线。

<DemoBlock name="dropdown" title="下拉菜单" :height="360">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="padding: 40px 0">
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhDropdown placement="bottom-start" @command="onCommand">
        <LhButton>hover 触发（默认）</LhButton>
        <template #dropdown>
          <LhDropdownItem command="copy">复制题跋</LhDropdownItem>
          <LhDropdownItem command="move">移动至卷轴</LhDropdownItem>
          <LhDropdownItem divided command="delete">删除</LhDropdownItem>
        </template>
      </LhDropdown>
      <LhDropdown trigger="click" placement="bottom" :max-height="180" @command="onCommand">
        <LhButton>click + maxHeight</LhButton>
        <template #dropdown>
          <LhDropdownItem v-for="i in 8" :key="i" :command="'item-' + i">选项 {{ i }}</LhDropdownItem>
        </template>
      </LhDropdown>
      <LhDropdown trigger="contextmenu" placement="bottom-end" @command="onCommand">
        <LhButton>右键触发</LhButton>
        <template #dropdown>
          <LhDropdownItem command="ctx-a">右键菜单 A</LhDropdownItem>
          <LhDropdownItem command="ctx-b" disabled>右键菜单 B（禁用）</LhDropdownItem>
        </template>
      </LhDropdown>
    </div>
    <p class="demo-note">命令：{{ command || '（无）' }}</p>
    <p class="demo-note">hideOnClick=false 时点击菜单项不自动收起；:visible.sync 手动控制；flip=false 严格定位。</p>
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center">
      <LhDropdown :hide-on-click="false" placement="top" @command="onCommand">
        <LhButton>hideOnClick=false</LhButton>
        <template #dropdown>
          <LhDropdownItem command="keep-1">点击后不收起</LhDropdownItem>
          <LhDropdownItem command="keep-2">第二项</LhDropdownItem>
        </template>
      </LhDropdown>
      <LhDropdown :visible.sync="manual" placement="top-start" :flip="false" popper-class="my-popper">
        <LhButton @click="manual = !manual">手动开关（{{ manual ? '开' : '关' }}）</LhButton>
        <template #dropdown>
          <LhDropdownItem command="manual-1">手动菜单项</LhDropdownItem>
        </template>
      </LhDropdown>
      <LhDropdown disabled>
        <LhButton disabled>disabled</LhButton>
        <template #dropdown>
          <LhDropdownItem command="never">不会出现</LhDropdownItem>
        </template>
      </LhDropdown>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    command: '',
    manual: false,
  }),
  methods: {
    onCommand(cmd) {
      this.command = String(cmd)
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
| trigger | 触发方式 | `'hover' \| 'click' \| 'contextmenu'` | `'hover'` |
| placement | 展示位置 | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom'` |
| flip | 主轴方向空间不足时是否翻转方向（默认开启）；设 false 则严格按 placement 定位，允许溢出视口 | `boolean` | `true` |
| visible | 手动控制的显示状态（:visible.sync） | `boolean` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| hideOnClick | 点击菜单项后是否自动关闭 | `boolean` | `true` |
| teleportTarget | 弹出层挂载目标（选择器或元素，默认 body；2.7 无 Teleport，host 移动实现） | `string \| HTMLElement` | — |
| popperClass | 弹出层自定义类名 | `string` | — |
| maxHeight | 菜单最大高度 | `string \| number` | — |
| themeVars | 组件级主题变量，覆盖 ConfigProvider 配置 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹，覆盖 ConfigProvider 配置 | `string` | — |
| sx | sx 快速布局属性（作用于触发器根元素） | — | — |

## DropdownItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| command | 命令标识，点击时随 command 事件抛出 | `string \| number` | — |
| disabled | 是否禁用（保留可聚焦性以进入无障碍树） | `boolean` | `false` |
| divided | 是否显示分割线 | `boolean` | `false` |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| command | 点击菜单项 | 该项的 command |
| visible-change | 显隐状态变化 | `boolean` |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 触发器 |
| dropdown | 菜单内容（放 `LhDropdownItem`） |
