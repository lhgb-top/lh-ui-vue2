# Breadcrumb

Shows the path of the current page within a hierarchy. Supports custom separators, long-chain collapsing, and link navigation.

<DemoBlock name="breadcrumb" title="Breadcrumb" :height="220">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 640px; gap: 20px">
    <LhBreadcrumb>
      <LhBreadcrumbItem>首页</LhBreadcrumbItem>
      <LhBreadcrumbItem>宋代绘画</LhBreadcrumbItem>
      <LhBreadcrumbItem :to="'#'">范宽</LhBreadcrumbItem>
      <LhBreadcrumbItem>溪山行旅图</LhBreadcrumbItem>
    </LhBreadcrumb>
    <LhBreadcrumb separator="/">
      <LhBreadcrumbItem>首页</LhBreadcrumbItem>
      <LhBreadcrumbItem :to="'#'" replace>山水卷</LhBreadcrumbItem>
      <LhBreadcrumbItem>当前页</LhBreadcrumbItem>
    </LhBreadcrumb>
    <p class="demo-note">maxItems 折叠长链路（首项 + 省略号 + 末尾项）</p>
    <LhBreadcrumb :max-items="3">
      <LhBreadcrumbItem>首页</LhBreadcrumbItem>
      <LhBreadcrumbItem>馆藏</LhBreadcrumbItem>
      <LhBreadcrumbItem>宋代</LhBreadcrumbItem>
      <LhBreadcrumbItem>范宽</LhBreadcrumbItem>
      <LhBreadcrumbItem>溪山行旅图</LhBreadcrumbItem>
    </LhBreadcrumb>
  </div>
</template>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Breadcrumb Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| separator | Separator character | `string` | — |
| maxItems | Maximum number of visible items (first item + ellipsis + last few items); collapses the overflow. 0 or omitted means no collapsing | `number` | — |
| sx | sx shorthand layout prop | — | — |

## BreadcrumbItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| to | Target address; rendered as a link when present and not the last item (uses router navigation when vue-router is detected, otherwise native navigation) | `string` | — |
| replace | Whether to use replace mode for vue-router navigation (no effect without a router) | `boolean` | `false` |

## Slots

| Slot | Description |
| --- | --- |
| BreadcrumbItem default | Item text |
| BreadcrumbItem separator | Per-item separator (takes precedence over the parent separator) |
