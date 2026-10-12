# Spinner 加载指示器

轻量旋转加载图标。`size` 预设三档或数字自定义，`color` 未传时继承 `currentColor`。

<DemoBlock name="spinner" title="加载指示器" :height="200">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 48px; flex-wrap: wrap">
      <div class="demo-col" style="align-items: center; gap: 8px">
        <LhSpinner size="small" />
        <span class="demo-note">small</span>
      </div>
      <div class="demo-col" style="align-items: center; gap: 8px">
        <LhSpinner />
        <span class="demo-note">default</span>
      </div>
      <div class="demo-col" style="align-items: center; gap: 8px">
        <LhSpinner size="large" />
        <span class="demo-note">large</span>
      </div>
      <div class="demo-col" style="align-items: center; gap: 8px">
        <LhSpinner :size="56" color="var(--lh-primary-color)" />
        <span class="demo-note">自定义 size=56 + color</span>
      </div>
    </div>
  </div>
</template>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 尺寸 | `'small' \| 'default' \| 'large' \| number` | `'default'` |
| color | 旋转颜色（CSS color 值，未传时继承 currentColor） | `string` | — |
| sx | sx 快速布局属性 | — | — |
