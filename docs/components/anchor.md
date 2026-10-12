# Anchor 锚点

滚动联动定位的目录导航。点击跳转到目标区域，滚动时高亮当前段。

<DemoBlock name="anchor" title="锚点" :height="320">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 640px">
    <div class="demo-row" style="align-items: flex-start; gap: 24px">
      <div ref="scroller" class="anchor-scroller">
        <div id="anchor-a" class="anchor-sec">
          <h3>山石</h3>
          <p>雨点皴写山石，气势雄壮。</p>
        </div>
        <div id="anchor-b" class="anchor-sec">
          <h3>林木</h3>
          <p>夹叶与点叶交错。</p>
        </div>
        <div id="anchor-c" class="anchor-sec">
          <h3>水口</h3>
          <p>一线瀑布悬于云气。</p>
        </div>
        <div id="anchor-d" class="anchor-sec">
          <h3>题跋</h3>
          <p>范宽款隐于林间。</p>
        </div>
      </div>
      <LhAnchor :items="items" :target="scrollerEl" :offset="12" direction="vertical" smooth />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { id: 'anchor-a', title: '山石' },
      { id: 'anchor-b', title: '林木' },
      { id: 'anchor-c', title: '水口' },
      { id: 'anchor-d', title: '题跋' },
    ],
    scrollerEl: undefined,
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 锚点数据（支持子级） | `LhAnchorItem[]` | — |
| target | 滚动容器（选择器或元素，默认 window） | `string \| HTMLElement` | — |
| offset | 锚点区域相对滚动容器顶部的偏移（用于联动判定） | `number` | — |
| direction | 排列方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | 平滑滚动 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## AnchorItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 目标元素 id | `string` | — |
| title | 显示文本 | `string` | — |
| children | 子级锚点 | `LhAnchorItem[]` | — |

::: tip
demo 的 `.anchor-scroller` / `.anchor-sec` 只是示例样式（滚动容器需自带 `overflow-y: auto`），库本身不提供。
:::
