# Descriptions 描述列表

以表格形式呈现条目化的键值信息，支持列数与边框控制。

<DemoBlock name="descriptions" title="描述列表" :height="300">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <LhDescriptions title="溪山行旅图 · 著录信息" :column="2" border :items="items" />
    <LhDescriptions title="溪山行旅图 · 无边框" :column="3" :items="itemsPlain" />
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { label: '作者', value: '范宽' },
      { label: '年代', value: '北宋' },
      { label: '材质', value: '绢本水墨' },
      { label: '收藏', value: '台北故宫博物院', span: 2 },
    ],
    itemsPlain: [
      { label: '作者', value: '范宽' },
      { label: '年代', value: '北宋' },
      { label: '材质', value: '绢本水墨' },
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
| title | 标题 | `string` | `''` |
| column | 每行展示的条目列数 | `number` | `3` |
| border | 展示边框 | `boolean` | `false` |
| items | 条目列表；label / value / span 三元组 | `LhDescriptionsItem[]` | `[]` |
| sx | sx 快速布局属性 | — | — |

::: tip
`items` 的 `span` 控制该条目横跨的列数（默认 1），用于「长值占整行」的排版。
:::
