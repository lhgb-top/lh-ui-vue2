# Transfer

A two-list shuttle selection. `v-model` binds the **left (source) keys** — when the value is empty all data sits on the right (target), and shuttling adds to or removes from the source keys; items marked `disabled` cannot be moved.

<DemoBlock name="transfer" title="Transfer" :height="630">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div style="max-width: 640px">
    <LhTransfer v-model="sourceKeys" :data="data" />
    <p class="demo-note">v-model 为左侧（源）键：{{ sourceKeys.join('、') || '（空）' }}</p>
    <LhTransfer v-model="sourceKeys" :data="data" disabled />
    <p class="demo-note">disabled 整组禁用（按钮与勾选框均不可点）</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    sourceKeys: ['ink', 'paper'],
    data: [
      { key: 'ink', label: '水墨' },
      { key: 'paper', label: '宣纸' },
      { key: 'brush', label: '狼毫' },
      { key: 'seal', label: '印章', disabled: true },
    ],
  }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| data | The full data set | `LhTransferItem[]` | `[]` |
| v-model | Left (source) key list (the controlled value prop); when not passed it defaults internally to empty, meaning everything is on the right | `Array<string \| number>` | — |
| disabled | Disabled | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the shuttle moves items | `(sourceKeys, direction)` |

## Accessibility

Both lists are `role="listbox"` with `role="option"` items carrying `aria-selected`;
the shuttle buttons use `aria-label` to state direction and count, the disabled state sets `aria-disabled`, and keyboard checking and moving are supported.
