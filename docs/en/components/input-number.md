# InputNumber

A numeric input. Supports min / max bounds, `step` stepping and `stepStrictly` multiple-of constraint, `precision` decimals, optional increment / decrement buttons, and three sizes; the ↑ / ↓ keys step as well.

<DemoBlock name="input-number" title="InputNumber" :height="320">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 20px">
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="count" :min="1" :max="99" :step="1" placeholder="数量" name="count" />
      <span class="demo-note">min=1 max=99，受控值：{{ count }}</span>
    </div>
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="price" :step="0.5" :precision="2" :min="0" />
      <span class="demo-note">step=0.5 precision=2：{{ price }}</span>
    </div>
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="strict" :step="10" step-strictly />
      <span class="demo-note">stepStrictly：输入框失焦后归到 10 的倍数</span>
    </div>
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="noControls" :controls="false" placeholder="无步进器" />
      <LhInputNumber v-model="disabledVal" disabled />
    </div>
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="sized" size="small" />
      <LhInputNumber v-model="sized" size="medium" />
      <LhInputNumber v-model="sized" size="large" />
    </div>
    <p class="demo-note">controls=false 隐藏加减按钮；输入框聚焦时方向键（↑/↓）也可步进。</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    count: 6,
    price: 12.5,
    strict: 20,
    noControls: undefined,
    disabledVal: 3,
    sized: 8,
  }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Bound value (model: modelValue/input) | `number \| null` | `null` |
| min | Minimum value (clamped) | `number` | — |
| max | Maximum value (clamped) | `number` | — |
| step | Step size | `number` | `1` |
| stepStrictly | The input must be a multiple of step (snapped on blur) | `boolean` | `false` |
| precision | Number of decimal places (rounded if exceeded) | `number` | — |
| controls | Show the increment / decrement buttons | `boolean` | `true` |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | Disable the control | `boolean` | `false` |
| placeholder | Placeholder text | `string` | — |
| name | Native name attribute | `string` | — |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | `(val)` |
| change | Emitted when the value changes | `(val)` |

## Accessibility

The increment / decrement buttons are native `button` elements; ↑ / ↓ step while the input is focused. Inside a `LhFormItem`, `aria-invalid` is set when validation fails.
