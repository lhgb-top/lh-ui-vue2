# Calendar

A calendar view. Three selection modes — single / a span of time / multiple — with `range` constraining the selectable date bounds; `panel` mode is always visible, while `input` mode collapses into a text field that expands on click (the panel is appended to the body).

<DemoBlock name="calendar" title="Calendar" :height="380">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: none">
    <div class="demo-row" style="align-items: flex-start; flex-wrap: nowrap">
      <LhCalendar v-model="single" selection="single" />
      <LhCalendar v-model="span" selection="range" mode="input" placeholder="选择一段时间" />
    </div>
    <p class="demo-note">单选：{{ fmt(single) }}｜时间段：{{ fmtArr(span) }}</p>
    <div class="demo-row" style="align-items: flex-start; flex-wrap: nowrap; margin-top: 16px">
      <LhCalendar v-model="multi" selection="multiple" :panels="2" :close-on-select="false" />
      <LhCalendar v-model="strict" selection="range" mode="panel" />
    </div>
    <p class="demo-note">多选（panels=2 双联面板，closeOnSelect=false 不自动收起）：{{ fmtArr(multi) }}</p>
    <p class="demo-note">面板模式 range（mode="panel"）：{{ fmtArr(strict) }}</p>
    <div class="demo-row" style="align-items: flex-start; flex-wrap: nowrap; margin-top: 16px">
      <LhCalendar v-model="clamped" selection="single" :range="bounds" />
    </div>
    <p class="demo-note">range 限制可选区间（仅 2026-10-01 ~ 2026-10-15 可选）：{{ fmt(clamped) }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    single: new Date(2026, 9, 3),
    span: [],
    multi: [],
    strict: [],
    clamped: new Date(2026, 9, 5),
    bounds: [new Date(2026, 9, 1), new Date(2026, 9, 15)],
  }),
  methods: {
    fmt(v) {
      return v instanceof Date ? v.toLocaleDateString('zh-CN') : '（未选择）'
    },
    fmtArr(v) {
      if (!Array.isArray(v) || v.length === 0) return '（未选择）'
      return v.map((d) => d.toLocaleDateString('zh-CN')).join(' ~ ')
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
| v-model | Current selection; a `Date` for single, a `Date[]` for a span or multiple | `Date \| Date[]` | — |
| selection | Selection mode | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | Selectable date range `[start, end]`; dates outside are disabled | `[Date, Date]` | — |
| mode | Display form: `panel` for an always-visible panel / `input` for a collapsed text field | `'panel' \| 'input'` | `'panel'` |
| panels | Number of month panels shown at once (laid out with flex wrap) | `number` | `1` |
| placeholder | Placeholder text for input mode | `string` | locale message |
| closeOnSelect | Whether input mode collapses after a selection | `boolean` | `true` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the selection changes | `(value)` |
| select | Emitted when a date cell is selected | `(date)` |

## Slots

| Slot | Description |
| --- | --- |
| header | Month panel header; scope param `{ year, month }` (renders "YYYY 年 M 月" by default) |
| cell | Date cell; scope param `{ date }` (renders the day number by default) |

## Accessibility

The panel is `role="grid"`, the weekday row is `role="row"`, and the date cells are `role="gridcell"`;
disabled dates set `aria-disabled`, and the input-mode trigger supports keyboard expansion and arrow-key navigation.
