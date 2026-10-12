# DatePicker

A date picker. Five modes — `date` / `month` / `year` / `datetime` / `range`: the panel drills down level by level (date → month → year), `datetime` appends time columns under the calendar (hour / minute / second, wheel or click, merged with the date on confirm), and `range` is a two-step selection (the first click sets and highlights the start, the second normalizes the range and highlights the days in between). The panel is appended to the body, and `format` controls the display format.

<DemoBlock name="date-picker" title="Date picker" :height="410">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 16px">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhDatePicker v-model="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" clearable />
      <LhDatePicker v-model="month" mode="month" placeholder="选择月份" size="small" />
      <LhDatePicker v-model="year" mode="year" placeholder="选择年份" size="large" />
      <LhDatePicker v-model="datetime" mode="datetime" placeholder="选择日期时间" disabled />
      <LhDatePicker v-model="date" placeholder="只读" readonly />
    </div>
    <LhDatePicker
      v-model="range"
      mode="range"
      range-separator="至"
      placeholder="选择日期段（两次点击）"
      :cell-class-name="cellClass"
      popper-class="demo-popper"
    />
    <p class="demo-note">
      日期：{{ fmt(date) }}｜月份：{{ fmt(month) }}｜年份：{{ fmt(year) }}｜日期时间：{{ fmt(datetime) }}
    </p>
    <p class="demo-note">日期段（rangeSeparator="至"，周末标红）：{{ fmtRange(range) }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    date: new Date(2026, 9, 3),
    month: new Date(2026, 9, 1),
    year: new Date(2026, 0, 1),
    datetime: null,
    range: null,
  }),
  methods: {
    fmt(v) {
      return v instanceof Date ? v.toLocaleString('zh-CN', { hour12: false }) : '（未选择）'
    },
    fmtRange(v) {
      if (!Array.isArray(v) || v.length !== 2) return '（未选择）'
      const [a, b] = v
      const s = (d) => (d instanceof Date ? d.toLocaleString('zh-CN', { hour12: false }) : '（未选择）')
      return `${s(a)} ~ ${s(b)}`
    },
    cellClass(date) {
      return date.getDay() === 0 || date.getDay() === 6 ? 'demo-cell-weekend' : ''
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Current selection | `Date \| [Date, Date] \| null` | — |
| mode | Mode: date / month / year / date-time / date range | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled / clearable / readonly | Disabled / clearable / read-only | `boolean` | `false` / `true` / `true` |
| placeholder | Placeholder text | `string` | locale message |
| format | Display format (`yyyy-MM-dd`, `yyyy-MM`, …) | `string` | `'yyyy-MM-dd'` |
| rangeSeparator | Separator text used in range mode | `string` | `'~'` |
| cellClassName | Custom cell class name | `(date: Date) => string` | — |
| popperClass | Extra class for the popper | `string` | — |
| teleportTarget | Popper mount target | `string \| HTMLElement` | `'body'` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the selection changes | `(value)` |

## Accessibility

The trigger uses `role="combobox"` + `aria-expanded`, and the panel uses `role="grid"`.
In `datetime` mode the time columns are `role="spinbutton"` with `aria-valuenow/min/max`; inside a `LhFormItem`, `aria-invalid` is set automatically when validation fails.
