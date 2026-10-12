# VirtualList

A performance solution for long lists: only the items inside the visible area are rendered. Use `itemHeight` for fixed-height mode, or the `itemSize` function for dynamic heights.

<DemoBlock name="virtual-list" title="Virtual list" :height="560">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <p class="demo-note">定高模式：itemHeight + overscan，千条数据只渲染可见区</p>
    <LhVirtualList :data="items" :height="240" :item-height="36" :overscan="6">
      <template #default="{ item, index }">
        <div class="vl-item" :style="{ background: index % 2 ? 'transparent' : 'var(--lh-fill-color, #f6f1ea)' }">
          {{ index + 1 }}. {{ item }}
        </div>
      </template>
    </LhVirtualList>
    <p class="demo-note">动态高度模式：itemSize 返回每项高度</p>
    <LhVirtualList :data="items" :height="200" :item-size="sizeOf">
      <template #default="{ item, index }">
        <div class="vl-item" :style="{ height: sizeOf(index) + 'px' }">
          {{ index + 1 }}. {{ item }}（高 {{ sizeOf(index) }}px）
        </div>
      </template>
    </LhVirtualList>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: Array.from({ length: 1000 }, (_, i) => `画作条目 ${i + 1}`),
  }),
  methods: {
    sizeOf(index) {
      return 28 + (index % 5) * 14
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
| data | Data source (items are rendered by the default slot) | `any[]` | — |
| height | Container height (a number is px) | `number \| string` | — |
| itemHeight | Item height for fixed-height mode (mutually exclusive with itemSize; providing itemSize switches to dynamic heights) | `number` | — |
| itemSize | Dynamic-height mode: the caller returns the height of each item | `(index: number) => number` | — |
| overscan | Number of overscanned items | `number` | — |
| sx | sx shorthand layout props | — | — |

## Slots

The default slot (scope params: `item` — the data item, `index` — the index) renders a list item.

::: tip
The `.vl-item` class in the demo is an example style and is not provided by the library.
:::
