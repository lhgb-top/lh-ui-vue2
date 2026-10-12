# Pagination 分页

数据分页导航。支持总条数展示、每页条数切换、跳页与紧凑模式。

<DemoBlock name="pagination" title="分页" :height="420">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| total | 数据总数（必填） | `number` | — |
| pageSize | 每页条数 | `number` | — |
| current | 当前页（:current.sync，事件名 update:current） | `number` | — |
| pageSizes | 每页条数选项 | `number[]` | — |
| showTotal | 是否显示总条数 | `boolean` | `false` |
| showSizeChanger | 是否显示每页条数切换 | `boolean` | `false` |
| showJumper | 是否显示跳页输入 | `boolean` | `false` |
| simple | 紧凑模式 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 页码或每页条数变化 | `(当前页, 每页条数)` |
