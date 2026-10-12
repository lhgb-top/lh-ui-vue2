---
layout: LhHome
sidebar: false

hero:
  name: lh-ui-vue2
  text: Enterprise-grade Vue 2.7 component library with an ink-painting aesthetic
  tagline: One core (@lh-ui/share) — each framework is just a UI layer
  image:
    src: /logo.svg
    alt: lh-ui-vue2 logo
    width: 120
    height: 120
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/quickstart
    - theme: alt
      text: Components
      link: /en/components/button
    - theme: alt
      text: Vue3 Version
      link: https://lh-ui-plus.lhgb.top/

features:
  - icon: 🖌️
    title: Ink-painting design system
    details: CSS-variable theming with presets and dark mode. Every token originates from the single source in @lh-ui/share — zero style duplicates inside the library.
    link: /en/guide/theme
    linkText: Learn about theming
  - icon: 🔗
    title: Three connected chains
    details: The theme chain (ConfigProvider), the form chain (validation + aria-invalid interplay), and the overlay chain (Dialog / Tooltip / Select dropdowns share one positioning and z-index engine).
    link: /en/components/config-provider
    linkText: See ConfigProvider
  - icon: 🧩
    title: 58 components, five-part structure
    details: Each component is an SFC plus a composable, types, an installer, and a demo. Pure logic lives in the share core; the Vue2 layer only wires reactivity.
    link: /en/guide/install
    linkText: Installation
  - icon: ⚡
    title: Built for existing Vue 2 projects
    details: Runs on Vue 2.7 (the final release) with &lt;script setup&gt;. The v-model and .sync semantics match what your current Vue 2 project already uses.
    link: /en/guide/quickstart
    linkText: Quick Start
  - icon: ♿
    title: Accessibility first
    details: Every component ships with ARIA attributes and keyboard interaction. Focus management, aria-invalid interplay, and dark-mode contrast follow WCAG.
    link: /en/components/dialog
    linkText: See a11y in practice
  - icon: 🧭
    title: One core, many UI layers
    details: The lh-ui family shares one core and one style source across Vue2 / Vue3 / React, so cross-framework migration costs nearly nothing.
    link: https://lh-ui-plus.lhgb.top/
    linkText: Visit the Vue3 version

footer:
  message: lh-ui family · one core (@lh-ui/share), each framework is just a UI layer
  copyright: Copyright © 2026 lh-ui
---
