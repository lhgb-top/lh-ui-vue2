# DatePicker 日期选择

日期选择器。`date` / `month` / `year` / `datetime` / `range` 五种模式：面板内可逐级钻取（日期 → 月份 → 年份），`datetime` 在日历下方附时间列（时/分/秒，滚轮或点击切换，确定时与日期合并），`range` 为两段式选择（第一次点击定起点并高亮，第二次点击归一化区间后高亮中间日）；面板挂载到 body，`format` 控制展示格式。

<DemoBlock name="date-picker" title="日期选择" :height="410">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前选中 | `Date \| [Date, Date] \| null` | — |
| mode | 模式：日期 / 月份 / 年份 / 日期时间 / 日期段 | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled / clearable / readonly | 禁用 / 可清空 / 只读 | `boolean` | `false` / `true` / `true` |
| placeholder | 占位文本 | `string` | 语言包 |
| format | 展示格式（`yyyy-MM-dd`、`yyyy-MM` 等） | `string` | `'yyyy-MM-dd'` |
| rangeSeparator | 日期段模式的分隔符文案 | `string` | `'~'` |
| cellClassName | 自定义单元格类名 | `(date: Date) => string` | — |
| popperClass | 弹出层附加类名 | `string` | — |
| teleportTarget | 弹出层挂载目标 | `string \| HTMLElement` | `'body'` |
| sx | sx 快速布局属性 | — | — |

## Events

`input`（v-model）、`change (value)`

## 无障碍

触发器 `role="combobox"` + `aria-expanded`，面板 `role="grid"`；
`datetime` 模式下时间列走 `role="spinbutton"`，置 `aria-valuenow/min/max`；置于 `LhFormItem` 内校验失败时自动 `aria-invalid`。
