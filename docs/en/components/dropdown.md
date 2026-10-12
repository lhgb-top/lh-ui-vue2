# Dropdown

A menu list that drops down. Three triggers — hover / click / right-click — with menu items that can carry a command identifier and dividers.

<DemoBlock name="dropdown" title="Dropdown" :height="360">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| trigger | Trigger mode | `'hover' \| 'click' \| 'contextmenu'` | `'hover'` |
| placement | Display position | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom'` |
| flip | Whether to flip along the main axis when space is insufficient (on by default); set false to position strictly by placement and allow viewport overflow | `boolean` | `true` |
| visible | Manually controlled visibility (:visible.sync) | `boolean` | — |
| disabled | Whether to disable | `boolean` | `false` |
| hideOnClick | Whether the menu closes after a menu item is clicked | `boolean` | `true` |
| teleportTarget | Menu mount target (selector or element, default body; 2.7 has no Teleport, implemented via host movement) | `string \| HTMLElement` | — |
| popperClass | Custom class for the menu | `string` | — |
| maxHeight | Menu maximum height | `string \| number` | — |
| themeVars | Component-level theme variables, overriding the ConfigProvider configuration | `Record<string, string>` | — |
| bgPattern | Component-level background pattern, overriding the ConfigProvider configuration | `string` | — |
| sx | sx shorthand layout props (applied to the trigger root element) | — | — |

## DropdownItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| command | Command identifier, emitted with the command event on click | `string \| number` | — |
| disabled | Whether to disable (kept focusable so it stays in the accessibility tree) | `boolean` | `false` |
| divided | Whether to show a divider above the item | `boolean` | `false` |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| command | A menu item is clicked | That item's command |
| visible-change | Visibility changed | `boolean` |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger |
| dropdown | Menu content (holds `LhDropdownItem`s) |
