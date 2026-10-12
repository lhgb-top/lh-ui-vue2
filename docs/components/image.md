# Image 图片

可预览的图片容器。`fit` 透传原生 `object-fit`，`preview` 开启点击预览，`previewSrcList` 支持多图翻阅。

<DemoBlock name="image" title="图片" :height="280">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | `string` | — |
| alt | 替代文本（a11y 强约束，TS 层必填） | `string` | — |
| fit | 裁切模式（原生 object-fit） | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | 是否可点击预览 | `boolean` | `false` |
| previewSrcList | 预览图列表（未传时退化为 [src]） | `string[]` | — |
| lazy | 原生懒加载（loading="lazy"） | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## ImageViewer Props

独立导出的预览器：`images`（预览图列表）、`initialIndex`（初始下标，默认 0）。

::: tip
`LhImage` 的 `preview` 已内置 viewer，多数场景无需直接使用 `LhImageViewer`。
:::
