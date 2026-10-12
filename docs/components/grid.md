# Row / Col 栅格

24 列栅格系统。`LhRow` 排列与间距，`LhCol` 跨度、偏移与响应式断点。

<DemoBlock name="grid" title="栅格" :height="420">

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
demo 的 `.grid-cell` 只是示例样式（灰底圆角），库本身不提供。
:::

## Row Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| justify | 主轴排列 | `'start' \| 'end' \| 'center' \| 'space-between' \| 'space-around'` | `'start'` |
| align | 交叉轴对齐 | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| gutter | 列间距（px 或 [横向, 纵向]） | `number \| [number, number]` | `0` |
| wrap | 允许换行 | `boolean` | `true` |
| sx | sx 快速布局属性 | — | — |

## Col Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 占据列数（24 栅格制） | `number` | — |
| offset | 左侧偏移列数 | `number` | `0` |
| push | 向右平移列数 | `number` | `0` |
| pull | 向左平移列数 | `number` | `0` |
| xs / sm / md / lg / xl | 断点跨度：<640 / ≥640 / ≥768 / ≥1024 / ≥1280px | `number` | — |
| sizes | 按断点批量声明（与 xs~xl 等价） | `{ xs?, sm?, md?, lg?, xl? }` | — |
| sx | sx 快速布局属性 | — | — |
