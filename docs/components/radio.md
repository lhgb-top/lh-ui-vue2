# Radio 单选框

单独使用（v-model 匹配自身 value）或成组使用（`LhRadioGroup` 管理选中值）。

<DemoBlock name="radio" title="单选框" :height="200">

```vue
<template>
  <LhRadioGroup v-model="style">
    <LhRadio label="工笔" value="gongbi" />
    <LhRadio label="写意" value="xieyi" />
  </LhRadioGroup>
</template>
```

</DemoBlock>

## Radio Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 选中取值（model: modelValue/input） | `unknown` | — |
| value | 本单选框取值 | `unknown` | — |
| label | 文案（或用默认插槽） | `string` | — |
| disabled / size / name | — | — | — |

## RadioGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 组选中值 | `unknown` | — |
| disabled / size / name | 对子项生效 | — | — |

## Events

`input`（v-model）、`change (value)`；disabled 状态下 change 被拦截。
