# TreeSelect 树选择器

树形选择控件。复用 `LhTree` 的展开 / 勾选逻辑，单选时首次点击父节点只展开（再点一次才选中）、点击叶子节点直接选中，多选走勾选框；面板默认挂到 body（Vue2 无 Teleport）。

<DemoBlock name="tree-select" title="树选择器" :height="180">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树数据 | `LhTreeNode[]` | `[]` |
| v-model | 当前值；单选为键字符串，多选为勾选键数组 | `string \| string[]` | — |
| multiple | 多选（显示勾选框，值为勾选键数组） | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| placeholder | 占位文本 | `string` | 语言包 |
| teleported | 面板是否挂到 body | `boolean` | `true` |
| sx | sx 快速布局属性 | — | — |

## Events

`input`（v-model）、`change (value)`

## 无障碍

触发器 `role="combobox"` + `aria-expanded`，面板内继承 `LhTree` 的 `role="tree"` / `role="treeitem"` 语义；
多选模式下勾选框置 `aria-checked`，支持完整键盘导航。
