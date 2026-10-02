# @lh-ui/vue2

**lh-ui 家族的 Vue 2.7 UI 层 —— 企业级国风水墨组件库。一个框架无关的 core，每个框架一个 UI 层。**

简体中文 | [English](./README.en-US.md)

---

## 这是什么

`@lh-ui/vue2` 是 [lh-ui](../README.zh-CN.md) 多端组件库家族的 **Vue 2.7** UI 层。家族的设计本意是
**一个 core，各框架只是 UI 层**：组件逻辑（状态机、校验、popper 计算、focus trap、i18n 等）只写一份，
作为纯函数存在于 [`@lh-ui/share`](../lh-ui-share)；本库只写响应式胶水、SFC 模板、install 与命令式服务，
**不持有任何 core / 样式 / 文案副本**。

- 唯一运行时依赖：`@lh-ui/share`；peer：`vue@^2.7.0`
- 明确不支持 Vue 2.6 及以下、不支持 IE11
- 姐妹库：[`lh-ui-plus`](../lh-ui-plus)（Vue 3 旗舰版）

## 特性

- **一个 core，多端复用** —— 行为在 `@lh-ui/share` 里写一次、测一次，UI 层直接消费。
- **国风 / 水墨设计语言** —— 以 CSS 变量主题系统表达的东方水墨美学。
- **CSS 变量主题定制** —— 每个令牌都是 `--lh-*` 变量，可全局覆盖、按 `ConfigProvider` 覆盖，
  或通过组件的 `themeVars` prop 覆盖；内置明暗模式与多套预设主题。
- **国际化（i18n）** —— 语言包随 `@lh-ui/share` 发布，内置 `zh-CN` 与 `en-US`。
- **Tree-shaking 友好** —— ESM / CJS / UMD 产物，支持按组件按需引入与 `.install()`。
- **TypeScript 优先** —— 全库 `strict: true`，产物附生成的类型声明。

## 安装

> `@lh-ui/vue2` 尚未发布到 npm。开发期通过本地 `link:../lh-ui-share` 工作区依赖消费 `@lh-ui/share`，
> 需先把 share 构建出来：

```bash
cd lh-ui-share && pnpm install && pnpm build
cd ../lh-ui-vue2 && pnpm install
```

## 快速上手

### 全量引入

```ts
import Vue from 'vue'
import LhUIVue2 from '@lh-ui/vue2'
import '@lh-ui/vue2/theme.css'

Vue.use(LhUIVue2)
```

### 按需引入（推荐，利于 tree-shaking）

```ts
import Vue from 'vue'
import { LhButton, LhInput } from '@lh-ui/vue2'
import '@lh-ui/vue2/theme.css'
// 每组件样式单独引入
import '@lh-ui/vue2/style/button'
import '@lh-ui/vue2/style/input'

Vue.use(LhButton)
Vue.use(LhInput)
```

### 全局配置（可选）

用 `LhConfigProvider` 包裹应用根，统一配置尺寸、语言与主题变量：

```vue
<template>
  <LhConfigProvider size="medium" locale="zh-CN" :theme-vars="{ 'primary-color': '#2B4C7C' }">
    <router-view />
  </LhConfigProvider>
</template>
```

## 主题

- 令牌命名统一为 `--lh-*`，唯一源在 `@lh-ui/share/styles/theme/`，组件不得自行声明。
- **暗色模式**：引入 `@lh-ui/vue2/theme-dark.css` 并设 `<html data-theme="dark">`（亦支持 `.dark` class）。
- **预设主题**：`usePresetTheme`（青花瓷、松花绿等），`useLhTheme` 负责明暗切换并 localStorage 持久化。
- **局部覆盖优先级**：组件 `themeVars` prop > `ConfigProvider.componentTheme[name]` > 全局 `themeVars`。

## 组件

| 分类 | 组件 |
| --- | --- |
| 基础 | ConfigProvider、Button、Icon |
| 数据录入 | Input、Select、Checkbox、CheckboxGroup、Radio、RadioGroup、Switch |
| 反馈与展示 | Dialog、Tooltip、Tag、Form、FormItem |

开发中（目录与单测已就绪，尚未登记全量入口）：Alert、Avatar、Badge、Card、Divider、Empty、
Progress、Skeleton、Space、Spinner。

## 开发

| 任务 | 命令 |
| --- | --- |
| 开发沙箱（端口 5174） | `pnpm dev` |
| 文档站点 | `pnpm docs:dev` |
| 单测 / 监听 | `pnpm test` / `pnpm test:watch` |
| Lint / 自动修复 | `pnpm lint` / `pnpm lint:fix` |
| 类型检查 | `pnpm typecheck` |
| 构建（esm + cjs + umd + styles + dts） | `pnpm build` |
| demo 构建并归位文档站 | `pnpm build:demo` |
| 发版说明 | `pnpm changeset` |

文档站点基于 VitePress，组件示例采用 iframe 沙箱方案（Vue2 组件无法在 Vue3 的 VitePress 内直接渲染），
改 demo 后需重跑 `pnpm build:demo`。

## 约定与规范

- 统一使用 pnpm；注释、文档、提交信息一律中文。
- 类名遵循 BEM `lh-*`；CSS 变量一律来自 share 的 theme 源。
- 每次改动附 `.changeset/*.md` 发版说明；**发版顺序硬约束：`@lh-ui/share` 先发版**。
- 动手前请先阅读 [AGENTS.md](./AGENTS.md) —— 含 Vue2 红线（响应式、无 Teleport 的弹层方案、
  过渡类名双写、透传写法等）与完整目录说明。

## 文档

- 在线文档：<https://lh-ui.lhgb.top/vue2/>
- 家族总纲：[`lh-ui-plus/ai/多端组件库规划.md`](../lh-ui-plus/ai/多端组件库规划.md)
- Vue2 细节：[`lh-ui-plus/ai/vue2组件库计划.md`](../lh-ui-plus/ai/vue2组件库计划.md)
