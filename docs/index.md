---
layout: LhHome
sidebar: false

hero:
  name: lh-ui-vue2
  text: 企业级 Vue 2.7 国风组件库
  tagline: 以国风之美，筑代码之基 —— 一个 core（@lh-ui/share），各框架只是 UI 层
  image:
    src: /logo.svg
    alt: lh-ui-vue2 标识
    width: 120
    height: 120
  actions:
    - theme: brand
      text: 快速上手
      link: /guide/quickstart
    - theme: alt
      text: 组件一览
      link: /components/button
    - theme: alt
      text: Vue3 版
      link: https://lh-ui-plus.lhgb.top/

features:
  - icon: 🖌️
    title: 水墨国风设计
    details: CSS 变量主题系统 + 预设主题 + 暗色模式，全部令牌来自 @lh-ui/share 唯一源，组件库内零样式副本。
    link: /guide/theme
    linkText: 了解主题系统
  - icon: 🔗
    title: 三链贯通
    details: 主题链（ConfigProvider）、表单链（校验 + aria-invalid 联动）、弹层链（Dialog / Tooltip / Select 下拉共享定位与 z-index 引擎）。
    link: /components/config-provider
    linkText: 查看 ConfigProvider
  - icon: 🧩
    title: 58 个组件，五件套结构
    details: 每个组件 = SFC + composable 胶水 + 类型 + 安装器 + 演示，纯逻辑全部沉淀在 share 的 core，Vue2 只写响应式接线。
    link: /guide/install
    linkText: 安装与引入
  - icon: ⚡
    title: 面向存量 Vue2 项目
    details: 基于 Vue 2.7（终点版本）与 &lt;script setup&gt;，v-model 与 .sync 语义与你现有的 Vue2 项目习惯完全一致。
    link: /guide/quickstart
    linkText: 快速上手
  - icon: ♿
    title: 无障碍优先
    details: 全量组件携带 ARIA 属性与键盘交互，焦点管理、aria-invalid 联动、暗色对比度均按 WCAG 对照实现。
    link: /components/dialog
    linkText: 查看无障碍实践
  - icon: 🧭
    title: 一个 core，多端 UI 层
    details: lh-ui 家族共享同一套 core 纯函数与样式源，Vue2 / Vue3 / React 各端表现一致，迁移成本趋近于零。
    link: https://lh-ui-plus.lhgb.top/
    linkText: 访问 Vue3 版

footer:
  message: lh-ui 家族 · 一个 core（@lh-ui/share），各框架只是 UI 层
  copyright: Copyright © 2026 lh-ui
---
