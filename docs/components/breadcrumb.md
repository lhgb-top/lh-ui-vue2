# Breadcrumb 面包屑

展示当前页面在层级中的路径。支持自定义分隔符、长链路折叠与链接跳转。

<DemoBlock name="breadcrumb" title="面包屑" :height="220">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| separator | 分隔符字符 | `string` | — |
| maxItems | 最大可见项数（首项 + 省略号 + 末尾若干项），超出折叠；0 或不传表示不折叠 | `number` | — |
| sx | sx 快速布局属性 | — | — |

## BreadcrumbItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| to | 跳转地址；存在且非末项时渲染为链接（检测到 vue-router 时走路由跳转，否则原生导航） | `string` | — |
| replace | 使用 vue-router 跳转时是否以 replace 方式（无路由时无效果） | `boolean` | `false` |

## Slots

| 插槽 | 说明 |
| --- | --- |
| BreadcrumbItem default | 项文案 |
| BreadcrumbItem separator | 单项分隔符（优先于父级 separator） |
