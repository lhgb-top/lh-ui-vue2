# Installation

## Requirements

- Vue **2.7** (the final 2.x release; 2.6 and below are not supported, and IE11 is not supported)
- Node 20 + pnpm 10 recommended

## Installing with a package manager

```bash
npm install @lh-ui/vue2
# or
pnpm add @lh-ui/vue2
# or
yarn add @lh-ui/vue2
```

`@lh-ui/vue2` has a single runtime dependency: `@lh-ui/share` (the shared layer — core pure functions, theme, constants, locales, types, and the component style source), which is installed automatically.

## Installing from a private server

If the package is hosted on a private server rather than a public registry, use one of the following.

### Option 1: direct tarball URL

This works with plain static file hosting. Upload the `lh-ui-vue2-x.y.z.tgz` produced by `npm pack` to a directory on your server, then:

```bash
npm install https://your-domain.com/pkg/lh-ui-vue2-1.0.0.tgz
# or
pnpm add https://your-domain.com/pkg/lh-ui-vue2-1.0.0.tgz
# or
yarn add https://your-domain.com/pkg/lh-ui-vue2-1.0.0.tgz
```

> With a direct tarball, `@lh-ui/share` is still resolved from the current registry, so that package must be available on the public registry or your private registry.

### Option 2: self-hosted registry (e.g. Verdaccio)

A self-hosted registry supports semver resolution and version management. Add a scope-scoped route to your project's `.npmrc` so other packages keep their default registry:

```ini
@lh-ui:registry=https://your-domain.com/
```

Then install as usual:

```bash
pnpm add @lh-ui/vue2
```

## Importing styles manually

```ts
// Theme variables (light + dark)
import '@lh-ui/vue2/theme.css'
// Per-component styles (optional — the full entry already includes them)
import '@lh-ui/vue2/style/button'
```

## Versioning policy

- Upgrading `@lh-ui/share` follows the discipline: "share releases first → the UI library upgrades and runs its regression suite → then the UI library releases".
- Current status: `@lh-ui/vue2` 1.0.0 is published, `@lh-ui/share` is at 0.1.0.
