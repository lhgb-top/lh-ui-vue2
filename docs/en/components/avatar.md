# Avatar

An avatar. Image, icon, and text fall back in priority order: when `src` fails, `icon` and then the first character of `text` are used.

<DemoBlock name="avatar" title="Avatar" :height="240">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap">
      <LhAvatar :src="src" alt="溪山行旅图局部" />
      <LhAvatar :src="src" shape="square" />
      <LhAvatar text="范宽" />
      <LhAvatar icon="lh-icon-user" />
      <LhAvatar text="北宋" shape="square" size="large" />
      <LhAvatar text="郭" size="small" />
      <LhAvatar text="自定义" :size="64" fit="cover" />
    </div>
    <p class="demo-note">图片加载失败时回退到 alt / 图标 / 文字</p>
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap">
      <LhAvatar src="https://placeholder.lhgb.top/broken.png" alt="加载失败" />
      <LhAvatar src="https://placeholder.lhgb.top/broken.png" icon="lh-icon-user" alt="回退图标" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%2046%20Q16%2032%2032%2046%20T64%2046%20V64%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%2726%27%20font-size=%2726%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E5%B1%B1%3C/text%3E%3C/svg%3E',
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| src | Image URL; when empty it falls back to icon, then text | `string` | — |
| alt | Alternative text shown when the image fails to load; also used as the alt | `string` | — |
| icon | Icon class name (shown when src is empty or fails to load) | `string` | — |
| text | Text avatar content (the first character is shown when both src and icon are absent) | `string` | — |
| shape | Avatar shape | `'circle' \| 'square'` | `'circle'` |
| size | Avatar size | `'small' \| 'default' \| 'large' \| number` | `'default'` |
| fit | Image fit mode | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| sx | sx shorthand layout props | — | — |
