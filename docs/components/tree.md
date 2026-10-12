# Tree 树形控件

树形展示与选择。支持勾选框（默认父子级联 + 半选，`checkStrictly` 解除联动）、多选、懒加载（展开未加载节点时调 `load`）；受控键三件套均走 `.sync`。

<DemoBlock name="tree" title="树形控件" :height="280">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树数据 | `LhTreeNode[]` | `[]` |
| showCheckbox | 显示勾选框 | `boolean` | `false` |
| multiple | 多选（点击节点切换选中而非替换） | `boolean` | `false` |
| expandOnClickNode | 点击非叶子节点时展开 / 收起 | `boolean` | `false` |
| defaultExpandedKeys / expandedKeys | 默认展开 / 受控展开的键 | `string[]` | — |
| defaultSelectedKeys / selectedKeys | 默认选中 / 受选选中的键 | `string[]` | — |
| defaultCheckedKeys / checkedKeys | 默认勾选 / 受控勾选的键 | `string[]` | — |
| checkStrictly | 父子勾选不联动（无级联与半选） | `boolean` | `false` |
| lazy | 懒加载：展开未加载的非叶子节点时调 `load` | `boolean` | `false` |
| load | 懒加载回调，`resolve(children)` 提交并展开、`reject()` 取消 | `(node, resolve, reject) => void` | — |
| disabled | 整体禁用 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## Events

`update:expandedKeys`、`update:selectedKeys`、`update:checkedKeys`（均 `.sync`）、
`expand (key, isExpanded)`、`select (key, node)`、`check (keys, node)`、`nodeLoad (node, children)`

## Slots

| 插槽 | 说明 |
| --- | --- |
| node | 节点标签，作用域参数 `{ node, level, expanded, selected }` |
| empty | 无数据时内容（默认「暂无数据」） |

## 无障碍

节点 `role="treeitem"` + `aria-expanded`（可展开节点）+ `aria-selected` / `aria-checked`；
容器 `role="tree"`，支持方向键上下移动、左右展开收起、空格勾选、回车选中。
