# Input 输入框

文本/多行输入。支持前后缀、清空、字数统计、maxlength 截断与表单校验联动。

<DemoBlock name="input" title="输入框形态" :height="880">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 18px">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhInput v-model="text" placeholder="请输入内容" clearable name="title" />
      <LhInput v-model="text" prefix-icon="search" suffix-icon="close" placeholder="前后缀图标" />
    </div>
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhInput v-model="secret" type="password" placeholder="密码" autocomplete="new-password" />
      <LhInput v-model="text" readonly placeholder="只读" />
      <LhInput v-model="text" disabled placeholder="禁用状态" />
    </div>
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap; align-items: center">
      <LhInput v-model="text" size="small" placeholder="small" />
      <LhInput v-model="text" size="medium" placeholder="medium" />
      <LhInput v-model="text" size="large" placeholder="large" />
    </div>
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhInput v-model="poem" type="textarea" :rows="2" placeholder="多行文本（rows=2）" resize="vertical" />
      <LhInput v-model="poem" type="textarea" autosize placeholder="自适应行高" />
    </div>
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhInput v-model="limited" :maxlength="20" show-word-limit placeholder="字数统计" />
      <LhInput v-model="text" label="浮动标签" placeholder="与 placeholder 互斥" />
    </div>
    <p class="demo-note">当前值：{{ text || '（空）' }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({ text: '', secret: '', poem: '', limited: '' }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值（model: modelValue/input） | `string` | — |
| type | 控件类型 | `'text' \| 'textarea' \| 'password' \| …` | `'text'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| placeholder | 占位文案，缺省用语言包 | `string` | `t('input.placeholder')` |
| clearable | 显示清空按钮 | `boolean` | `false` |
| prefixIcon / suffixIcon | 前后缀图标，取内置 LhIcon 图标名 | `string` | — |
| maxlength / minlength | 原生长度限制 | `number` | — |
| showWordLimit | 显示字数统计（需 maxlength） | `boolean` | `false` |
| autosize | textarea 自适应行高 | `boolean \| {minRows,maxRows}` | `false` |
| disabled / readonly | 禁用 / 只读 | `boolean` | `false` |
| autofocus | 挂载时自动聚焦 | `boolean` | `false` |
| autocomplete | 原生 autocomplete | `string` | `'off'` |
| nativeType | 原生 type（type=text 时生效） | `string` | `'text'` |
| resize | textarea 缩放手柄方向 | `'none' \| 'both' \| 'horizontal' \| 'vertical'` | — |
| name / form | 原生 name / form 属性 | `string` | — |
| tabindex | 原生 tabindex | `number \| string` | — |
| inputStyle | 输入元素内联样式 | `Record<string, string>` | — |
| label | 浮动标签（与 placeholder 互斥） | `string` | — |
| themeVars / bgPattern / sx | 主题覆盖 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| input | v-model 事件 | `(val, e)` |
| change | 值变化时触发 | — |
| focus | 获得焦点时触发 | — |
| blur | 失去焦点时触发 | — |
| clear | 清空时触发 | — |
| keydown | 按键按下时触发 | — |

## 表单联动

置于 `LhFormItem` 内且校验失败时，原生控件自动带 `aria-invalid="true"`。
