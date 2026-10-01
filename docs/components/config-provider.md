# ConfigProvider 全局配置

为子树提供全局尺寸、语言与主题变量。provide 的是 **computed 引用**（非快照），provider 的 prop 变化会实时传导给所有消费组件。

<DemoBlock name="config-provider" title="局部主题定制" :height="240">

```vue
<template>
  <LhConfigProvider
    size="medium"
    locale="zh-CN"
    :theme-vars="{ 'primary-color': '#4A6741', 'bg-color': '#F4F7EE' }"
  >
    <LhButton type="primary">竹青按钮</LhButton>
  </LhConfigProvider>
</template>
```

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
