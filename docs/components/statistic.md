# Statistic 统计数值

突出展示单个统计数值。支持千分位、小数精度、前后缀，字符串 value 可承载超大数。

<DemoBlock name="statistic" title="统计数值" :height="260">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 48px; flex-wrap: wrap">
      <LhStatistic title="馆藏画作" :value="1280" :separator="separator" suffix=" 幅" />
      <LhStatistic title="今日访客" :value="visitors" />
      <LhStatistic title="均价（万）" :value="price" :precision="2" prefix="¥" />
      <LhStatistic title="超大数" value="9007199254740993" />
    </div>
    <p class="demo-note">separator 传空串可关闭千分位分组</p>
    <div class="demo-row" style="gap: 48px; flex-wrap: wrap; margin-top: 16px">
      <LhStatistic title="无千分位" :value="visitors" separator="" />
      <LhStatistic :value="2026" suffix=" 年" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    separator: ',',
    visitors: 38651,
    price: 182.5,
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 数值标题（展示在数值上方） | `string` | — |
| value | 统计数值；字符串形式可承载超大数或带符号文本 | `number \| string` | — |
| precision | 小数精度 | `number` | — |
| separator | 千位分隔符；空串关闭分组 | `string` | — |
| prefix | 数值前缀，如货币符号 | `string` | — |
| suffix | 数值后缀，如单位 | `string` | — |
| sx | sx 快速布局属性 | — | — |
