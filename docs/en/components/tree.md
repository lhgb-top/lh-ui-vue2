# Tree

A tree view with selection. Supports checkboxes (parent / children linked by default with an indeterminate state; `checkStrictly` breaks the linkage), multiple selection, and lazy loading (expanding an unloaded node calls `load`); the three controlled key props all work with `.sync`.

<DemoBlock name="tree" title="Tree" :height="280">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 320px">
    <p class="demo-note">复选 + checkStrictly（父子不关联）+ 默认展开/选中/勾选键</p>
    <LhTree
      :data="data"
      show-checkbox
      check-strictly
      :default-expanded-keys="['song']"
      :default-selected-keys="['xishan']"
      :default-checked-keys="['libai']"
      :expand-on-click-node="false"
      @select="onSelect"
      @check="onCheck"
    />
    <p class="demo-note">点击选中：{{ selected }}；勾选键：{{ checked.join('、') || '（无）' }}</p>
    <p class="demo-note">multiple 多选 + disabled 禁用整棵</p>
    <LhTree :data="data" multiple disabled :default-expanded-keys="['tang']" @select="onSelectMulti" />
    <p class="demo-note">多选结果：{{ multi.join('、') || '（无）' }}</p>
    <p class="demo-note">受控键：expandedKeys / selectedKeys / checkedKeys</p>
    <LhTree
      :data="data"
      show-checkbox
      :expanded-keys="['song']"
      :selected-keys="['guo']"
      :checked-keys="['xishan']"
      @select="onSelect"
    />
    <p class="demo-note">lazy 懒加载（点击展开时调 load 拉子节点）</p>
    <LhTree :data="lazyData" lazy :load="onLoad" :default-expanded-keys="['root']" />
  </div>
</template>

<script>
export default {
  data: () => ({
    selected: '（无）',
    checked: [],
    multi: [],
    data: [
      {
        key: 'tang',
        label: '唐代',
        children: [
          { key: 'wangwei', label: '王维' },
          { key: 'libai', label: '李白' },
        ],
      },
      {
        key: 'song',
        label: '宋代',
        children: [
          {
            key: 'fan',
            label: '范宽',
            children: [{ key: 'xishan', label: '溪山行旅图' }],
          },
          { key: 'guo', label: '郭熙' },
        ],
      },
    ],
    lazyData: [{ key: 'root', label: '画科（点击展开懒加载）' }],
  }),
  methods: {
    onSelect(key) {
      this.selected = String(key)
    },
    onCheck(keys) {
      this.checked = Array.isArray(keys) ? keys : []
    },
    onSelectMulti(keys) {
      this.multi = Array.isArray(keys) ? keys : [String(keys)]
    },
    onLoad(node, resolve) {
      setTimeout(() => {
        var _a, _b
        resolve([
          { key: `${String((_a = node.key) !== null && _a !== void 0 ? _a : '')}-a`, label: '山水' },
          { key: `${String((_b = node.key) !== null && _b !== void 0 ? _b : '')}-b`, label: '花鸟' },
        ])
      }, 400)
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
| data | Tree data | `LhTreeNode[]` | `[]` |
| showCheckbox | Show checkboxes | `boolean` | `false` |
| multiple | Multiple selection (clicking a node toggles the selection instead of replacing it) | `boolean` | `false` |
| expandOnClickNode | Expand / collapse a non-leaf node when it is clicked | `boolean` | `false` |
| defaultExpandedKeys / expandedKeys | Default expanded / controlled expanded keys | `string[]` | — |
| defaultSelectedKeys / selectedKeys | Default selected / controlled selected keys | `string[]` | — |
| defaultCheckedKeys / checkedKeys | Default checked / controlled checked keys | `string[]` | — |
| checkStrictly | No parent / children check linkage (no cascading or indeterminate state) | `boolean` | `false` |
| lazy | Lazy loading: expanding an unloaded non-leaf node calls `load` | `boolean` | `false` |
| load | Lazy-load callback; `resolve(children)` commits and expands, `reject()` cancels | `(node, resolve, reject) => void` | — |
| disabled | Disable the whole tree | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| update:expandedKeys | .sync event for the expanded keys | — |
| update:selectedKeys | .sync event for the selected keys | — |
| update:checkedKeys | .sync event for the checked keys | — |
| expand | Emitted when a node is expanded / collapsed | `(key, isExpanded)` |
| select | Emitted when a node is selected | `(key, node)` |
| check | Emitted when a checkbox changes | `(keys, node)` |
| nodeLoad | Emitted when a lazy load resolves | `(node, children)` |

## Slots

| Slot | Description |
| --- | --- |
| node | Node label; scope params `{ node, level, expanded, selected }` |
| empty | Content for the empty state (defaults to "暂无数据") |

## Accessibility

Nodes are `role="treeitem"` with `aria-expanded` (for expandable nodes) plus `aria-selected` / `aria-checked`;
the container is `role="tree"` and supports arrow keys to move up / down, left / right to collapse / expand, Space to check, and Enter to select.
