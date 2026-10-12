# Space 间距

为相邻元素添加间距的布局容器。支持水平 / 垂直方向、预设档位与自定义间距、换行与对齐。

<DemoBlock name="space" title="间距" :height="420">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | 间距：预设档位 / 像素数字 / [水平, 垂直] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | 允许换行（仅水平方向） | `boolean` | `false` |
| alignment | 交叉轴对齐 | `'start' \| 'center' \| 'end' \| 'baseline'` | `'center'` |
| sx | sx 快速布局属性 | — | — |
