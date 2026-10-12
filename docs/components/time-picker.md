# TimePicker 时间选择

时间选择器。滚轮列选择时 / 分 / 秒，`format` 不含 `ss` 时自动隐藏秒列；`arrowControl` 切换为列头箭头控制。面板挂载到 body（Vue2 无 Teleport）。

<DemoBlock name="time-picker" title="时间选择" :height="380">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前选中 | `Date \| null` | — |
| mode | 模式（预留给日期时间联动，当前按时间列渲染） | `LhTimePickerMode` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled / clearable / readonly | 禁用 / 可清空 / 只读 | `boolean` | `false` |
| placeholder | 占位文本 | `string` | 语言包 |
| format | 展示格式（`HH:mm:ss`、`HH:mm`）；不含 `ss` 时隐藏秒列 | `string` | `'HH:mm:ss'` |
| arrowControl | 箭头控制（列头上下按钮） | `boolean` | `false` |
| stepHour / stepMinute / stepSecond | 时 / 分 / 秒步进 | `number` | `1` |
| teleportTarget | 弹出层挂载目标 | `string \| HTMLElement` | `'body'` |
| sx | sx 快速布局属性 | — | — |

## Events

`input`（v-model）、`change (value)`

## 无障碍

每列 `role="spinbutton"` + `aria-valuenow/min/max`，滚轮与箭头两种交互均支持键盘方向键；
触发器 `role="combobox"` + `aria-expanded`，面板确认按钮聚焦可达。
