---
'@lh-ui/vue2': major
---

命名规范整改：第一方标识符统一带 LH 前缀（家族反域名根 `top.lhgb`）。

- **破坏性重命名（公开导出）**：
  - `CONFIG_PROVIDER_KEY` → `LH_CONFIG_PROVIDER_KEY`
  - `DropdownItemRecord` → `LhDropdownItemRecord`
  - `usePresetTheme` → `useLhPresetTheme`
- **组件内部重命名（不影响公开 API）**：`SwitchEmit` → `LhSwitchEmit`、
  `TagEmit` → `LhTagEmit`、`PanelView` → `LhPanelView`、`LoadingElement` → `LhLoadingElement`、
  `LoadingBinding` → `LhLoadingBinding`、`ActiveLoading` → `LhActiveLoading`、
  `MountedHost` → `LhMountedHost`、`SelectingColumn` → `LhSelectingColumn`、
  `LEAVE_DURATION` → `LH_LEAVE_DURATION`。
- 包名维持 `@lh-ui/vue2` 不变；`top.lhgb.*` 反域名形态只约束后续新包（已写入 AGENTS.md 命名规范小节）。
