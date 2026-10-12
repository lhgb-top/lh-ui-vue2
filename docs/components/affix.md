# Affix 固钉

滚动到阈值时将元素固定在视口顶部或底部。常用于吸顶的工具条。

<DemoBlock name="affix" title="固钉" :height="380">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 640px">
    <p class="demo-note">在下方容器内滚动，吸顶条会在距顶 12px 时固定</p>
    <div ref="scroller" class="anchor-scroller">
      <div v-for="i in 12" :key="i" class="anchor-sec">
        <h3>第 {{ i }} 段</h3>
        <p>上滚下滚观察吸顶条。</p>
      </div>
    </div>
    <LhAffix :target="scrollerEl" :offset-top="12">
      <div class="affix-bar">吸顶条（offsetTop=12）</div>
    </LhAffix>
    <p class="demo-note">Affix 需放在滚动容器外部、容器之后，滚动时自动 fixed。</p>
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
| offsetTop | 距视口顶部多少像素触发吸顶 | `number` | — |
| offsetBottom | 距视口底部多少像素触发吸底（优先于 offsetTop） | `number` | — |
| target | 滚动监听容器（选择器或元素，默认视口） | `string \| HTMLElement` | — |
| sx | sx 快速布局属性 | — | — |

::: tip
`target` 需是可滚动容器（`overflow: auto`）。吸顶内容超出容器可视区时，Affix 可能被容器边缘裁切，内容高度应保持精简。
:::
