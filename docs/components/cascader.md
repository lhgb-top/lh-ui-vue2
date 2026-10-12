# Cascader 级联选择

级联选择器。逐级展开下级面板，`checkStrictly` 解除父子关联后可选任意层级，`emitPath` 控制回填完整路径还是仅末级值；面板挂载到 body（Vue2 无 Teleport）。

> 多选（`multiple`）时值为勾选路径数组，同样受 `emitPath` 约束：`emitPath=true` 每项为完整路径，`emitPath=false` 每项仅末级值；受控清空（外部置空 `v-model`）会同步清空已选标签。

<DemoBlock name="cascader" title="级联选择" :height="450">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 选中路径；`emitPath=false` 时为末级值（多选时为以上两者的数组） | `(string \| number)[]` | — |
| options | 可选项数据 | `LhCascaderNode[]` | `[]` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled / readonly / clearable | 禁用 / 只读 / 可清空 | `boolean` | `false` |
| placeholder | 占位文本 | `string` | 语言包 |
| showAllLevels | 展示完整路径（默认）或仅末级 | `boolean` | `true` |
| checkStrictly | 父子不关联，可选任意层级 | `boolean` | `false` |
| emitPath | 回填完整路径（默认）或仅末级值 | `boolean` | `true` |
| multiple | 多选 | `boolean` | `false` |
| cascading | 悬停即展开下级 | `boolean` | `true` |
| separator | 路径分隔符 | `string` | `' / '` |
| collapseTags | 多选时折叠标签为计数 | `boolean` | `false` |
| filterable | 可搜索 | `boolean` | `false` |
| itemConfig | 自定义字段映射（`value`/`label`/`children`/`disabled`） | `LhCascaderItemConfig` | — |
| teleportTarget | 弹出层挂载目标 | `string \| HTMLElement` | `'body'` |
| sx | sx 快速布局属性 | — | — |

## Events

`input`（v-model）、`change (value, nodes)`

## Slots

| 插槽 | 说明 |
| --- | --- |
| no-match | `filterable` 搜索无匹配时的内容（默认「无匹配数据」） |

## 无障碍

触发器 `role="combobox"` + `aria-expanded`，各级面板 `role="listbox"`，选项 `role="option"`；
展开层级变化时同步 `aria-activedescendant`，支持方向键 / Enter / ESC 键盘导航。
