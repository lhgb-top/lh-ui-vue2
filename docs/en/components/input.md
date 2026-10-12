# Input

Text and multiline input. Supports prefix / suffix icons, clearing, word counting, `maxlength` truncation, and form-validation integration.

<DemoBlock name="input" title="Input variants" :height="880">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 18px">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhInput v-model="text" placeholder="请输入内容" clearable name="title" />
      <LhInput v-model="text" prefix-icon="lh-icon-search" suffix-icon="lh-icon-close" placeholder="前后缀图标" />
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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Bound value (model: modelValue/input) | `string` | — |
| type | Control type | `'text' \| 'textarea' \| 'password' \| …` | `'text'` |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| placeholder | Placeholder text; falls back to the locale message | `string` | `t('input.placeholder')` |
| clearable | Show a clear button | `boolean` | `false` |
| prefixIcon / suffixIcon | Prefix / suffix icon class names | `string` | — |
| maxlength / minlength | Native length limits | `number` | — |
| showWordLimit | Show word count (requires maxlength) | `boolean` | `false` |
| autosize | Auto-growing textarea height | `boolean \| {minRows,maxRows}` | `false` |
| disabled / readonly | Disabled / read-only | `boolean` | `false` |
| autofocus | Focus on mount | `boolean` | `false` |
| autocomplete | Native autocomplete | `string` | `'off'` |
| nativeType | Native type (effective when type=text) | `string` | `'text'` |
| resize | Resize-handle direction for textarea | `'none' \| 'both' \| 'horizontal' \| 'vertical'` | — |
| name / form | Native name / form attributes | `string` | — |
| tabindex | Native tabindex | `number \| string` | — |
| inputStyle | Inline style of the input element | `Record<string, string>` | — |
| label | Floating label (mutually exclusive with placeholder) | `string` | — |
| themeVars / bgPattern / sx | Theme overrides | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | `(val, e)` |
| change | Emitted when the value changes | — |
| focus | Emitted on focus | — |
| blur | Emitted on blur | — |
| clear | Emitted when cleared | — |
| keydown | Emitted on keydown | — |

## Form integration

When placed inside a `LhFormItem` and validation fails, the native control automatically gets `aria-invalid="true"`.
