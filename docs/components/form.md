# Form 表单

`LhForm` + `LhFormItem` 组合：模型校验（required/自定义规则）、错误展示（`role="alert"`）、子控件 `aria-invalid` 联动、整体 validate/resetFields。

<DemoBlock name="form" title="表单校验" :height="320">

```vue
<template>
  <LhForm ref="form" :model="form" :rules="rules" label-width="80px">
    <LhFormItem prop="name" label="姓名" required>
      <LhInput v-model="form.name" placeholder="请输入姓名" />
    </LhFormItem>
    <LhFormItem>
      <LhButton type="primary" @click="submit">提交</LhButton>
      <LhButton @click="reset">重置</LhButton>
    </LhFormItem>
  </LhForm>
</template>

<script>
export default {
  data: () => ({
    form: { name: '' },
    rules: { name: [{ required: true, message: '' }] },
  }),
  methods: {
    submit() {
      this.$refs.form.validate().then((ok) => console.log(ok ? '通过' : '失败'))
    },
    reset() {
      this.$refs.form.resetFields()
    },
  },
}
</script>
```

</DemoBlock>

## LhForm Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 数据模型（必传） | `Record<string, unknown>` | — |
| rules | 校验规则（键为 prop 路径） | `Record<string, LhFormRule[]>` | — |
| labelPosition | 标签位置 | `'left' \| 'right' \| 'top'` | `'right'` |
| labelWidth | 标签宽度 | `string \| number` | — |
| inline | 行内布局 | `boolean` | `false` |

## LhFormItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 对应 model 字段路径（支持 `a.b` 深层） | `string` | — |
| label / required / rules | 标签、必填星号、局部规则（与 form 规则合并） | — | — |

## 实例方法（defineExpose）

| 方法 | 说明 |
| --- | --- |
| `validate()` | 校验全部字段（注册项 + rules 覆盖项），返回 `Promise<boolean>` |
| `validateField(prop)` | 校验单个字段 |
| `resetFields()` / `resetField(prop)` | 恢复初始值（挂载时按 rules 键快照） |

::: tip
表单控件的校验失败联动是自动的：控件注入 LhFormItem 上下文，errorMessage 非空即渲染 `aria-invalid`，无需手动绑定。
:::
