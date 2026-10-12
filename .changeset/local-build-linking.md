---
'@lh-ui/vue2': patch
---

本地开发联动补齐：构建链不再依赖 npm 发版。

- **新增 `pnpm build:local`**（`scripts/link-local-share.mjs`，与 lh-ui-plus 同源）：家族布局下把
  `node_modules/@lh-ui/share` junction 到同级 share 仓的**已构建产物**（es / lib / styles / dts），
  `vite build`（含 UMD 内联 share）与 `tsc -p tsconfig.build.json` 随之读到兄弟仓刚构建的产物。
  解析路径仍是 bare `@lh-ui/share/**`，`external: /^@lh-ui\/share/` 照常生效——不是别名、不绕过
  external、不需要 share 先发版。两道守卫：兄弟仓不存在跳过；兄弟仓未 `pnpm build`
  （`es/index.js` / `lib/index.js` / `styles/theme/common/var.scss` 缺件）也跳过并提示。
  `node scripts/link-local-share.mjs --restore` 或一次 `pnpm install` 还原回 npm 包。
  **发版链（`pnpm build`）不用它**，仍读 npm 包。
- **为什么需要**：`src/theme.ts` / `src/constants.ts` 用 `export * from '@lh-ui/share/...'`，
  rollup 要解析外部模块的具名导出名；share 未发版时 npm 包的 es/lib 里还没有新导出，
  `pnpm build` 会报 `X is not exported by @lh-ui/share/core/Y`，dts 也缺新类型。
  此前只覆盖了 dev / test / docs / typecheck 四处的源码 alias，构建链是唯一缺口。
- **构建链保持 node_modules 解析**：`scripts/build-styles.mjs` 维持读
  `node_modules/@lh-ui/share`（不读兄弟仓源码路径），由 `build:local` 的 junction 统一覆盖
  es / lib / styles / dts 四类产物——保证「要么全来自兄弟仓、要么全来自 npm 包」的一致性，
  避免样式读本地源码而 JS/d.ts 读 npm 包的错配状态。与 plus AGENTS.md 的既定设计对齐。
