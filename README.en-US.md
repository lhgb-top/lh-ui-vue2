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

```bash
npm install @lh-ui/vue2
# or
pnpm add @lh-ui/vue2
# or
yarn add @lh-ui/vue2
```

`@lh-ui/vue2` has a single runtime dependency: `@lh-ui/share` (the shared layer — core pure functions, theme, constants, locales, types, and the component style source), which is installed automatically.

### Installing from a private server

If the package is hosted on a private server rather than a public registry, use one of the following.

**Option 1: direct tarball URL** (works with plain static file hosting)

```bash
npm install https://your-domain.com/pkg/lh-ui-vue2-1.0.0.tgz
# or
pnpm add https://your-domain.com/pkg/lh-ui-vue2-1.0.0.tgz
# or
yarn add https://your-domain.com/pkg/lh-ui-vue2-1.0.0.tgz
```

> With a direct tarball, `@lh-ui/share` is still resolved from the current registry, so that package must be available on the public registry or your private registry.

**Option 2: self-hosted registry** (e.g. Verdaccio — supports semver resolution and version management)

Add a scope-scoped route to your project's `.npmrc` so other packages keep their default registry:

```ini
@lh-ui:registry=https://your-domain.com/
```

Then install as usual:

```bash
pnpm add @lh-ui/vue2
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

58 components in six groups (matching the docs site navigation; see the
[online docs](https://lh-ui.lhgb.top/vue2/) for the full list):

| Category | Components |
| --- | --- |
| Basic | ConfigProvider, Button, Icon, Tag, Divider, Space, Card |
| Layout | Grid (Row/Col), Layout, Collapse, Descriptions |
| Data entry | Input, InputNumber, Select, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Slider, Rate, Segmented, Form, FormItem, Upload, Transfer, TimePicker, DatePicker, Cascader, AutoComplete |
| Data display | Badge, Avatar, Spin, Table, Tag, Skeleton, Empty, Statistic, Timeline, Image, Carousel, Collapse, Descriptions, Tree, TreeSelect |
| Feedback | Alert, Progress, Message, Notification, Loading, Dialog, Drawer, Tooltip, Popover, Popconfirm |
| Navigation | Breadcrumb, Pagination, Tabs, Steps, Dropdown, Menu, Anchor, Backtop, Affix |

## Development

| Task | Command |
| --- | --- |
| Dev playground (port 5174) | `pnpm dev` |
| Docs site | `pnpm docs:dev` |
| Tests / watch | `pnpm test` / `pnpm test:watch` |
| Lint / autofix | `pnpm lint` / `pnpm lint:fix` |
| Typecheck | `pnpm typecheck` |
| Build (esm + cjs + umd + styles + dts) | `pnpm build` |
| Changeset | `pnpm changeset` |

The docs site runs on VuePress 1.x with the same Vue 2.7 runtime as the library. Component examples
are rendered live by DemoBlock straight from the `dev/demos/index.ts` registry (same source as the
dev sandbox), so edits hot-reload under `pnpm docs:dev`.

## Publishing

Publishing always uses `npm publish` (pnpm has no publish command, and yarn v2+ removed it); the
package manager only matters on the consumer side. **Release order is fixed: `@lh-ui/share` publishes
first** (the `dependencies` semver must already be published).

```bash
# 0. One-time: log in to npm and own the @lh-ui scope (create an organization or personal scope on npm)
npm login

# 1. Publish share first (hard rule)
cd ../lh-ui-share
pnpm build && pnpm verify:dts && pnpm verify:styles
npm publish --access public            # publishes @lh-ui/share@0.1.0

# 2. Then publish vue2
cd ../lh-ui-vue2
pnpm install                           # re-resolve @lh-ui/share ^0.1.0, regenerate pnpm-lock.yaml
pnpm changeset version                 # consume changesets → bump version + generate CHANGELOG.md
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm verify:dts   # full regression
npm pack --dry-run                     # inspect the files allowlist
npm publish --access public            # triggers prepublishOnly (build + verify:dts)
```

> **Version coordination trap**: the share repo may hold unconsumed changesets. **Do not run
> `pnpm changeset version` in the share repo before publishing** — it would bump share to 0.2.0,
> while this library's dependency is pinned to `^0.1.0` (semver `^0.1.0` = `>=0.1.0 <0.2.0`; when
> the major is 0, the caret locks the minor), which would no longer resolve. Instead: publish share
> at its already-versioned 0.1.0 as-is; when those changesets are later consumed to release 0.2.0,
> update this library's dependency to `^0.2.0`, re-run the regression suite, and release again.

To publish to a private server (e.g. Verdaccio), add `--registry` pointing at it, or upload the
`lh-ui-vue2-x.y.z.tgz` produced by `npm pack` to a static directory on your server and consume it as
described in "Installing from a private server" above.

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
- Family roadmap: [`docs/多端组件库规划.md`](../docs/多端组件库规划.md)
- Vue 2 details: [`docs/vue2/vue2组件库计划.md`](../docs/vue2/vue2组件库计划.md)
