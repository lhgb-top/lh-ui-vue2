# Avatar 头像

头像展示。图片、图标、文字三种形态按优先级回退：`src` 失败时依次取 `icon`、`text` 首字。

<DemoBlock name="avatar" title="头像" :height="240">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址；为空时依次回退到图标、文字 | `string` | — |
| alt | 图片加载失败的替代文本，同时作为 alt | `string` | — |
| icon | 图标类名（src 为空或加载失败时展示） | `string` | — |
| text | 文字头像内容（src 与 icon 都缺省时取首字展示） | `string` | — |
| shape | 头像形状 | `'circle' \| 'square'` | `'circle'` |
| size | 头像大小 | `'small' \| 'default' \| 'large' \| number` | `'default'` |
| fit | 图片加载模式 | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| sx | sx 快速布局属性 | — | — |
