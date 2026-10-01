# Input 输入框

文本/多行输入。支持前后缀、清空、字数统计、maxlength 截断与表单校验联动。

<DemoBlock name="input" title="输入框形态" :height="280">

```vue
<template>
  <LhInput v-model="text" placeholder="请输入内容" clearable />
  <LhInput v-model="text" prefix-icon="lh-icon-search" placeholder="带前缀图标" />
  <LhInput v-model="text" type="textarea" :rows="3" placeholder="多行文本" />
</template>
```

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值（model: modelValue/input） | `string` | — |
| type | 控件类型 | `'text' \| 'textarea' \| 'password' \| …` | `'text'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| placeholder | 占位文案，缺省用语言包 | `string` | `t('input.placeholder')` |
| clearable | 显示清空按钮 | `boolean` | `false` |
| prefixIcon / suffixIcon | 前后缀图标类名 | `string` | — |
| maxlength / minlength | 原生长度限制 | `number` | — |
| showWordLimit | 显示字数统计（需 maxlength） | `boolean` | `false` |
| autosize | textarea 自适应行高 | `boolean \| {minRows,maxRows}` | `false` |
| disabled / readonly | 禁用 / 只读 | `boolean` | `false` |
| label | 浮动标签（与 placeholder 互斥） | `string` | — |
| themeVars / bgPattern / sx | 主题覆盖 | — | — |

## Events

`input`（v-model，参数 `(val, e)`）、`change`、`focus`、`blur`、`clear`、`keydown`

## 表单联动

置于 `LhFormItem` 内且校验失败时，原生控件自动带 `aria-invalid="true"`。
