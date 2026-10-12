# Anchor

Table-of-contents navigation that follows scroll position. Click to jump to a target section; the current section is highlighted while scrolling.

<DemoBlock name="anchor" title="Anchor" :height="320">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| items | Anchor data (supports children) | `LhAnchorItem[]` | — |
| target | Scroll container (selector or element; defaults to window) | `string \| HTMLElement` | — |
| offset | Offset of the anchor section relative to the top of the scroll container (used for linkage detection) | `number` | — |
| direction | Arrangement direction | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | Smooth scrolling | `boolean` | `false` |
| sx | sx shorthand layout prop | — | — |

## AnchorItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| id | Target element id | `string` | — |
| title | Display text | `string` | — |
| children | Child anchors | `LhAnchorItem[]` | — |

::: tip
The `.anchor-scroller` / `.anchor-sec` classes in the demo are example styles only (the scroll container must provide its own `overflow-y: auto`); they are not provided by the library.
:::
