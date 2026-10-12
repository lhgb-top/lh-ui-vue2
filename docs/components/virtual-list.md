# VirtualList 虚拟列表

长列表性能方案：只渲染可视区域内的条目。定高模式用 `itemHeight`，动态高度模式用 `itemSize` 函数。

<DemoBlock name="virtual-list" title="虚拟列表" :height="560">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 数据源（项渲染由 default 插槽负责） | `any[]` | — |
| height | 容器高度（数字为 px） | `number \| string` | — |
| itemHeight | 定高模式的项高（与 itemSize 二选一；提供了 itemSize 时走动态高度） | `number` | — |
| itemSize | 动态高度模式：由调用方返回每项高度 | `(index: number) => number` | — |
| overscan | 过扫描项数 | `number` | — |
| sx | sx 快速布局属性 | — | — |

## Slots

默认插槽（作用域参数：`item` 数据项、`index` 索引）：列表项渲染。

::: tip
demo 的 `.vl-item` 只是示例样式，库本身不提供。
:::
