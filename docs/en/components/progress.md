# Progress

Task progress visualization. Two shapes — line and circle — with status-based coloring, a custom color function, and text formatting.

<DemoBlock name="progress" title="Progress" :height="520">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| percentage | Progress percentage, 0-100 (clamped automatically when out of range) | `number` | — |
| type | Type | `'line' \| 'circle'` | `'line'` |
| status | Status-based coloring | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| color | Bar color: a string, or a function that returns a color for a given percentage | `string \| ((percentage: number) => string)` | — |
| strokeWidth | Stroke width in px (the height for line, the ring thickness for circle) | `number` | — |
| width | Canvas width in px for circle mode | `number` | — |
| showText | Whether to show the progress text | `boolean` | `true` |
| format | Custom text formatter | `(percentage: number) => string` | — |
| sx | sx shorthand layout props | — | — |
