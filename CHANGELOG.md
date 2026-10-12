# @lh-ui/vue2

## 1.0.0

### Major Changes

- **首个正式版 1.0.0**（M0b 脚手架 → M2 全量移植完成）：
  - **58 个组件五件套全量交付**：基础 / 布局 / 数据录入 / 数据展示 / 反馈 / 导航六大组，每个组件
    SFC + composable 胶水 + 类型 + 安装器 + 演示，纯逻辑全部下沉 `@lh-ui/share`，本库零 core / 样式 / 文案副本。
  - **响应式适配层**：locale 响应式适配（share emitter → ref）、composables 胶水
    （useLhSize / useLhDisabled / useLhNamespace / useLhVModel（Vue2 语义）/ useLhZIndex /
    useLhBreakpoint / useLhComponentTheme / useLhTheme / useLhPresetTheme）、命令式挂载 mountToBody。
  - **ConfigProvider**：provide/inject 配置上下文 + locale 接线 + themeVars 落 CSS 变量。
  - **三套产物**：ESM（preserveModules，tree-shaking 友好）/ CJS / UMD 单文件（script 标签自足），
    附 tsc 生成的类型声明；CSS 变量主题（明暗模式 + 预设主题）。
- **命名规范整改**：第一方标识符统一带 LH 前缀（家族反域名根 `top.lhgb`）。破坏性重命名（公开导出）：
  `CONFIG_PROVIDER_KEY` → `LH_CONFIG_PROVIDER_KEY`、`DropdownItemRecord` → `LhDropdownItemRecord`、
  `usePresetTheme` → `useLhPresetTheme`；另有若干组件内部重命名（不影响公开 API）。
  包名维持 `@lh-ui/vue2` 不变；`top.lhgb.*` 反域名形态只约束后续新包。

### Minor Changes

- **跟进 share 高度令牌专项（control-height）**：share 新增 `--lh-control-height-{mini,small,medium,large,x-large}`
  并统一全部表单控件高度，本库构建期编译 share 样式进 `dist/`，自动随之更新。视觉破坏性变化（随 share 0.4.0 生效）：
  input 由 padding 派生改为固定高度（mini 28→20、small 32→24、medium 39→32、large 50→40）、
  cascader 42→32、tree-select 44→32、input-number small 30→24、date-picker / time-picker 约 35→32，
  input 单行分支移除 has-label 的 `padding-top: 16px`（textarea 不变）。
  依赖 `@lh-ui/share` `^0.3.0` → `^0.4.0`。
- **Divider 竖向支持文案**：放开横向门控后，竖向分割线传入默认插槽即渲染文案，升级为 `role="separator"`
  并声明 `aria-orientation="vertical"`；竖向文案恒居中，纵向布局由 share 的 scss 承载。
- **docs 站迁移 VuePress 1.x**：VitePress（Vue3 运行时）→ VuePress 1.9 + Vue 2.7 原生，docs 站与库同框架；
  demo 改为注册表活渲染（`<component :is>` 运行时编译），iframe 沙箱整体退役；补齐暗色与首页自定义布局。
  （docs/ 不在 npm 产物内，不影响包体积与运行时。）
- **图标修复**：date-picker / time-picker 触发器图标由 emoji（📅 / 🕐）改为 `<LhIcon name="date">`；
  input 前后缀由无效的字体图标类 `<i :class>` 改为 `<LhIcon :name>`，与 plus 的 `prefix-icon` API 对齐。
- **跟随 share 命名规范收敛**：`SxProps` → `LhSxProps`、`DEFAULT_DRAWER_DIRECTION` → `LH_DRAWER_DIRECTION_DEFAULT`、
  `THEME_PRESETS` → `LH_THEME_PRESETS`、`ThemePresetName` → `LhThemePresetName` 等全量消费侧改名。
  用户侧迁移：从 `@lh-ui/vue2` 引入的类型名按上表改 import 即可；`zhCN` / `enUS` 不变。
- **主题定制台**：docs 站新增与 lh-ui-plus 同源的「主题定制台」页——选预设 → 逐令牌调色 →
  实时预览（含明/暗）→ 导出 scss 一键复制；并补齐带守卫的本地联动 alias（dev / test / docs / typecheck 四处）。
- **三库审计修复批次**：
  - **form**：provide 上下文改 plain getter 对象（provide 不得快照）、`model` 去快照、initialValues 随 rules 增量补拍
  - **collapse**：受控模式补 `watch(modelValue)` 同步
  - **Dialog / Drawer**：关闭链状态守卫、Esc 弹层顺序栈、滚动锁状态跟踪、初始打开补栈登记
  - **slider**：受控值变化回显（拖拽中跳过）；**transfer / tree**：键盘焦点限定本实例子树
  - **breadcrumb / steps**：子项注册改为落 DOM 的 uid，父级按 DOM 位序重排（签名比对防死循环）；
    steps 折行机制同步（`lineLast` 结构性类名 + 四时机测 offsetTop 算行末项）
  - **typecheck**：新增 `gen-dev-tsconfig` 机制，typecheck 映射到兄弟仓源码，与运行时口径一致

### Patch Changes

- **breadcrumb / steps token 类型修正**：`LhBreadcrumbContext` / `LhStepsContext` 的 `itemTokens`
  声明由 `Ref<symbol[]>` 改为 `Ref<string[]>`（纯属类型声明错误，运行时行为不变）。
- **站点域名统一**：docs 站互链与 `package.json` 的 homepage 统一到家族部署域名 `www.lhgb.top/lhui/vue2/`。
- **本地构建联动**：新增 `pnpm build:local`（junction `node_modules/@lh-ui/share` → 同级 share 仓已构建产物），
  构建链不再依赖 share 发版；发版链（`pnpm build`）仍读 npm 包。
- **share 依赖切换为已发布 npm 包**：`dependencies` 从发布前过渡形态 `link:../lh-ui-share` 改为
  `"@lh-ui/share": "^0.2.0"`（现为 `^0.4.0`），克隆本仓即可直接安装开发。
