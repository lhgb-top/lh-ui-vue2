# Select

Dropdown selection. By default the dropdown is appended to the body (positioned fixed so it follows the trigger); use `popperContainer` to choose another container, or pass an empty value to render in place. Full keyboard navigation (arrow keys / Enter / ESC).

<DemoBlock name="select" title="Select" :height="280">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 18px">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhSelect v-model="value" :options="options" placeholder="请选择题材" clearable name="theme" />
      <LhSelect v-model="value" :options="options" size="small" />
      <LhSelect v-model="value" :options="options" size="large" />
    </div>
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhSelect v-model="value" :options="options" disabled />
      <LhSelect v-model="empty" :options="[]" aria-label="空数据">
        <template #empty>
          <span class="demo-note">插槽 empty：暂无匹配题材</span>
        </template>
      </LhSelect>
    </div>
    <p class="demo-note">当前值：{{ value || '（未选择）' }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    value: 'ink',
    empty: undefined,
    options: [
      { value: 'ink', label: '水墨' },
      { value: 'paper', label: '宣纸' },
      { value: 'seal', label: '印章' },
      { value: 'blank', label: '留白' },
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
| v-model | Selected value (matched against option.value; controlled modelValue prop) | `unknown` | — |
| options | Option list `{ value, label, disabled? }` | `LhSelectOption[]` | `[]` |
| placeholder | Placeholder text; falls back to the locale message | `string` | `t('select.placeholder')` |
| clearable | Show a clear button | `boolean` | `false` |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | Disable the control | `boolean` | `false` |
| popperContainer | Dropdown mount target | `'body' \| HTMLElement \| string` | `'body'` |
| name / ariaLabel | Accessibility labeling | `string` | — |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the selected value changes | `(value, option)` |
| clear | Emitted when cleared | — |

## Slots

| Slot | Description |
| --- | --- |
| empty | Content shown when there is no data (defaults to "No data") |

## Accessibility

The trigger uses `role="combobox"` with `aria-expanded` / `aria-haspopup`; the dropdown uses `role="listbox"` and options use `role="option"`. Inside a `LhFormItem`, `aria-invalid` is set automatically when validation fails.
