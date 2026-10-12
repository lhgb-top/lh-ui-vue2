# Table

A data table. Supports sorting (controlled / uncontrolled), column filtering, column resizing by dragging, multi-level headers (`children` nested without limit), and fixed columns; setting `height` enables virtual scrolling (`rowHeight` must match the actual row height).

<DemoBlock name="table" title="Table" :height="320">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| data | Row data | `LhTableRow[]` | `[]` |
| columns | Column configuration | `LhTableColumn[]` | `[]` |
| height | Table body height (setting it enables virtual scrolling; a number is px) | `number \| string` | — |
| maxHeight | Maximum height in non-virtual mode | `number \| string` | — |
| rowHeight | Row height for virtual scrolling (must match the actual row height) | `number` | — |
| stripe / border | Zebra stripes / cell borders | `boolean` | `false` |
| size | Size | `'small' \| 'default' \| 'large'` | `'default'` |
| rowKey | Row key field name | `string` | — |
| defaultSortProp / defaultSortOrder | Default sort column / direction | `string` / `LhTableSortOrder` | — |
| sorter | Custom sort function | `(a, b) => number` | — |
| resizable | Enable column resizing (still requires a column-level `resizable`, and the column must have a numeric `width`) | `boolean` | `false` |
| defaultFilteredValues | Default filter state (uncontrolled; keyed by column prop) | `Record<string, (string \| number)[]>` | — |
| filteredValues | Controlled filter state (`:filtered-values.sync`) | `Record<string, (string \| number)[]>` | — |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| sortChange | Emitted when the sort changes | `({ prop, order })` |
| filterChange | Emitted when a column filter changes | `({ prop, values })` |
| columnResize | Emitted when a column is resized | `({ prop, width })` |
| update:filteredValues | The .sync event for the controlled filter state | — |
| rowClick | Emitted when a row is clicked | `(row, index)` |

## Slots

| Slot | Description |
| --- | --- |
| `<column slot name>` | Custom cell; scope params `{ row, column, index, value }` (the column is picked by `column.slot`) |
| empty | Content for the empty state (defaults to "暂无数据") |

## Accessibility

The header row is `role="row"` with `aria-sort` on sortable columns, and the body rows are `role="row"`;
the filter panel is `role="menu"`, and the resize handle has an `aria-label` plus `tabindex` and supports keyboard left / right adjustment.
