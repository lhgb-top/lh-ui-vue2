# Form

A `LhForm` + `LhFormItem` composition: model validation (required / custom rules), error display (`role="alert"`), automatic `aria-invalid` linkage on child controls, and whole-form `validate` / `resetFields`.

<DemoBlock name="form" title="Form validation" :height="390">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div style="max-width: 640px">
    <LhForm ref="form" :model="form" :rules="rules" label-width="80px">
      <LhFormItem prop="name" label="姓名" required>
        <LhInput v-model="form.name" placeholder="请输入姓名" />
      </LhFormItem>
      <LhFormItem prop="genre" label="题材">
        <LhSelect v-model="form.genre" :options="genres" placeholder="请选择" />
      </LhFormItem>
      <LhFormItem>
        <LhButton type="primary" @click="submit">提交</LhButton>
        <LhButton @click="reset">重置</LhButton>
      </LhFormItem>
    </LhForm>
    <p class="demo-note">提交结果：{{ result }}</p>
    <p class="demo-note" style="margin-top: 16px">label-position="top"：</p>
    <LhForm :model="form2" label-position="top">
      <LhFormItem prop="name" label="姓名">
        <LhInput v-model="form2.name" placeholder="标签在上方" />
      </LhFormItem>
    </LhForm>
    <p class="demo-note" style="margin-top: 16px">inline 行内表单：</p>
    <LhForm :model="form3" inline>
      <LhFormItem prop="name" label="姓名">
        <LhInput v-model="form3.name" placeholder="行内" />
      </LhFormItem>
      <LhFormItem prop="genre" label="题材">
        <LhSelect v-model="form3.genre" :options="genres" placeholder="行内" />
      </LhFormItem>
    </LhForm>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: { name: '', genre: '' },
    form2: { name: '' },
    form3: { name: '', genre: '' },
    rules: { name: [{ required: true, message: '' }] },
    genres: [
      { value: 'shan', label: '山水' },
      { value: 'hua', label: '花鸟' },
    ],
    result: '（未提交）',
  }),
  methods: {
    submit() {
      const form = this.$refs.form
      form.validate().then((ok) => {
        this.result = ok ? '校验通过 ✓' : '校验失败：姓名必填'
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.result = '（已重置）'
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Form Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| model | The data model (required) | `Record<string, unknown>` | — |
| rules | Validation rules, keyed by prop path | `Record<string, LhFormRule[]>` | — |
| labelPosition | Label position | `'left' \| 'right' \| 'top'` | `'right'` |
| labelWidth | Label width | `string \| number` | — |
| inline | Inline layout | `boolean` | `false` |

## FormItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| prop | The model field path (supports deep paths like `a.b`) | `string` | — |
| label / required / rules | Label, required asterisk, and local rules (merged with the form's rules) | — | — |

## Methods

| Method | Description |
| --- | --- |
| `validate()` | Validates all fields (registered items plus rules overrides); returns `Promise<boolean>` |
| `validateField(prop)` | Validates a single field |
| `resetFields()` / `resetField(prop)` | Restores the initial values (snapshotted at mount from the rules keys) |

::: tip
The validation linkage of form controls is automatic: a control injects the LhFormItem context and renders `aria-invalid` whenever errorMessage is non-empty — no manual wiring needed.
:::
