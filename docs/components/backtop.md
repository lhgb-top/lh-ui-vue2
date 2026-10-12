# BackTop 回到顶部

滚动超过阈值后出现的返回顶部按钮。

<DemoBlock name="backtop" title="回到顶部" :height="400">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 640px">
    <p class="demo-note">在容器内向下滚动超过 visibilityHeight（200px），右下角出现回到顶部按钮</p>
    <div ref="scroller" class="anchor-scroller">
      <div v-for="i in 20" :key="i" class="anchor-sec">
        <h3>第 {{ i }} 段</h3>
        <p>向下滚动后点击右下角按钮。</p>
      </div>
    </div>
    <LhBackTop :target="scrollerEl" :visibility-height="200" :right="24" :bottom="24" smooth />
  </div>
</template>

<script>
export default {
  data: () => ({
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
| target | 滚动容器（选择器或元素，默认视口） | `string \| HTMLElement` | — |
| visibilityHeight | 滚动多少像素后出现 | `number` | — |
| right | 距右侧偏移 px | `number` | — |
| bottom | 距底部偏移 px | `number` | — |
| smooth | 是否平滑滚动 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 按钮内容（未传时渲染默认箭头图标） |
