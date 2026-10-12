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

```bash
npm install @lh-ui/vue2
# 或
pnpm add @lh-ui/vue2
# 或
yarn add @lh-ui/vue2
```

`@lh-ui/vue2` 的唯一运行时依赖是 `@lh-ui/share`（共享层：core 纯函数 / theme / constants / locales / types / 组件样式源），会自动一并安装。

### 私有服务器安装

若包托管在私有服务器而非公共 registry，按以下方式安装。

**方式一：tarball 直链**（服务器仅提供静态文件托管即可）

```bash
npm install https://你的域名/pkg/lh-ui-vue2-1.0.0.tgz
# 或
pnpm add https://你的域名/pkg/lh-ui-vue2-1.0.0.tgz
# 或
yarn add https://你的域名/pkg/lh-ui-vue2-1.0.0.tgz
```

> tarball 直链方式下，`@lh-ui/share` 仍会从当前 registry 解析，需保证该包在公共 registry 或你的私有 registry 上可见。

**方式二：自建 registry**（如 Verdaccio，支持 semver 拉取与版本管理）

在项目根目录的 `.npmrc` 中按 scope 精准路由，不影响其他包的安装源：

```ini
@lh-ui:registry=https://你的域名/
```

随后照常安装：

```bash
pnpm add @lh-ui/vue2
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

## 事件名约定（重要）

本库组件事件名为 **camelCase**（如 `@sort-change` 不可用，应写 `@sortChange`、`@rowClick`、`@update:expandedKeys`）：

- **SFC 模板 / JSX / render 函数**中正常工作（推荐用法）；
- **in-DOM 模板**（直接写在 HTML 里的模板）会被浏览器转小写导致事件失联——请避免 in-DOM 模板，或用 `.sync` / `v-on` 对象语法（`v-on` 对象的键不受浏览器小写化影响）；
- 双向绑定统一走 `.sync`（编译器会自动 camel 化 `update:xxx`），不受此限制。

## 组件

58 个组件，六大组（与文档站导航一致，完整清单见[在线文档](https://lh-ui.lhgb.top/vue2/)）：

| 分类 | 组件 |
| --- | --- |
| 基础 | ConfigProvider、Button、Icon、Tag、Divider、Space、Card |
| 布局 | Grid（Row/Col）、Layout、Collapse、Descriptions |
| 数据录入 | Input、InputNumber、Select、Checkbox、CheckboxGroup、Radio、RadioGroup、Switch、Slider、Rate、Segmented、Form、FormItem、Upload、Transfer、TimePicker、DatePicker、Cascader、AutoComplete |
| 数据展示 | Badge、Avatar、Spin、Table、Tag、Skeleton、Empty、Statistic、Timeline、Image、Carousel、Collapse、Descriptions、Tree、TreeSelect |
| 反馈 | Alert、Progress、Message、Notification、Loading、Dialog、Drawer、Tooltip、Popover、Popconfirm、Image |
| 导航 | Breadcrumb、Pagination、Tabs、Steps、Dropdown、Menu、Anchor、Backtop、Affix |

## 开发

| 任务 | 命令 |
| --- | --- |
| 开发沙箱（端口 5174） | `pnpm dev` |
| 文档站点 | `pnpm docs:dev` |
| 单测 / 监听 | `pnpm test` / `pnpm test:watch` |
| Lint / 自动修复 | `pnpm lint` / `pnpm lint:fix` |
| 类型检查 | `pnpm typecheck` |
| 构建（esm + cjs + umd + styles + dts） | `pnpm build` |
| 发版说明 | `pnpm changeset` |

文档站点基于 VuePress 1.x（Vue 2.7 原生），组件示例由 DemoBlock 直接活渲染
`dev/demos/index.ts` 注册表（与 dev 沙箱同源），docs:dev 下改 demo 即时热更新。

## 发布

发布侧统一用 `npm publish`（pnpm 无 publish 命令，yarn v2+ 已移除）；包管理器差异只在消费侧安装。
**发版顺序硬约束：`@lh-ui/share` 先发版**（`dependencies` 语义版本已发布才可发）。

```bash
# 0. 一次性：登录 npm，并拥有 @lh-ui scope（在 npm 创建 organization 或个人 scope）
npm login

# 1. 先发 share（硬约束）
cd ../lh-ui-share
pnpm build && pnpm verify:dts && pnpm verify:styles
npm publish --access public            # 发布 @lh-ui/share@0.1.0

# 2. 再发 vue2
cd ../lh-ui-vue2
pnpm install                           # 重新解析 @lh-ui/share ^0.1.0，生成新 pnpm-lock.yaml
pnpm changeset version                 # 消费 changeset → 打版本号 + 生成 CHANGELOG.md
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm verify:dts   # 完整回归
npm pack --dry-run                     # 检查 files 白名单
npm publish --access public            # 触发 prepublishOnly（build + verify:dts）
```

> **版本协调陷阱**：share 仓库可能还有未消费的 changeset。**发版前不要在 share 仓库跑
> `pnpm changeset version`**——那会把 share bump 到 0.2.0，而本库依赖锁死在 `^0.1.0`
> （semver `^0.1.0` = `>=0.1.0 <0.2.0`，major 为 0 时 caret 锁死 minor），会匹配不到。
> 正确做法：share 直接发当前已 versioned 的 0.1.0；待那批 changeset 消费出 0.2.0 时，
> 本库同步把依赖改为 `^0.2.0` + 回归 + 再发版。

发布私有服务器（如 Verdaccio）时加 `--registry` 指向私有源，或先把 `npm pack` 产出的
`lh-ui-vue2-x.y.z.tgz` 上传到服务器静态目录后按上文「私有服务器安装」使用。

## 约定与规范

- 统一使用 pnpm；注释、文档、提交信息一律中文。
- 类名遵循 BEM `lh-*`；CSS 变量一律来自 share 的 theme 源。
- 每次改动附 `.changeset/*.md` 发版说明；**发版顺序硬约束：`@lh-ui/share` 先发版**。
- 动手前请先阅读 [AGENTS.md](./AGENTS.md) —— 含 Vue2 红线（响应式、无 Teleport 的弹层方案、
  过渡类名双写、透传写法等）与完整目录说明。

## 文档

- 在线文档：<https://lh-ui.lhgb.top/vue2/>
- 家族总纲：[`docs/多端组件库规划.md`](../docs/多端组件库规划.md)
- Vue2 细节：[`docs/vue2/vue2组件库计划.md`](../docs/vue2/vue2组件库计划.md)
