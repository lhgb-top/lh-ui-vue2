---
'@lh-ui/vue2': minor
---

# 主题定制台 + 本地联动 alias + docs 修复

## docs 站（用户可见）

- **新增「主题定制台」页**（中英双语，`guide/theme-studio`）：与 lh-ui-plus 同源的
  `ThemeStudio.vue` 组件（逐字节同步副本），选预设 → 逐令牌调色 → 实时预览（含明/暗）
  → 导出 scss 一键复制。复用 share 的 `THEME_PRESETS` / `getThemeVars` /
  `buildPresetStyleText` 原语。
  （与 plus 同源修复控制台告警：颜色输入框不再把空串 / `color-mix(...)` 计算值
  写进 `<input type="color">`。）
- **修复中文指南侧边栏链接 404**：`buildSidebar('')` 的空 prefix 使链接指向
  `/install` 而文件实际在 `/guide/install`，改为 `/guide`；`theme-studio` 入侧边栏。

## 开发体验（不发版，docs/scripts 均不在 files 内）

- **带守卫的本地联动 alias**：`dev/vite.config.ts` / `docs/.vuepress/config.ts` /
  `vitest.config.ts` 在家族布局下把 `@lh-ui/share/**` 解析到同级 share 仓源码（改 share scss 即时生效）；
  兄弟仓不存在时守卫返回空、回退 npm 包。`dev/` 配置另补 sass `loadPaths`。
  （修复两处：① styles alias 与 plus 同源的 `Failed to resolve` 问题，按 share exports 语义
  拆成三条有序规则；② docs config 传给守卫的 repoRoot 多退了一级（`../../..`），守卫静默失败、
  本地联动从没在 docs 生效过，改为 `../..`。另补 vitest 接入——此前测试跑的是 npm 已编译产物，
  与 plus 不一致。）
  docs 另补 sass `api: 'modern'` + `loadPaths`，消除 Dart Sass `[legacy-js-api]` 弃用警告。
- **dev / docs 切换到 SCSS 源码**：`dev/main.ts` 与 `dev/demo-main.ts` 从预制 CSS
  （`@lh-ui/share/theme.css` + `styles.css`）改为 `@lh-ui/share/styles/theme/index.scss` +
  `@lh-ui/share/styles/index.scss`，与 plus 对齐。
- **`verify:docs-sync`**（`scripts/verify-docs-sync.mjs`）：校验与 lh-ui-plus 共享的
  docs 组件逐字节一致 + 展示围栏 import 只用 npm 包名（`@lh-ui/vue2` / `@lh-ui/share`）。
- AGENTS.md 补共享组件同步约定与 Commands 表入口。

## 依赖

- `@lh-ui/share` 随本次家族批次升级：share 先发 0.4.0，本仓随后
  `pnpm up @lh-ui/share@^0.4.0` 回归（`verify:versions` 会校验范围覆盖）。
