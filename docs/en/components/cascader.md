# Cascader

A cascading selector. Sub-level panels expand level by level; `checkStrictly` decouples parent and child so any level can be selected, and `emitPath` controls whether the value is the full path or only the leaf. Panels are appended to the body (Vue 2 has no Teleport).

> In `multiple` mode the value is an array of selected paths, subject to the same `emitPath` rule: with `emitPath=true` each entry is a full path, with `emitPath=false` each entry is only the leaf value. Clearing `v-model` externally also clears the selected tags.

<DemoBlock name="cascader" title="Cascader" :height="450">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 16px">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhCascader v-model="path" :options="options" placeholder="请选择画科" clearable separator=">" />
      <LhCascader v-model="path" :options="options" size="small" disabled />
      <LhCascader v-model="path" :options="options" size="large" readonly />
    </div>
    <p class="demo-note">完整路径（separator=">"）：{{ path.length ? path.join(' &gt; ') : '（未选择）' }}</p>
    <LhCascader
      v-model="leaf"
      :options="options"
      :emit-path="false"
      :show-all-levels="false"
      check-strictly
      placeholder="父子不关联，可选任意层级"
    />
    <p class="demo-note">仅末级值：{{ leaf.length ? leaf.join('，') : '（未选择）' }}</p>
    <LhCascader
      v-model="multi"
      :options="options"
      multiple
      collapse-tags
      filterable
      placeholder="多选 + 折叠标签 + 搜索"
    />
    <p class="demo-note">多选值：{{ multi.length ? multi.map((m) => m.join('/')).join('，') : '（未选择）' }}</p>
    <LhCascader
      v-model="custom"
      :options="customOptions"
      :item-config="{ value: 'id', label: 'name', children: 'sub' }"
      placeholder="自定义字段映射（id/name/sub）"
      clearable
    />
    <p class="demo-note">自定义键：{{ custom.length ? custom.join(' / ') : '（未选择）' }}</p>
    <p class="demo-note">cascading（默认）悬停即展开下级；可级联数据见上方各示例。</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    path: ['shan', 'pomo', 'dapo'],
    leaf: [],
    multi: [],
    custom: [],
    options: [
      {
        value: 'shan',
        label: '山水',
        children: [
          {
            value: 'pomo',
            label: '泼墨山水',
            children: [
              { value: 'xiaopo', label: '小泼墨' },
              { value: 'dapo', label: '大泼墨' },
            ],
          },
          { value: 'qianjiang', label: '浅绛山水' },
        ],
      },
      {
        value: 'hua',
        label: '花鸟',
        children: [
          { value: 'gongbi', label: '工笔花鸟' },
          { value: 'xieyi', label: '写意花鸟' },
        ],
      },
    ],
    customOptions: [
      {
        id: 'hua',
        name: '花鸟',
        sub: [
          { id: 'gongbi', name: '工笔花鸟' },
          { id: 'xieyi', name: '写意花鸟' },
        ],
      },
      {
        id: 'shu',
        name: '书法',
        sub: [{ id: 'kaishu', name: '楷书' }],
      },
    ],
  }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Selected path; the leaf value when `emitPath=false` (arrays of either in multiple mode) | `(string \| number)[]` | — |
| options | Option data | `LhCascaderNode[]` | `[]` |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled / readonly / clearable | Disabled / read-only / clearable | `boolean` | `false` |
| placeholder | Placeholder text | `string` | locale message |
| showAllLevels | Display the full path (default) or only the leaf | `boolean` | `true` |
| checkStrictly | Decouple parent and child so any level can be selected | `boolean` | `false` |
| emitPath | Emit the full path (default) or only the leaf value | `boolean` | `true` |
| multiple | Multi-select | `boolean` | `false` |
| cascading | Expand the next level on hover | `boolean` | `true` |
| separator | Path separator | `string` | `' / '` |
| collapseTags | Collapse multiple tags into a count | `boolean` | `false` |
| filterable | Searchable | `boolean` | `false` |
| itemConfig | Custom field mapping (`value` / `label` / `children` / `disabled`) | `LhCascaderItemConfig` | — |
| teleportTarget | Popper mount target | `string \| HTMLElement` | `'body'` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the selection changes | `(value, nodes)` |

## Slots

| Slot | Description |
| --- | --- |
| no-match | Content shown when a `filterable` search has no matches (defaults to "No matching data") |

## Accessibility

The trigger uses `role="combobox"` + `aria-expanded`, each level panel uses `role="listbox"`, and options use `role="option"`; `aria-activedescendant` is synced as the expanded level changes, with arrow-key / Enter / ESC navigation.
