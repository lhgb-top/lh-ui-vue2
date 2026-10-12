# Progress 进度条

任务进度可视化。线形与环形两种形态，支持状态配色、自定义颜色函数与文字格式化。

<DemoBlock name="progress" title="进度条" :height="520">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <p class="demo-note">line 线形</p>
    <LhProgress :percentage="30" />
    <LhProgress :percentage="70" status="success" />
    <LhProgress :percentage="45" status="warning" />
    <LhProgress :percentage="20" status="danger" />
    <LhProgress :percentage="60" :stroke-width="20" :format="fmt" />
    <LhProgress :percentage="100" :show-text="false" />
    <p class="demo-note">circle 环形（width 控制画布尺寸，strokeWidth 控制描边）</p>
    <div class="demo-row" style="gap: 32px; flex-wrap: wrap">
      <LhProgress type="circle" :percentage="75" />
      <LhProgress type="circle" :percentage="40" :width="120" :stroke-width="14" status="warning" />
      <LhProgress type="circle" :percentage="100" status="success" :format="fmt" />
    </div>
    <p class="demo-note">color 字符串或按百分比返回颜色的函数</p>
    <LhProgress :percentage="percent" :color="colorFn" />
    <LhButton size="small" @click="bump">{{ percent >= 100 ? '重置' : '+10' }}</LhButton>
  </div>
</template>

<script>
export default {
  data: () => ({
    percent: 30,
  }),
  methods: {
    fmt(p) {
      return `${p / 10} 成`
    },
    colorFn(p) {
      if (p < 40) return 'var(--lh-danger-color)'
      if (p < 80) return 'var(--lh-warning-color)'
      return 'var(--lh-success-color)'
    },
    bump() {
      this.percent = this.percent >= 100 ? 0 : this.percent + 10
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
| percentage | 进度百分比 0-100（超出会自动钳制） | `number` | — |
| type | 类型 | `'line' \| 'circle'` | `'line'` |
| status | 状态配色 | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| color | 进度条颜色：字符串或按百分比返回颜色的函数 | `string \| ((percentage: number) => string)` | — |
| strokeWidth | 线条宽度 px（line 为高度，circle 为描边宽度） | `number` | — |
| width | 圆形模式画布宽度 px | `number` | — |
| showText | 是否展示进度文字 | `boolean` | `true` |
| format | 自定义文字格式化 | `(percentage: number) => string` | — |
| sx | sx 快速布局属性 | — | — |
