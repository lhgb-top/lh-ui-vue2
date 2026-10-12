# Tabs

A content-area switcher with line and card appearances. Supports disabled, closable, and addable tabs, and bottom placement.

<DemoBlock name="tabs" title="Tabs" :height="420">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 640px; gap: 20px">
    <LhTabs v-model="active">
      <LhTabPane name="song" label="宋代">
        <p class="demo-note">范宽《溪山行旅图》、郭熙《早春图》。</p>
      </LhTabPane>
      <LhTabPane name="yuan" label="元代">
        <p class="demo-note">黄公望《富春山居图》。</p>
      </LhTabPane>
      <LhTabPane name="ming" label="明代" disabled>
        <p class="demo-note">禁用页签。</p>
      </LhTabPane>
    </LhTabs>
    <p class="demo-note">v-model={{ active }}</p>
    <LhTabs v-model="active2" type="card" tab-position="bottom" closable addable>
      <LhTabPane v-for="t in panes" :key="t.name" :name="t.name" :label="t.label">
        <p class="demo-note">{{ t.label }} 内容</p>
      </LhTabPane>
    </LhTabs>
    <p class="demo-note">card + 底部页签 + closable + addable</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    active: 'song',
    active2: 'a',
    panes: [
      { name: 'a', label: '卷轴 A' },
      { name: 'b', label: '卷轴 B' },
      { name: 'c', label: '卷轴 C' },
    ],
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Tabs Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Name of the currently active tab (controlled `modelValue` prop) | `string` | — |
| type | Appearance | `'line' \| 'card'` | `'line'` |
| closable | Whether tabs are closable | `boolean` | `false` |
| addable | Whether to show the add button | `boolean` | `false` |
| tabPosition | Tab placement | `'top' \| 'bottom'` | `'top'` |
| sx | sx shorthand layout prop | — | — |

## TabPane Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| name | Unique tab identifier (used as a stable key; changing it dynamically is not recommended) | `string` | — |
| label | Tab label | `string` | — |
| disabled | Whether the tab is disabled | `boolean` | `false` |

## Slots

| Slot | Description |
| --- | --- |
| TabPane default | Tab content |
