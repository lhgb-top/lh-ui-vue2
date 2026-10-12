# Slider

A slider input. Supports min / max / step, `range` dual thumbs, `marks` tick labels, `showInput` value text, three sizes, and disabled state; works with both mouse dragging and touch.

<DemoBlock name="slider" title="Slider" :height="350">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 520px; gap: 26px">
    <div>
      <LhSlider v-model="single" :min="0" :max="100" :step="5" show-input />
      <p class="demo-note">min=0 max=100 step=5 showInput：{{ single }}</p>
    </div>
    <div>
      <LhSlider v-model="ranged" range :min="10" :max="90" :step="10" />
      <p class="demo-note">range 双滑块：{{ JSON.stringify(ranged) }}</p>
    </div>
    <div>
      <LhSlider v-model="marked" :min="0" :max="100" :marks="marks" />
      <p class="demo-note">marks 刻度标记：{{ marked }}</p>
    </div>
    <div>
      <LhSlider v-model="single" size="small" />
      <LhSlider v-model="single" disabled />
      <p class="demo-note">size="small" 与 disabled</p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    single: 35,
    ranged: [20, 60],
    marked: 40,
    marks: { 0: '起笔', 50: '行笔', 100: '收笔' },
  }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Bound value; `[start, end]` in range mode (model: modelValue/input) | `number \| [number, number] \| null` | — |
| min | Minimum value | `number` | `0` |
| max | Maximum value | `number` | `100` |
| step | Step size | `number` | `1` |
| range | Dual-thumb mode | `boolean` | `false` |
| marks | Tick marks `{ value: label }` | `Record<number, string>` | — |
| showInput | Show the value as text | `boolean` | `false` |
| size | Size (track height) | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | Disable the slider | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | `(val)` |
| change | Emitted when the value changes | `(val)` |

## Accessibility

Each thumb uses `role="slider"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow`; inside a `LhFormItem`, `aria-invalid` is set when validation fails.
