# Spinner

A lightweight spinning loading indicator. `size` offers three presets or a numeric custom value; when `color` is not passed it inherits `currentColor`.

<DemoBlock name="spinner" title="Spinner" :height="200">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| size | Size | `'small' \| 'default' \| 'large' \| number` | `'default'` |
| color | Spinning color (any CSS color value; inherits currentColor when not passed) | `string` | — |
| sx | sx shorthand layout props | — | — |
