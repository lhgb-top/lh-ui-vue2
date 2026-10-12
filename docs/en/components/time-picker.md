# TimePicker

A time picker. Wheel columns select hours / minutes / seconds; the seconds column is hidden automatically when `format` omits `ss`, and `arrowControl` switches to arrow buttons at the top of each column. The panel is appended to the body (Vue 2 has no Teleport).

<DemoBlock name="time-picker" title="Time picker" :height="380">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 16px">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhTimePicker v-model="t1" format="HH:mm:ss" placeholder="选择时间" clearable />
      <LhTimePicker v-model="t2" format="HH:mm" placeholder="时分（无秒列）" size="small" />
      <LhTimePicker v-model="t3" format="HH:mm:ss" arrow-control placeholder="箭头控制" size="large" />
      <LhTimePicker v-model="t1" format="HH:mm:ss" disabled placeholder="禁用" />
      <LhTimePicker v-model="t1" format="HH:mm:ss" readonly placeholder="只读" />
    </div>
    <LhTimePicker
      v-model="t4"
      format="HH:mm:ss"
      :step-hour="2"
      :step-minute="15"
      :step-second="30"
      placeholder="步进：时 2 / 分 15 / 秒 30"
    />
    <p class="demo-note">时分秒：{{ fmt(t1) }}｜时分：{{ fmt(t2) }}｜箭头：{{ fmt(t3) }}｜步进：{{ fmt(t4) }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    t1: new Date(2026, 9, 3, 14, 30, 0),
    t2: null,
    t3: null,
    t4: null,
  }),
  methods: {
    fmt(v) {
      if (!(v instanceof Date)) return '（未选择）'
      const p = (n) => String(n).padStart(2, '0')
      return p(v.getHours()) + ':' + p(v.getMinutes()) + ':' + p(v.getSeconds())
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
| v-model | Current selection | `Date \| null` | — |
| mode | Mode (reserved for date-time linkage; renders time columns for now) | `LhTimePickerMode` | — |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled / clearable / readonly | Disabled / clearable / read-only | `boolean` | `false` |
| placeholder | Placeholder text | `string` | locale message |
| format | Display format (`HH:mm:ss`, `HH:mm`); the seconds column is hidden when `ss` is absent | `string` | `'HH:mm:ss'` |
| arrowControl | Arrow controls (up/down buttons on each column header) | `boolean` | `false` |
| stepHour / stepMinute / stepSecond | Hour / minute / second step | `number` | `1` |
| teleportTarget | Popper mount target | `string \| HTMLElement` | `'body'` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the selection changes | `(value)` |

## Accessibility

Each column is `role="spinbutton"` + `aria-valuenow/min/max`; both the wheel and arrow interactions support keyboard arrow keys.
The trigger uses `role="combobox"` + `aria-expanded`, and the panel's confirm button is focusable.
