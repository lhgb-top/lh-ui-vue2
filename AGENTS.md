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

- `src/components/<name>/` —— 组件目录，两层结构：
    - `<name>/index.ts` —— 对外入口：`withInstall('LhXxx', Sfc)` 包装 + re-export composable/types
      （老组件可能在别处挂 `.install`，新组件一律走 `src/install.ts` 的 `withInstall`）
    - `<name>/src/` —— 五件套：
        - `index.vue` —— Vue2 SFC；**2.7 无 defineOptions**：并列普通 `<script lang="ts">` 块
          `export default { name: 'LhXxx' }`；宏边界案例允许退回 `defineComponent` 写法（两种共存）
        - `index.ts` —— `useLhXxx(props, emit)` 胶水 composable + `useLhConfigContext`
        - `types.ts` —— Props interface + `LH_XXX_*_CONST`（常量引 `@lh-ui/share/constants`）
        - `index.vue.d.ts` —— SFC 类型 shim（模板编译产物 tsc 推导不出，显式声明 Props 形状）
- `src/install.ts` —— `withInstall(name, sfc)`：组件 `.name` / `.install` / registry 清单三者必须一致
- `src/composables/index.ts` —— useLh* 响应式胶水（纯逻辑全部调 share，本库只接线）
- `src/locale/index.ts` —— LhLocale 响应式适配（share emitter → ref）
- `src/imperative.ts` —— Vue2 命令式挂载（`mountToBody`），弹层组件与服务组件共用
- `src/index.ts` —— 全量入口：install + 注册表 `lhComponents`（**新增组件必须登记**，见下方警告）
- `dev/` —— 沙箱（多页 html，见下节）；`docs/` —— VitePress 文档站（独立 workspace）
- `scripts/` —— build-styles.mjs / copy-demo.mjs / verify-dts.mjs；
  `tests/` —— Vitest + @vue/test-utils v1（`tests/components/*.spec.ts` 组件、`tests/unit/*.spec.ts` 基建）

### ⚠ 进行中：未登记的组件

`src/components/` 下 alert / avatar / badge / card / divider / empty / progress / skeleton /
space / spinner 已有 `index.ts` + `src/` 五件套 + 对应单测，但**尚未登记进 `src/index.ts` 的
`lhComponents`**。`tests/unit/registry.spec.ts` 会反向扫描每个含 `index.ts` 的组件目录并断言已注册，
故当前 `pnpm test` 的 registry 用例**必然失败**——这是 M2 收尾的已知待办，不是你改坏了。
接手新组件时：五件套 → `tests/components/<name>.spec.ts` → 登记 `src/index.ts`（导出 + `lhComponents`
两条都要加，顺序按目录分组）→ 补 `dev/demos/index.ts` 与 `docs/components/<name>.md`。

## dev 沙箱与 docs 站（M1 落成）

- **dev 沙箱**：`pnpm dev`（端口 5174），多页形态——`dev/<name>.html` 平铺在 `dev/` 根，
  页面通过 `data-demo` 键引用 `dev/demos/index.ts` 的 `DEMOS` 注册表（选项式 + template 字符串）。
  **新增 demo 必须在 `DEMOS` 注册表登记 key**，否则页面取不到 demo。
  vite config 把 `vue` alias 到 `vue/dist/vue.esm.js` 完整构建，沙箱里才可用模板字符串（红线 #10）。
- **docs 站**：`docs/` 是**独立 pnpm workspace**（自带 `package.json` / `pnpm-lock.yaml` /
  `node_modules`，VitePress + Vue3 运行时——站点本身是 Vue3，与库的 Vue2 无关，别被误导）。
  日常用根目录的 `pnpm docs:dev` / `pnpm docs:build`（内部 `pnpm --dir docs`）。
  组件页 demo 采用 **iframe 方案**：`pnpm build:demo` 构建 dev 沙箱 → `scripts/copy-demo.mjs`
  把 `dev-dist/*.html` 平铺重写资源路径后拷入 `docs/public/demos`，`docs/.vitepress/components/DemoBlock.vue`
  按 name 引用。改 demo → 跑 `build:demo`（含 copy）→ docs 才更新。

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
10. **测试与沙箱禁用模板字符串**：`vue` 入口是 runtime-only（无模板编译器），测试组件一律
    render 函数（`tests/` 里写 template 字符串会运行时报错）；沙箱与文档 demo 另走
    `vue/dist/vue.esm.js` 完整构建（dev/vite.config.ts 已 alias，docs iframe demo 同源）。
    测试挂载统一用 `tests/helpers.ts` 的 `mountComp`——defineComponent 返回的 Vue3 风格类型与
    VTU v1 的 `mount(VueConstructor)` 签名有纯类型摩擦，helper 收窄后 SFC 与选项式都能挂。

## Conventions

- BEM `lh` 命名空间（`lh-button__text--primary` 风格同 plus）；CSS 变量 `--lh-*` 一律来自
  share 的 theme 源，组件不得自行声明。
- `strict: true` 全库生效；emits 用具名签名；禁止 `any` 逃逸（`noImplicitAny`）。
- **ESLint 必须用 `flat/vue2-recommended`**（plus 用的是 Vue3 的 `flat/recommended`，直接抄会报错）。
- Prettier：单引号、无分号、2 空格、printWidth 100、singleAttributePerLine（`pnpm format` 只覆盖
  配置文件，`src/` 手工对齐）。
- 注释、文档、提交信息一律中文。

## Commands

| Task | Command |
| --- | --- |
| lint / 自动修复 | `pnpm lint` / `pnpm lint:fix` |
| typecheck | `pnpm typecheck`（tsc --noEmit） |
| 全部测试 / 监听 | `pnpm test` / `pnpm test:watch` |
| 单个组件测试 | `pnpm vitest run tests/components/avatar.spec.ts` |
| 构建（esm+cjs+umd+styles+dts） | `pnpm build` |
| 样式编译 | `pnpm build:styles` |
| dts + 校验 | `pnpm build:dts` / `pnpm verify:dts` |
| dev 沙箱（端口 5174） | `pnpm dev` |
| demo 构建 + 归位 docs | `pnpm build:demo`（vite build → copy-demo.mjs） |
| 文档站 dev / build / preview | `pnpm docs:dev` / `pnpm docs:build` / `pnpm docs:preview` |
| changeset | `pnpm changeset` / `pnpm changeset:status` |

## Verification is manual（AI 不自动执行）

单测、构建、typecheck、lint 由**用户**运行；AI 交付后列出命令清单，
未经验证不得标注 ✅（写「已交付（待手动验证）」）。例外：用户在当次请求中明确授权时方可代跑并如实记录。
