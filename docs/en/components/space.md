# Space

A layout container that adds spacing between adjacent elements. Supports horizontal and vertical directions, preset sizes and custom spacing, wrapping, and alignment.

<DemoBlock name="space" title="Spacing" :height="420">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <p class="demo-note">水平方向 + 预设间距</p>
    <LhSpace>
      <LhButton>水墨</LhButton>
      <LhButton>花鸟</LhButton>
      <LhButton>人物</LhButton>
    </LhSpace>
    <p class="demo-note">垂直方向</p>
    <LhSpace direction="vertical">
      <LhButton>水墨</LhButton>
      <LhButton>花鸟</LhButton>
    </LhSpace>
    <p class="demo-note">自定义间距 + 换行</p>
    <LhSpace :size="24" wrap>
      <LhTag v-for="item in items" :key="item">{{ item }}</LhTag>
    </LhSpace>
    <p class="demo-note">对齐方式 alignment=start</p>
    <LhSpace alignment="start">
      <LhButton>短</LhButton>
      <div style="height: 48px; padding: 12px; border: 1px dashed var(--lh-border-color)">高块</div>
    </LhSpace>
  </div>
</template>

<script>
export default {
  data: () => ({ items: ['水墨', '花鸟', '人物', '工笔', '写意', '没骨'] }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Arrangement direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | Spacing: preset size / pixels as a number / [horizontal, vertical] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | Allow wrapping (horizontal direction only) | `boolean` | `false` |
| alignment | Cross-axis alignment | `'start' \| 'center' \| 'end' \| 'baseline'` | `'center'` |
| sx | sx shorthand layout props | — | — |
