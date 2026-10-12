# Pagination

Data pagination navigation. Supports total-count display, page-size switching, page jumping, and a compact mode.

<DemoBlock name="pagination" title="Pagination" :height="420">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 20px">
    <LhPagination :total="total" :current.sync="current" :page-size="pageSize" />
    <p class="demo-note">current={{ current }}，pageSize={{ pageSize }}</p>
    <LhPagination
      :total="total"
      show-total
      show-size-changer
      show-jumper
      :page-sizes="[10, 20, 50, 100]"
      :current.sync="current2"
      @change="onChange"
    />
    <p class="demo-note">showTotal + showSizeChanger + showJumper；change 事件：{{ lastChange }}</p>
    <LhPagination :total="total" simple :current.sync="current3" />
    <p class="demo-note">simple 紧凑模式</p>
    <LhPagination :total="total" disabled :current.sync="current4" />
    <p class="demo-note">disabled 禁用</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    total: 128,
    current: 3,
    pageSize: 10,
    current2: 1,
    current3: 2,
    current4: 1,
    lastChange: '（无）',
  }),
  methods: {
    onChange(page, size) {
      this.lastChange = `第 ${page} 页，每页 ${size} 条`
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
| total | Total number of records (required) | `number` | — |
| pageSize | Number of items per page | `number` | — |
| current | Current page (`:current.sync`, event name `update:current`) | `number` | — |
| pageSizes | Available page-size options | `number[]` | — |
| showTotal | Whether to show the total count | `boolean` | `false` |
| showSizeChanger | Whether to show the page-size switcher | `boolean` | `false` |
| showJumper | Whether to show the page-jump input | `boolean` | `false` |
| simple | Compact mode | `boolean` | `false` |
| disabled | Whether the pagination is disabled | `boolean` | `false` |
| sx | sx shorthand layout prop | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| change | Emitted when the page or the page size changes | `(currentPage, pageSize)` |
