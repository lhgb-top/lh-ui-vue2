# Checkbox 多选框

单独勾选或成组使用（`LhCheckboxGroup`）。组内通过 `value` 标识成员，group 的 disabled/size 对子项生效。

<DemoBlock name="checkbox" title="多选框" :height="240">

```vue
<template>
  <LhCheckbox v-model="single" label="单独勾选" />
  <LhCheckboxGroup v-model="picked">
    <LhCheckbox label="山水" value="shan" />
    <LhCheckbox label="花鸟" value="hua" />
  </LhCheckboxGroup>
</template>
```

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

`input`（v-model）、`change (checked)`；group 同名事件汇总子项变化。
