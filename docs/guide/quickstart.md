# 快速上手

## 全量引入

```ts
import Vue from 'vue'
import LhUIVue2 from '@lh-ui/vue2'
import '@lh-ui/vue2/theme.css'

Vue.use(LhUIVue2)
```

## 按需引入（推荐，利于 tree-shaking）

```ts
import Vue from 'vue'
import { LhButton, LhInput } from '@lh-ui/vue2'
import '@lh-ui/vue2/theme.css'
// 每组件样式单独引入（无副作用负担，见各组件文档顶部说明）
import '@lh-ui/vue2/style/button'
import '@lh-ui/vue2/style/input'

Vue.use(LhButton)
Vue.use(LhInput)
```

## 全局配置（可选）

用 `LhConfigProvider` 包裹应用根，统一配置尺寸、语言与主题变量：

```vue
<template>
  <LhConfigProvider size="medium" locale="zh-CN" :theme-vars="{ 'primary-color': '#2B4C7C' }">
    <router-view />
  </LhConfigProvider>
</template>
```

## v-model 与 .sync

Vue2 语义与本库约定：

- 表单控件双向绑定：`<LhInput v-model="text" />`（内部 `model: { prop: 'modelValue', event: 'input' }`）
- 对话框显隐：`<LhDialog :visible.sync="show" />`（`.sync` 即 `update:xxx` 事件约定，Dialog 亦支持 `v-model`）

## 命令式 API

```ts
import { t, setLocale } from '@lh-ui/vue2'
setLocale('en-US')
t('input.placeholder') // 'Please input'
```

::: warning
Vue 2.7 环境注意事项与完整红线（动态属性响应式、无 Teleport 的弹层方案等）见仓库 `AGENTS.md`。
:::
