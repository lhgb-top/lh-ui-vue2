# Switch

A toggle switch. Supports active / inactive labels, loading and disabled states; both clicking and Enter / Space toggle it.

<DemoBlock name="switch" title="Switch" :height="130">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 20px">
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap">
      <LhSwitch v-model="on" active-text="夜模式" inactive-text="昼模式" name="theme" />
      <LhSwitch v-model="loading" loading />
      <LhSwitch v-model="on2" disabled />
    </div>
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; align-items: center">
      <LhSwitch v-model="s" size="small" active-text="小" />
      <LhSwitch v-model="m" size="medium" active-text="中" />
      <LhSwitch v-model="l" size="large" active-text="大" />
    </div>
    <p class="demo-note">loading 态禁点且显示加载圈；name 透传到原生 input。</p>
  </div>
</template>

<script>
export default {
  data: () => ({ on: true, on2: false, loading: true, s: true, m: true, l: false }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Switch state (model: modelValue/input) | `boolean` | `false` |
| activeText / inactiveText | Labels on either side | `string` | `''` |
| loading | Loading state (disables interaction + spinner) | `boolean` | `false` |
| disabled | Disable the switch | `boolean` | `false` |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| name | Native name attribute | `string` | `''` |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the switch state changes | `(value)` |

## Accessibility

The root element uses `role="switch"` with `aria-checked` / `aria-disabled`; inside a `LhFormItem`, `aria-invalid` is set when validation fails.
