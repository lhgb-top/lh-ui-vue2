# Quick Start

## Full import

```ts
import Vue from 'vue'
import LhUIVue2 from '@lh-ui/vue2'
import '@lh-ui/vue2/theme.css'

Vue.use(LhUIVue2)
```

## On-demand import (recommended, better for tree-shaking)

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

## Global config (optional)

Wrap your application root with `LhConfigProvider` to configure size, locale, and theme variables in one place:

```vue
<template>
  <LhConfigProvider size="medium" locale="zh-CN" :theme-vars="{ 'primary-color': '#2B4C7C' }">
    <router-view />
  </LhConfigProvider>
</template>
```

## v-model and .sync

Vue 2 semantics and this library's conventions:

- Two-way binding on form controls: `<LhInput v-model="text" />` (internally `model: { prop: 'modelValue', event: 'input' }`)
- Dialog visibility: `<LhDialog :visible.sync="show" />` (`.sync` is the `update:xxx` event convention; Dialog also supports `v-model`)

## Imperative API

```ts
import { t, setLocale } from '@lh-ui/vue2'
setLocale('en-US')
t('input.placeholder') // 'Please input'
```

::: warning
Vue 2.7 environment notes and the full list of constraints (reactivity of dynamically added properties, the Teleport-free overlay approach, and so on) are documented in the repository's `AGENTS.md`.
:::
