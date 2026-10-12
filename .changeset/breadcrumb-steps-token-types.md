---
'@lh-ui/vue2': patch
---

# 修复 breadcrumb / steps 父子上下文的 token 类型

- `LhBreadcrumbContext` / `LhStepsContext` 的 `itemTokens` 声明为 `Ref<symbol[]>`，
  但实现是 `ref<string[]>([])`、`generateId()` 返回 `string`，且 token 会写入 DOM
  `data-*` 属性——类型应为 `Ref<string[]>`。修正后 `pnpm typecheck` 的 breadcrumb /
  steps 报错消除（纯属类型声明错误，运行时行为不变）。
