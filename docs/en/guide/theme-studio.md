# Theme Studio

Not satisfied with the built-in presets? Pick one as a starting point in the studio below, tune
the tokens one by one, watch the preview update live, then export a **single SCSS file** into your
project — no recompilation of the library required.

<ThemeStudio />

## Adopting the exported theme

The exported file looks like this (tokens originate from `@lh-ui/share/styles/theme/common/var.scss`):

```scss
@use '@lh-ui/share/styles/index.scss';

:root {
  --lh-primary-color: #2B4C7C;
  /* ... */
}

[data-theme='dark'],
.dark {
  --lh-primary-color-bg: color-mix(in srgb, var(--lh-primary-color) 25%, transparent);
  --lh-selected-color: color-mix(in srgb, var(--lh-primary-color) 40%, #fff);
}
```

Two ways to adopt it:

**Option 1: static import (recommended)** — drop the exported `lh-theme.scss` into your project
and import it at the entry:

```js
// main.js
import './lh-theme.scss'
```

`@use '@lh-ui/share/styles/index.scss'` already bundles every component style and the theme tokens
in one line; the dark block shares the same mechanism as the share presets, so `data-theme="dark"`
switches automatically.

**Option 2: runtime injection** — override locally via the `themeVars` prop of `LhConfigProvider`
(keys are shorthand, the `--lh-` prefix is added automatically). Handy when several themes coexist
on one page:

```vue
<template>
  <LhConfigProvider :theme-vars="{ primaryColor: '#2B4C7C', onPrimary: '#FFFFFF' }">
    <LhButton type="primary">Primary</LhButton>
  </LhConfigProvider>
</template>

<script>
import { LhConfigProvider, LhButton } from '@lh-ui/vue2'

export default {
  components: { LhConfigProvider, LhButton },
}
</script>
```

> Example code always uses npm package names (`@lh-ui/vue2` / `@lh-ui/share`) so it is copy-paste
> ready; this docs site itself runs off the family-local source, so changes show up instantly.

## Caveats

- **Light primaries must declare `--lh-color-on-primary` explicitly**: white text fails the AA
  contrast threshold (4.5:1) on light primaries, which is why the pine-green and golden presets
  switch to dark text. The "Text on primary" field in the studio covers this token.
- Leaving `--lh-selected-color` empty follows the default chain to `--lh-primary-color-active`;
  on light primaries it usually needs a dedicated darkening for selected text (the presets show
  this too).
- Contrast gate: share's `pnpm verify:theme` recomputes AA contrast for every preset against the
  real consumption pairs — review your custom theme the same way (see [Theming](/en/guide/theme)).
