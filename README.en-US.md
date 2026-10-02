# @lh-ui/vue2

**The Vue 2.7 UI layer of the lh-ui family — an enterprise-grade component library with a Chinese
"国风 / 水墨" visual language. One framework-agnostic core, one UI layer per framework.**

[简体中文](./README.md) | English

---

## What is this

`@lh-ui/vue2` is the **Vue 2.7** UI layer of the [lh-ui](../README.md) multi-end component library
family. The family is built on a single principle — **one core, with each framework being a thin UI
layer**. Component logic (state machines, validation, popper math, focus trap, i18n, …) is written
**once**, as framework-agnostic pure functions in [`@lh-ui/share`](../lh-ui-share). This library only
provides reactive glue, SFC templates, `install`, and imperative services — it holds **no copy of any
core logic, styles, or locale messages**.

- Sole runtime dependency: `@lh-ui/share`; peer: `vue@^2.7.0`
- Vue 2.6 and below, and IE11, are explicitly **not** supported
- Sister library: [`lh-ui-plus`](../lh-ui-plus) (the Vue 3 flagship)

## Features

- **One core, many frameworks** — behavior is written and tested once in `@lh-ui/share`, consumed by
  every UI layer.
- **国风 / 水墨 design language** — a Chinese-ink aesthetic expressed through a CSS-variable theme
  system.
- **Theme customization via CSS variables** — every token is a `--lh-*` variable; override it
  globally, per `ConfigProvider`, or per component via the `themeVars` prop. Light/dark mode and
  multiple presets are built in.
- **Internationalization (i18n)** — locale messages ship with `@lh-ui/share`, `zh-CN` and `en-US`
  built in.
- **Tree-shaking friendly** — ESM / CJS / UMD builds, per-component on-demand imports and
  `.install()`.
- **TypeScript-first** — `strict: true` throughout, with generated declaration bundles.

## Installation

> `@lh-ui/vue2` is not yet published to npm. During development it consumes `@lh-ui/share` through a
> local `link:../lh-ui-share` workspace dependency, so build `@lh-ui/share` first:

```bash
cd lh-ui-share && pnpm install && pnpm build
cd ../lh-ui-vue2 && pnpm install
```

## Quick start

### Full import

```ts
import Vue from 'vue'
import LhUIVue2 from '@lh-ui/vue2'
import '@lh-ui/vue2/theme.css'

Vue.use(LhUIVue2)
```

### On-demand import (recommended for tree-shaking)

```ts
import Vue from 'vue'
import { LhButton, LhInput } from '@lh-ui/vue2'
import '@lh-ui/vue2/theme.css'
// Import each component's styles separately
import '@lh-ui/vue2/style/button'
import '@lh-ui/vue2/style/input'

Vue.use(LhButton)
Vue.use(LhInput)
```

### Global config (optional)

Wrap the app root with `LhConfigProvider` to configure size, locale, and theme variables in one
place:

```vue
<template>
  <LhConfigProvider size="medium" locale="zh-CN" :theme-vars="{ 'primary-color': '#2B4C7C' }">
    <router-view />
  </LhConfigProvider>
</template>
```

## Theming

- Tokens are named `--lh-*`; the single source of truth is `@lh-ui/share/styles/theme/`, and
  components never re-declare them.
- **Dark mode**: import `@lh-ui/vue2/theme-dark.css` and set `<html data-theme="dark">` (a `.dark`
  class works too).
- **Presets**: `usePresetTheme` (青花瓷, 松花绿, …); `useLhTheme` toggles light/dark and persists to
  localStorage.
- **Override priority**: a component's `themeVars` prop > `ConfigProvider.componentTheme[name]` >
  global `themeVars`.

## Components

| Category | Components |
| --- | --- |
| Basic | ConfigProvider, Button, Icon |
| Data entry | Input, Select, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch |
| Feedback & display | Dialog, Tooltip, Tag, Form, FormItem |

In progress (directories and unit tests exist, not yet registered in the full entry): Alert, Avatar,
Badge, Card, Divider, Empty, Progress, Skeleton, Space, Spinner.

## Development

| Task | Command |
| --- | --- |
| Dev playground (port 5174) | `pnpm dev` |
| Docs site | `pnpm docs:dev` |
| Tests / watch | `pnpm test` / `pnpm test:watch` |
| Lint / autofix | `pnpm lint` / `pnpm lint:fix` |
| Typecheck | `pnpm typecheck` |
| Build (esm + cjs + umd + styles + dts) | `pnpm build` |
| Build demos into the docs site | `pnpm build:demo` |
| Changeset | `pnpm changeset` |

The docs site is built with VitePress and renders component examples in an iframe sandbox (Vue 2
components cannot render directly inside VitePress, which runs on Vue 3). After changing a demo, run
`pnpm build:demo` again.

## Conventions

- Use pnpm; comments, docs, and commit messages are in Chinese.
- Class names follow BEM `lh-*`; every CSS variable comes from share's theme source.
- Attach a `.changeset/*.md` note to every change. **Release order is fixed: `@lh-ui/share`
  publishes first.**
- Read [AGENTS.md](./AGENTS.md) before contributing — it covers the Vue 2 red lines (reactivity,
  the no-Teleport overlay strategy, dual-written transition classes, fallthrough attributes, …) and
  the full directory layout.

## Documentation

- Docs site: <https://lh-ui.lhgb.top/vue2/>
- Family roadmap: [`lh-ui-plus/ai/多端组件库规划.md`](../lh-ui-plus/ai/多端组件库规划.md)
- Vue 2 details: [`lh-ui-plus/ai/vue2组件库计划.md`](../lh-ui-plus/ai/vue2组件库计划.md)
