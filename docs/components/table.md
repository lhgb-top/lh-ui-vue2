# Table 表格

数据表格。支持排序（受控 / 非受控）、列筛选、列宽拖拽、多级表头（`children` 无限嵌套）与固定列；设置 `height` 后启用虚拟滚动（`rowHeight` 需与实际行高一致）。

<DemoBlock name="table" title="表格" :height="320">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div style="max-width: 760px">
    <p class="demo-note">size="small" + maxHeight + 默认排序（defaultSortProp/defaultSortOrder）+ 筛选</p>
    <LhTable
      :data="rows"
      :columns="columns"
      size="small"
      stripe
      border
      :max-height="200"
      row-key="name"
      default-sort-prop="dynasty"
      default-sort-order="asc"
      :default-filtered-values="{ dynasty: ['宋'] }"
    >
      <template #price="{ value }">
        <span style="color: var(--lh-primary-color); font-weight: 600">{{ value }}</span>
      </template>
    </LhTable>
    <p class="demo-note">「朝代」列默认升序且预筛「宋」；表头筛选按钮可改条件。</p>
    <p class="demo-note" style="margin-top: 16px">嵌套表头（children）+ resizable 拖宽 + formatter + 自定义 sorter</p>
    <LhTable :data="rows2" :columns="groupColumns" border :height="180" :row-height="40" :sorter="dynastySorter">
      <template #price="{ value }">
        <span style="color: var(--lh-primary-color); font-weight: 600">{{ value }}</span>
      </template>
    </LhTable>
    <p class="demo-note">「流传」列用 formatter 格式化为「宫藏/民间」；「估价」列可拖宽（resizable）。</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    rows: [
      { name: '溪山行旅图', dynasty: '宋', price: 1800 },
      { name: '富春山居图', dynasty: '元', price: 2600 },
      { name: '千里江山图', dynasty: '宋', price: 3200 },
      { name: '清明上河图', dynasty: '宋', price: 1500 },
      { name: '韩熙载夜宴图', dynasty: '五代', price: 2100 },
    ],
    rows2: [
      { name: '溪山行旅图', dynasty: '宋', provenance: '宫藏', price: 1800 },
      { name: '富春山居图', dynasty: '元', provenance: '宫藏', price: 2600 },
      { name: '清明上河图', dynasty: '宋', provenance: '宫藏', price: 1500 },
      { name: '照夜白图', dynasty: '唐', provenance: '民间', price: 980 },
    ],
    columns: [
      { prop: 'name', label: '画作', width: 160 },
      {
        prop: 'dynasty',
        label: '朝代',
        width: 120,
        sortable: true,
        filters: [
          { text: '宋', value: '宋' },
          { text: '元', value: '元' },
          { text: '五代', value: '五代' },
        ],
      },
      { prop: 'price', label: '估价（万）', width: 140, align: 'right', slot: 'price' },
    ],
    groupColumns: [
      {
        label: '藏品信息',
        children: [
          { prop: 'name', label: '画作', width: 150 },
          {
            prop: 'provenance',
            label: '流传',
            width: 100,
            formatter: (r) => (r.provenance === '宫藏' ? '宫藏' : '民间'),
          },
        ],
      },
      {
        label: '估值',
        children: [
          { prop: 'dynasty', label: '朝代', width: 90, sortable: true },
          { prop: 'price', label: '估价（万）', width: 130, align: 'right', resizable: true, slot: 'price' },
        ],
      },
    ],
  }),
  methods: {
    dynastySorter(a, b) {
      const order = ['唐', '五代', '宋', '元']
      return order.indexOf(String(a.dynasty)) - order.indexOf(String(b.dynasty))
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
| data | 行数据 | `LhTableRow[]` | `[]` |
| columns | 列配置 | `LhTableColumn[]` | `[]` |
| height | 表体高度（设置后启用虚拟滚动；数字为 px） | `number \| string` | — |
| maxHeight | 非虚拟模式下的最大高度 | `number \| string` | — |
| rowHeight | 虚拟滚动行高（需与实际行高一致） | `number` | — |
| stripe / border | 斑马纹 / 单元格边框 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| rowKey | 行键字段名 | `string` | — |
| defaultSortProp / defaultSortOrder | 默认排序列 / 方向 | `string` / `LhTableSortOrder` | — |
| sorter | 自定义排序函数 | `(a, b) => number` | — |
| resizable | 开启列宽拖拽（仍需列级 `resizable` 配合，且列须为数字 `width`） | `boolean` | `false` |
| defaultFilteredValues | 默认筛选状态（非受控，键为列 prop） | `Record<string, (string \| number)[]>` | — |
| filteredValues | 受控筛选状态（`:filtered-values.sync`） | `Record<string, (string \| number)[]>` | — |
| sx | sx 快速布局属性 | — | — |

## Events

`sortChange ({ prop, order })`、`filterChange ({ prop, values })`、`columnResize ({ prop, width })`、`update:filteredValues`、`rowClick (row, index)`

## Slots

| 插槽 | 说明 |
| --- | --- |
| `<列 slot 名>` | 自定义单元格，作用域参数 `{ row, column, index, value }`（列由 `column.slot` 指定） |
| empty | 无数据时内容（默认「暂无数据」） |

## 无障碍

表头 `role="row"` + 可排序列 `aria-sort`，表体 `role="row"`；
筛选面板为 `role="menu"`，拖宽句柄置 `aria-label` 与 `tabindex`，支持键盘左右调整。
