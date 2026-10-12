---
"@lh-ui/vue2": minor
---

跟随 share 仓命名规范收敛，同步本仓全部引用（breaking rename，机械替换）

`@lh-ui/share` 已把非第三方公共符号补齐 `LH` 前缀（见 share 的 `lh-prefix-naming` changeset），
本仓同步消费侧改名，本地联动即时生效：

- `SxProps` → `LhSxProps`（`src/components` 全量组件 Props 声明）
- `DEFAULT_DRAWER_DIRECTION` → `LH_DRAWER_DIRECTION_DEFAULT`、
  `DEFAULT_DRAWER_SIZE` → `LH_DRAWER_SIZE_DEFAULT`（drawer）
- `DEFAULT_DROPDOWN_PLACEMENT` → `LH_DROPDOWN_PLACEMENT_DEFAULT`（dropdown）
- `DEFAULT_POPCONFIRM_TYPE` → `LH_POPCONFIRM_TYPE_DEFAULT`、
  `DEFAULT_POPCONFIRM_PLACEMENT` → `LH_POPCONFIRM_PLACEMENT_DEFAULT`（popconfirm）
- `DEFAULT_POPOVER_PLACEMENT` → `LH_POPOVER_PLACEMENT_DEFAULT`（popover）
- `THEME_PRESETS` → `LH_THEME_PRESETS`、`ThemePresetName` → `LhThemePresetName`
  （`src/composables` 主题切换、`src/theme.ts` 转发注释）

AGENTS.md 的「第三方导出不强制」一条同步更新：share 导出现在已自带 `LH` 前缀，
本仓原样消费。

用户侧迁移：从 `@lh-ui/vue2` 引入的类型名按上表改 import 即可；`zhCN` / `enUS` 不变。
