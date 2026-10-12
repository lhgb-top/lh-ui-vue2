# Image

A previewable image container. `fit` passes through to the native `object-fit`, `preview` enables click-to-preview, and `previewSrcList` supports paging through multiple images.

<DemoBlock name="image" title="Image" :height="280">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; align-items: flex-start">
      <div class="demo-col" style="gap: 8px">
        <LhImage :src="src" alt="溪山行旅图" fit="cover" preview />
        <span class="demo-note">cover + 可预览</span>
      </div>
      <div class="demo-col" style="gap: 8px">
        <LhImage :src="src" alt="contain 模式" fit="contain" />
        <span class="demo-note">contain</span>
      </div>
      <div class="demo-col" style="gap: 8px">
        <LhImage :src="src" alt="懒加载" fit="fill" lazy />
        <span class="demo-note">fill + lazy</span>
      </div>
    </div>
    <p class="demo-note">previewSrcList 多图预览（点击首图依次翻阅）</p>
    <LhImage :src="src" alt="多图预览入口" fit="cover" preview :preview-src-list="gallery" />
  </div>
</template>

<script>
export default {
  data: () => ({
    src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27240%27%20height=%27160%27%3E%3Crect%20width=%27240%27%20height=%27160%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%20115%20Q60%2080%20120%20115%20T240%20115%20V160%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%2767%27%20font-size=%2718%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E6%BA%AA%E5%B1%B1%E8%A1%8C%E6%97%85%E5%9B%BE%3C/text%3E%3C/svg%3E',
    gallery: [
      'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27640%27%20height=%27420%27%3E%3Crect%20width=%27640%27%20height=%27420%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%20302%20Q160%20210%20320%20302%20T640%20302%20V420%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%27176%27%20font-size=%2740%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E7%AC%AC%E4%B8%80%E5%B9%85%3C/text%3E%3C/svg%3E',
      'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27640%27%20height=%27420%27%3E%3Crect%20width=%27640%27%20height=%27420%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%20302%20Q160%20210%20320%20302%20T640%20302%20V420%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%27176%27%20font-size=%2740%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E7%AC%AC%E4%BA%8C%E5%B9%85%3C/text%3E%3C/svg%3E',
      'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27640%27%20height=%27420%27%3E%3Crect%20width=%27640%27%20height=%27420%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%20302%20Q160%20210%20320%20302%20T640%20302%20V420%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%27176%27%20font-size=%2740%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E7%AC%AC%E4%B8%89%E5%B9%85%3C/text%3E%3C/svg%3E',
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
| src | Image URL | `string` | — |
| alt | Alternative text (strictly required for a11y; required at the TS level) | `string` | — |
| fit | Fit mode (native object-fit) | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | Whether clicking opens the preview | `boolean` | `false` |
| previewSrcList | Preview image list (degrades to `[src]` when not passed) | `string[]` | — |
| lazy | Native lazy loading (loading="lazy") | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## ImageViewer Props

The separately exported viewer: `images` (the preview image list) and `initialIndex` (the starting index, default 0).

::: tip
`LhImage`'s `preview` already bundles the viewer, so most scenarios never need `LhImageViewer` directly.
:::
