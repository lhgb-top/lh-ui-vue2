# Layout

The page-level layout skeleton: `LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter`. It switches to vertical automatically when an aside is present.

<DemoBlock name="layout" title="Page layout" :height="260">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Arrangement direction (vertical automatically when an aside is present) | `'horizontal' \| 'vertical'` | `'horizontal'` |
| sx | sx shorthand layout props | — | — |

## LayoutAside Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| width | Aside width | `number \| string` | `200` |
| ariaLabel | Accessible name (landmark naming) | `string` | — |
| sx | sx shorthand layout props | — | — |

::: tip
Header / Main / Footer carry semantics and layout only — aside from `sx` they take no extra props.
:::
