# Statistic

A single statistic value highlighted on display. Supports thousands separators, decimal precision, prefixes / suffixes; a string value can carry arbitrarily large numbers.

<DemoBlock name="statistic" title="Statistic" :height="260">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Value title (displayed above the value) | `string` | — |
| value | The statistic value; a string can carry arbitrarily large numbers or signed text | `number \| string` | — |
| precision | Decimal precision | `number` | — |
| separator | Thousands separator; an empty string disables grouping | `string` | — |
| prefix | Value prefix, e.g. a currency symbol | `string` | — |
| suffix | Value suffix, e.g. a unit | `string` | — |
| sx | sx shorthand layout props | — | — |
