# AGENTS.md

Project guidance for the **lh-ui-vue2** repository. 总纲见 `lh-ui-plus/ai/多端组件库规划.md`（v2），
Vue2 细节见 `lh-ui-plus/ai/vue2组件库计划.md`。

## What this repository is

`@lh-ui/vue2` —— lh-ui 家族的 **Vue 2.7 UI 层**。设计本意：**一个 core（`@lh-ui/share` 的纯函数），
各框架只是 UI 层**。本库只写响应式胶水、SFC 模板、install 与命令式服务；**不持有任何 core/样式/文案副本**。

- 唯一运行时依赖：`@lh-ui/share`（peer：`vue@^2.7.0`；devDeps 精确 pin `vue@2.7.16`）。
- 明确不支持 Vue 2.6 及以下、不支持 IE11。
- 组件样式唯一源在 `@lh-ui/share/styles/`（过渡类名已双写兼容 Vue2 的 `-enter/-leave`）；
  本库构建期编译进产物，**仓库内出现手写组件样式副本即为违规**（CI grep 门禁）。

## 依赖形态（重要）

`package.json` 当前为发布前形态：`"@lh-ui/share": "link:../lh-ui-share"`（同父目录平级仓库，
pnpm symlink 联调；需先在 lh-ui-share 执行过 `pnpm build` 生成 es/lib/dist 产物）。

**share 正式发布 npm 后的切换清单**：
1. 本文件 dependencies 改为 `"@lh-ui/share": "^0.1.0"`；
2. 删除 pnpm-lock.yaml 中 link 解析并 `pnpm install` 重新生成；
3. CI workflow（.github/workflows/ci.yml）注释同步移除。

禁止把 `file:` 协议写入 package.json 提交（link: 是发布前过渡的唯一例外，有明确切换清单）。

## Layout

- `src/components/<name>/` —— 组件五件套：
    - `src/index.vue` —— Vue2 SFC；**2.7 无 defineOptions**：并列普通 `<script lang="ts">` 块
      `export default { name: 'LhXxx' }`；宏边界案例允许退回 `defineComponent` 写法（两种共存）
    - `src/index.ts` —— `useLhXxx(props, emit)` 胶水 composable + `useLhConfigContext`
    - `src/types.ts` —— Props interface + `LH_XXX_*_CONST`（常量引 `@lh-ui/share/constants`）
    - `src/index.vue.d.ts` —— SFC 类型 shim；`types.ts` re-export、`index.ts` 挂 `.install`
- `src/composables/index.ts` —— useLh* 响应式胶水（纯逻辑全部调 share，本库只接线）
- `src/locale/index.ts` —— LhLocale 响应式适配（share emitter → ref）
- `src/imperative.ts` —— Vue2 命令式挂载（`mountToBody`），弹层组件与服务组件共用
- `src/index.ts` —— 全量入口：install + 注册表 `lhComponents`（registry 测试断言此清单）
- `scripts/` —— build-styles.mjs / verify-dts.mjs；`tests/` —— Vitest + @vue/test-utils v1

## Vue2 红线（完整版见 vue2组件库计划.md §六）

1. **响应式**：defineProperty 系统——动态新增/删除属性必须 `Vue.set/$set` 或整对象替换；
   数组索引赋值不响应；组件胶水禁止「先取对象再加属性」写法。
2. **SFC props 写法（M0b 实测确立）**：2.7 compiler-sfc 的 type-only `defineProps<T>()`
   **不支持跨文件 interface**（仅同文件字面类型，报 "must be a literal type..."）。
   契约类型在 types.ts 的组件一律用**运行时声明 + PropType**（见 config-provider/src/index.vue）。
3. **v-model**：默认 `value` prop + `input` 事件；自定义模型用组件选项
   `model: { prop, event }`；双绑示例一律 `.sync`（即 `update:xxx` 事件约定）。
4. **无 Teleport**：弹层挂 `src/imperative.ts` 的 body 容器，beforeDestroy `$destroy()` 并移除；
   SSR 下容器创建只能在 mounted。
5. **过渡类名**：share 样式源已双写，本库零适配；JS 钩子名两代一致。
6. **provide/inject**：provide 的必须是 computed ref 本身（不能解包/快照），消费方 `.value` 读取。
7. **命令式服务**：`new Vue({ render: h => h(Comp, { props }) }).$mount()`；独立实例树
   **不继承** ConfigProvider 的 provide/inject。
8. **透传**：`v-bind="$attrs" v-on="$listeners"` 才等效 Vue3 的 `v-bind="$attrs"`；
   「根元素非目标元素」的组件逐个显式绑定。
9. **locale 消费**：组件 render 中调 `src/locale` 的 `t()`（内部读 version ref 建立依赖）；
   ConfigProvider watch locale prop → `lhlocale.setLocale`（immediate）。
10. **测试与沙箱禁用模板字符串**：`vue` 入口是 runtime-only（无模板编译器），
   测试组件一律 render 函数；`dev/` 沙箱需把 vue alias 到完整构建（M1 处理）。

## Conventions

- BEM `lh` 命名空间（`lh-button__text--primary` 风格同 plus）；CSS 变量 `--lh-*` 一律来自
  share 的 theme 源，组件不得自行声明。
- `strict: true` 全库生效；emits 用具名签名；禁止 `any` 逃逸（`noImplicitAny`）。
- Prettier：单引号、无分号、2 空格、printWidth 100、singleAttributePerLine（`pnpm format` 只覆盖
  配置文件，`src/` 手工对齐）。
- 注释、文档、提交信息一律中文。

## Commands

| Task | Command |
| --- | --- |
| lint / typecheck | `pnpm lint` / `pnpm typecheck` |
| 全部测试 | `pnpm test`（vitest run） |
| 构建（esm+cjs+umd+styles+dts） | `pnpm build` |
| 样式编译 | `pnpm build:styles` |
| dts + 校验 | `pnpm build:dts` / `pnpm verify:dts` |

## Verification is manual（AI 不自动执行）

单测、构建、typecheck、lint 由**用户**运行；AI 交付后列出命令清单，
未经验证不得标注 ✅（写「已交付（待手动验证）」）。例外：用户在当次请求中明确授权时方可代跑并如实记录。
