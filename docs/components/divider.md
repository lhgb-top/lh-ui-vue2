# Divider 分割线

区隔内容的分割线。支持水平 / 垂直方向、虚线与自定义边框、带文案对齐。

<DemoBlock name="divider" title="分割线" :height="420">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 420px">
    <p class="demo-note">水平分割线</p>
    <LhDivider />
    <p class="demo-note">带文案（默认居中）</p>
    <LhDivider>水墨</LhDivider>
    <LhDivider label-position="left">左对齐文案</LhDivider>
    <LhDivider label-position="right">右对齐文案</LhDivider>
    <p class="demo-note">虚线 / 自定义边框</p>
    <LhDivider dashed />
    <LhDivider border-style="dotted">点线</LhDivider>
    <p class="demo-note">垂直分割线</p>
    <div class="demo-row">
      <span>山水</span>
      <LhDivider direction="vertical" />
      <span>花鸟</span>
      <LhDivider direction="vertical" />
      <span>人物</span>
    </div>
  </div>
</template>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | 虚线 | `boolean` | `false` |
| labelPosition | 带文案时的对齐位置（水平方向生效，垂直恒居中） | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | 边框样式（优先于 dashed） | `string` | — |
| sx | sx 快速布局属性 | — | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 分割线文案（水平方向排在左右，垂直方向排在上下） |
