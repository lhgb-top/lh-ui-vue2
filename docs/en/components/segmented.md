# Segmented

A segmented control. Options accept either a shorthand string form or `{ value, label, disabled }` objects; `block` stretches the control to fill the container width.

<DemoBlock name="segmented" title="Segmented" :height="330">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 20px">
    <LhSegmented v-model="view" :options="['列表', '网格', '图册']" />
    <p class="demo-note">字符串数组快捷写法：{{ view }}</p>
    <LhSegmented v-model="dynasty" :options="options" />
    <p class="demo-note">对象写法（含 disabled 项）：{{ dynasty }}</p>
    <LhSegmented v-model="view" :options="['列表', '网格', '图册']" disabled />
    <LhSegmented v-model="view" :options="['列表', '网格', '图册']" block />
    <p class="demo-note">block 撑满容器宽度</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    view: '列表',
    dynasty: 'tang',
    options: [
      { value: 'tang', label: '唐' },
      { value: 'song', label: '宋' },
      { value: 'yuan', label: '元' },
      { value: 'ming', label: '明', disabled: true },
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
| v-model | Current value (model: modelValue/input) | `string \| number` | — |
| options | Options (strings or objects; required) | `(string \| number \| { value, label, disabled? })[]` | — |
| disabled | Disable the whole control | `boolean` | `false` |
| block | Fill the container width | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | `(val)` |
| change | Emitted when the selection changes | `(val)` |

## Accessibility

The root element uses `role="radiogroup"`, with each item as `role="radio"` + `aria-checked`; switch with ← / →.
