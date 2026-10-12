# BackTop

A button that appears after scrolling past a threshold, used to scroll back to the top.

<DemoBlock name="backtop" title="BackTop" :height="400">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| target | Scroll container (selector or element; defaults to the viewport) | `string \| HTMLElement` | — |
| visibilityHeight | How many pixels to scroll before the button appears | `number` | — |
| right | Right offset in px | `number` | — |
| bottom | Bottom offset in px | `number` | — |
| smooth | Whether to scroll smoothly | `boolean` | `false` |
| sx | sx shorthand layout prop | — | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Button content (renders the default arrow icon when not provided) |
