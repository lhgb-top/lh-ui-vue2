# ConfigProvider

Provides global size, locale, and theme variables to a subtree. What is provided is a **computed reference** (not a snapshot), so changes to the provider's props propagate live to every consuming component.

<DemoBlock name="config-provider" title="Local theming" :height="490">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 20px">
    <LhConfigProvider
      :theme-vars="{
        'primary-color': '#4a6741',
        'bg-color': '#f4f7ee',
        'text-primary': '#2c2a26',
        'text-regular': '#5a5a5a',
      }"
      :pattern-components="['button', 'tag']"
    >
      <div
        style="
          padding: 16px;
          background: var(--lh-bg-color);
          border: 1px dashed var(--lh-primary-color);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        "
      >
        <LhButton type="primary">竹青主题按钮</LhButton>
        <LhTag type="primary">竹青标签</LhTag>
        <LhInput placeholder="竹青输入框" style="width: 180px" />
      </div>
    </LhConfigProvider>
    <p class="demo-note">themeVars 覆盖全局 --lh-* 变量；patternComponents 白名单内的组件才应用 bg-pattern。</p>
    <LhConfigProvider
      :theme-vars="{ 'primary-color': '#8b5a2b' }"
      :component-theme="{ button: { 'primary-color': '#2f6f5e' }, tag: { 'primary-color': '#2f6f5e' } }"
    >
      <div style="padding: 16px; display: flex; gap: 12px; flex-wrap: wrap">
        <LhButton type="primary">松绿按钮（componentTheme 单独覆盖）</LhButton>
        <LhTag type="primary">松绿标签</LhTag>
      </div>
    </LhConfigProvider>
    <p class="demo-note">componentTheme 按组件单独覆盖（优先级高于全局 themeVars）。</p>
    <LhConfigProvider size="large" locale="en-US">
      <div style="padding: 16px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center">
        <LhInput placeholder="size=large" style="width: 180px" />
        <LhPagination :total="50" :page-size="10" />
      </div>
    </LhConfigProvider>
    <p class="demo-note">size 全局尺寸 + locale 切换语言包（分页器文案变为英文）。</p>
  </div>
</template>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| size | Global size (takes effect when a child component does not pass an explicit size) | `LhSizes` | — |
| locale | Global locale (synced to the lhlocale singleton via an immediate watch) | `LhLocaleType` | — |
| themeVars | Global theme variables (the `--lh-` prefix may be omitted) | `Record<string, string>` | — |
| patternComponents | Whitelist of components the bg-pattern applies to | `LhThemeableComponent[]` | — |
| componentTheme | Per-component theme variable overrides | `Partial<Record<Component, Vars>>` | — |

## Composable

```ts
import { useLhConfigContext } from '@lh-ui/vue2'
// 自定义组件内注入：返回 ComputedRef<LhConfigContext> | null
const ctx = useLhConfigContext()
```

::: warning
Imperative services (mounted with `new Vue`) do not inherit the provide/inject context; they read the global size and locale from the lhlocale singleton.
:::
