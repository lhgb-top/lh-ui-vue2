# TreeSelect

A tree-style select. It reuses `LhTree`'s expand / check logic: in single-select mode the first click on a parent only expands it (a second click selects), clicking a leaf selects directly, and multiple selection uses checkboxes. The panel is appended to the body by default (Vue 2 has no Teleport).

<DemoBlock name="tree-select" title="Tree select" :height="180">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 16px">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhTreeSelect v-model="single" :data="data" placeholder="单选（点父节点展开，点叶子选中）" />
      <LhTreeSelect v-model="single" :data="data" disabled placeholder="禁用" />
      <LhTreeSelect v-model="multi" :data="data" multiple placeholder="多选（勾选框）" />
    </div>
    <LhTreeSelect v-model="embedded" :data="data" :teleported="false" placeholder="teleported=false 面板内嵌" />
    <p class="demo-note">
      单选：{{ single || '（未选择）' }}；多选：{{ multi.join('、') || '（未选择）' }}；内嵌：{{
        embedded || '（未选择）'
      }}
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    single: 'xishan',
    multi: [],
    embedded: '',
    data: [
      {
        key: 'song',
        label: '宋代',
        children: [
          { key: 'fan', label: '范宽' },
          { key: 'xishan', label: '溪山行旅图' },
        ],
      },
      { key: 'yuan', label: '元代', children: [{ key: 'huang', label: '黄公望' }] },
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
| data | The tree data | `LhTreeNode[]` | `[]` |
| v-model | The current value; a key string in single-select, an array of checked keys in multiple | `string \| string[]` | — |
| multiple | Multiple selection (shows checkboxes; the value is an array of checked keys) | `boolean` | `false` |
| disabled | Disabled | `boolean` | `false` |
| placeholder | Placeholder text | `string` | locale message |
| teleported | Whether the panel is appended to the body | `boolean` | `true` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the selection changes | `(value)` |

## Accessibility

The trigger has `role="combobox"` + `aria-expanded`, and the panel inherits `LhTree`'s `role="tree"` / `role="treeitem"` semantics;
in multiple mode the checkboxes carry `aria-checked`, and full keyboard navigation is supported.
