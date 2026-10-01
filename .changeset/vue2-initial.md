---
'@lh-ui/vue2': minor
---

首次交付（M0b 脚手架 + 地基组件）：Vue 2.7 组件库骨架——唯一运行时依赖 `@lh-ui/share`；locale 响应式适配层（share emitter → ref）；composables 响应式胶水（useLhSize / useLhDisabled / useLhNamespace / useLhVModel（Vue2 语义）/ useLhZIndex / useLhBreakpoint / useLhComponentTheme / useLhTheme / usePresetTheme）；命令式挂载工具 mountToBody；ConfigProvider 组件（provide/inject 配置上下文 + locale 接线 + themeVars 落 CSS 变量）。
