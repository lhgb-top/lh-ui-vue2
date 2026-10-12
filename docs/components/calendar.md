# Calendar 日历

日历视图。支持单选 / 一段时间 / 多选三种选择模式，`range` 约束可选日期边界；`panel` 模式常驻展示，`input` 模式折叠为输入框点击展开（面板挂载到 body）。

<DemoBlock name="calendar" title="日历" :height="380">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前选中；单选为 `Date`，一段时间与多选为 `Date[]` | `Date \| Date[]` | — |
| selection | 选择模式 | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | 可选日期范围 `[start, end]`，范围外禁用 | `[Date, Date]` | — |
| mode | 展示形态：`panel` 常驻面板 / `input` 折叠输入框 | `'panel' \| 'input'` | `'panel'` |
| panels | 同时展示的月面板数（flex 换行排列） | `number` | `1` |
| placeholder | input 模式占位文本 | `string` | 语言包 |
| closeOnSelect | input 模式选中后是否自动收起 | `boolean` | `true` |
| sx | sx 快速布局属性 | — | — |

## Events

`input`（v-model）、`change (value)`、`select (date)`

## Slots

| 插槽 | 说明 |
| --- | --- |
| header | 月面板表头，作用域参数 `{ year, month }`（默认渲染「YYYY 年 M 月」） |
| cell | 日期单元格，作用域参数 `{ date }`（默认渲染日序号） |

## 无障碍

面板为 `role="grid"`，星期行为 `role="row"`，日期单元格为 `role="gridcell"`；
禁用日期置 `aria-disabled`，input 模式触发器支持键盘展开与方向键移动。
