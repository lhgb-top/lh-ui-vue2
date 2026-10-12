# Slider 滑块

滑块输入。支持 min/max/step、range 双滑块、marks 刻度标记、showInput 数值显示、三档尺寸与禁用；支持鼠标拖拽与触屏。

<DemoBlock name="slider" title="滑块" :height="350">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值；range 时为 `[start, end]`（model: modelValue/input） | `number \| [number, number] \| null` | — |
| min | 最小值 | `number` | `0` |
| max | 最大值 | `number` | `100` |
| step | 步进值 | `number` | `1` |
| range | 双滑块模式 | `boolean` | `false` |
| marks | 刻度标记 `{ value: label }` | `Record<number, string>` | — |
| showInput | 显示数值文本 | `boolean` | `false` |
| size | 尺寸（轨道高度） | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | 禁用 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| input | v-model 事件 | `(val)` |
| change | 值变化时触发 | `(val)` |

## 无障碍

滑块按钮为 `role="slider"` + `aria-valuemin/max/now`；置于 `LhFormItem` 内校验失败时 `aria-invalid`。
