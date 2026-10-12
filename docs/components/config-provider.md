# ConfigProvider 全局配置

为子树提供全局尺寸、语言与主题变量。provide 的是 **computed 引用**（非快照），provider 的 prop 变化会实时传导给所有消费组件。

<DemoBlock name="config-provider" title="局部主题定制" :height="490">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 全局尺寸（子组件未显式传 size 时生效） | `LhSizes` | — |
| locale | 全局语言（watch immediate 同步 lhlocale 单例） | `LhLocaleType` | — |
| themeVars | 全局主题变量（键可省略 `--lh-` 前缀） | `Record<string, string>` | — |
| patternComponents | bg-pattern 生效白名单 | `LhThemeableComponent[]` | — |
| componentTheme | 按组件覆盖主题变量 | `Partial<Record<Component, Vars>>` | — |

## 组合 API

```ts
import { useLhConfigContext } from '@lh-ui/vue2'
// 自定义组件内注入：返回 ComputedRef<LhConfigContext> | null
const ctx = useLhConfigContext()
```

::: warning
命令式服务（new Vue 挂载）不继承 provide/inject 上下文，读全局 size/locale 走 lhlocale 单例。
:::
