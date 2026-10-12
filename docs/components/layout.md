# Layout 布局

页面整体布局骨架：`LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter` 五件套，含 Aside 时自动转为纵向。

<DemoBlock name="layout" title="布局" :height="260">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div style="height: 200px; border: 1px solid var(--lh-border-color); border-radius: 6px; overflow: hidden">
    <LhLayout>
      <LhLayoutHeader style="background: var(--lh-primary-color); color: #fff; padding: 0 16px; line-height: 56px">
        Header
      </LhLayoutHeader>
      <LhLayout direction="horizontal">
        <LhLayoutAside
          :width="160"
          aria-label="侧栏导航"
          style="background: var(--lh-fill-color, #f0ebe2); padding: 16px"
        >
          Aside
        </LhLayoutAside>
        <LhLayoutMain style="background: var(--lh-bg-color); padding: 16px">Main</LhLayoutMain>
      </LhLayout>
      <LhLayoutFooter style="background: var(--lh-fill-color, #f0ebe2); padding: 0 16px; line-height: 48px">
        Footer
      </LhLayoutFooter>
    </LhLayout>
  </div>
</template>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Layout Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 排列方向（含 Aside 时自动为 vertical） | `'horizontal' \| 'vertical'` | `'horizontal'` |
| sx | sx 快速布局属性 | — | — |

## LayoutAside Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 侧栏宽度 | `number \| string` | `200` |
| ariaLabel | 无障碍名称（landmark 命名） | `string` | — |
| sx | sx 快速布局属性 | — | — |

::: tip
Header / Main / Footer 只承接语义与布局，除 sx 外无额外 props。
:::
