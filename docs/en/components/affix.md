# Affix

Fixes an element to the top or bottom of the viewport once a scroll threshold is reached. Commonly used for sticky toolbars.

<DemoBlock name="affix" title="Affix" :height="380">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| offsetTop | Pixels from the top of the viewport that trigger the fixed position | `number` | — |
| offsetBottom | Pixels from the bottom of the viewport that trigger the fixed position (takes precedence over offsetTop) | `number` | — |
| target | Scroll listener container (selector or element; defaults to the viewport) | `string \| HTMLElement` | — |
| sx | sx shorthand layout prop | — | — |

::: tip
`target` must be a scrollable container (`overflow: auto`). When the fixed content exceeds the visible area of the container, Affix may be clipped by the container's edge — keep the content height compact.
:::
