---
'@lh-ui/vue2': major
---

首个正式版 1.0.0（M0b 脚手架 → M2 全量移植完成）。

- **58 个组件五件套全量交付**：基础 / 布局 / 数据录入 / 数据展示 / 反馈 / 导航六大组，每个组件
  SFC + composable 胶水 + 类型 + 安装器 + 演示，纯逻辑全部下沉 `@lh-ui/share`，本库零 core / 样式 / 文案副本。
- **响应式适配层**：locale 响应式适配（share emitter → ref）、composables 胶水
  （useLhSize / useLhDisabled / useLhNamespace / useLhVModel（Vue2 语义）/ useLhZIndex /
  useLhBreakpoint / useLhComponentTheme / useLhTheme / useLhPresetTheme）、命令式挂载 mountToBody。
- **ConfigProvider**：provide/inject 配置上下文 + locale 接线 + themeVars 落 CSS 变量。
- **三套产物**：ESM（preserveModules，tree-shaking 友好）/ CJS / UMD 单文件（script 标签自足），
  附 tsc 生成的类型声明；CSS 变量主题（明暗模式 + 预设主题）。
- **文档站**：VitePress 中英双语，组件示例采用 iframe 沙箱方案（Vue2 组件无法在 Vue3 的 VitePress 内直接渲染）。
