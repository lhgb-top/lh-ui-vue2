# Row / Col

A 24-column grid system. `LhRow` handles arrangement and spacing, while `LhCol` handles span, offset, and responsive breakpoints.

<DemoBlock name="grid" title="Grid" :height="420">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div>
    <p class="demo-note">基础栅格（24 列）+ gutter 间距</p>
    <LhRow :gutter="16">
      <LhCol :span="8"><div class="grid-cell">span=8</div></LhCol>
      <LhCol :span="8"><div class="grid-cell">span=8</div></LhCol>
      <LhCol :span="8"><div class="grid-cell">span=8</div></LhCol>
    </LhRow>
    <p class="demo-note">offset / push / pull</p>
    <LhRow :gutter="12">
      <LhCol :span="6" :offset="6"><div class="grid-cell">offset=6</div></LhCol>
      <LhCol :span="6" :push="6"><div class="grid-cell">push=6</div></LhCol>
    </LhRow>
    <p class="demo-note">对齐：justify / align</p>
    <LhRow
      justify="center"
      align="middle"
      style="height: 60px; background: var(--lh-bg-color-page, #f6f1ea); border-radius: 6px"
    >
      <LhCol :span="6"><div class="grid-cell">居中</div></LhCol>
    </LhRow>
    <p class="demo-note">响应式断点：:sizes=&#123; xs: 24, sm: 12, md: 8 &#125;</p>
    <LhRow :gutter="12">
      <LhCol v-for="i in 6" :key="i" :sizes="{ xs: 24, sm: 12, md: 8 }">
        <div class="grid-cell">响应列 {{ i }}</div>
      </LhCol>
    </LhRow>
  </div>
</template>
```
<!-- gen-demo-code:end -->

</DemoBlock>

::: tip
The `.grid-cell` used in the demo is example-only styling (gray background, rounded corners) and is not provided by the library.
:::

## Row Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| justify | Main-axis arrangement | `'start' \| 'end' \| 'center' \| 'space-between' \| 'space-around'` | `'start'` |
| align | Cross-axis alignment | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| gutter | Column spacing (px, or `[horizontal, vertical]`) | `number \| [number, number]` | `0` |
| wrap | Whether wrapping is allowed | `boolean` | `true` |
| sx | sx shorthand layout props | — | — |

## Col Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| span | Number of columns occupied (24-column grid) | `number` | — |
| offset | Number of columns to offset from the left | `number` | `0` |
| push | Number of columns to shift right | `number` | `0` |
| pull | Number of columns to shift left | `number` | `0` |
| xs / sm / md / lg / xl | Span per breakpoint: `<640` / `≥640` / `≥768` / `≥1024` / `≥1280px` | `number` | — |
| sizes | Declare spans for every breakpoint at once (equivalent to `xs`–`xl`) | `{ xs?, sm?, md?, lg?, xl? }` | — |
| sx | sx shorthand layout props | — | — |
