# Descriptions

Displays keyed, itemized information in a table-like layout, with column count and border controls.

<DemoBlock name="descriptions" title="Descriptions" :height="300">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Title | `string` | `''` |
| column | Number of item columns per row | `number` | `3` |
| border | Show borders | `boolean` | `false` |
| items | Item list; label / value / span triples | `LhDescriptionsItem[]` | `[]` |
| sx | sx shorthand layout props | — | — |

::: tip
The `span` of an item controls how many columns it spans (default 1), for the "long value takes a full row" layout.
:::
