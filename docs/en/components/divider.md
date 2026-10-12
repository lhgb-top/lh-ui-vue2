# Divider

A divider for separating content. Supports horizontal and vertical directions, dashed and custom borders, and label alignment.

<DemoBlock name="divider" title="Divider" :height="420">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | Dashed | `boolean` | `false` |
| labelPosition | Alignment of the label (horizontal only; vertical labels are always centred) | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | Border style (takes precedence over dashed) | `string` | — |
| sx | sx shorthand layout props | — | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Divider label (left/right when horizontal, above/below when vertical) |
