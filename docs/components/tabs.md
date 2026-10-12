# Tabs 页签

内容区域切换组件。线形/卡片两种外观，支持禁用、可关闭、可新增与底部页签。

<DemoBlock name="tabs" title="页签" :height="420">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前激活页签的 name（受控 modelValue prop） | `string` | — |
| type | 外观 | `'line' \| 'card'` | `'line'` |
| closable | 页签是否可关闭 | `boolean` | `false` |
| addable | 是否显示新增按钮 | `boolean` | `false` |
| tabPosition | 页签位置 | `'top' \| 'bottom'` | `'top'` |
| sx | sx 快速布局属性 | — | — |

## TabPane Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 页签唯一标识（作为稳定键，不建议动态修改） | `string` | — |
| label | 页签标题 | `string` | — |
| disabled | 是否禁用 | `boolean` | `false` |

## Slots

| 插槽 | 说明 |
| --- | --- |
| TabPane default | 页签内容 |
