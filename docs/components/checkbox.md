# Checkbox 多选框

单独勾选或成组使用（`LhCheckboxGroup`）。组内通过 `value` 标识成员，group 的 disabled/size 对子项生效。

<DemoBlock name="checkbox" title="多选框" :height="230">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 18px">
    <div class="demo-row" style="gap: 20px; flex-wrap: wrap">
      <LhCheckbox v-model="single" label="单独勾选" name="agree" />
      <LhCheckbox v-model="indeterminate" label="全选" indeterminate />
      <LhCheckbox v-model="disabledSingle" label="禁用" disabled />
    </div>
    <div>
      <LhCheckboxGroup v-model="picked" name="themes">
        <LhCheckbox label="山水" value="shan" />
        <LhCheckbox label="花鸟" value="hua" />
        <LhCheckbox label="人物" value="ren" disabled />
      </LhCheckboxGroup>
    </div>
    <div>
      <LhCheckboxGroup v-model="picked" disabled>
        <LhCheckbox label="山水" value="shan" />
        <LhCheckbox label="花鸟" value="hua" />
      </LhCheckboxGroup>
      <p class="demo-note">整组 disabled</p>
    </div>
    <div class="demo-row" style="gap: 20px; flex-wrap: wrap; align-items: center">
      <LhCheckboxGroup v-model="picked" size="small">
        <LhCheckbox label="山水" value="shan" />
      </LhCheckboxGroup>
      <LhCheckboxGroup v-model="picked" size="large">
        <LhCheckbox label="山水" value="shan" />
      </LhCheckboxGroup>
    </div>
    <p class="demo-note">组值：{{ JSON.stringify(picked) }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    single: true,
    indeterminate: true,
    disabledSingle: false,
    picked: ['shan'],
  }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Checkbox Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 选中状态（model: modelValue/input） | `boolean` | `false` |
| value | 组内成员取值 | `unknown` | — |
| label | 文案（或用默认插槽） | `string` | — |
| indeterminate | 半选（作用于原生控件） | `boolean` | `false` |
| disabled / size / name | — | — | — |

## CheckboxGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 选中值数组 | `unknown[]` | `[]` |
| disabled / size / name | 对子项生效 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| input | v-model 事件 | — |
| change | 选中状态变化时触发 | `(checked)` |

group 同名事件汇总子项变化。
