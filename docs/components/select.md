# Select 选择器

下拉选择。默认下拉挂载到 body（fixed 定位跟随触发器），可用 `popperContainer` 指定容器或传空原地渲染；完整键盘导航（方向键 / Enter / ESC）。

<DemoBlock name="select" title="选择器" :height="200">

```vue
<template>
  <LhSelect v-model="value" :options="options" placeholder="请选择题材" clearable />
</template>

<script>
export default {
  data: () => ({
    value: 'ink',
    options: [
      { value: 'ink', label: '水墨' },
      { value: 'paper', label: '宣纸' },
    ],
  }),
}
</script>
```

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 选中值（与 option.value 匹配） | `unknown` | — |
| options | 选项列表 `{ value, label, disabled? }` | `LhSelectOption[]` | `[]` |
| placeholder | 占位文案，缺省用语言包 | `string` | `t('select.placeholder')` |
| clearable | 显示清空按钮 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | 禁用 | `boolean` | `false` |
| popperContainer | 下拉挂载目标 | `'body' \| HTMLElement \| string` | `'body'` |
| name / ariaLabel | 无障碍标注 | `string` | — |
| sx | sx 快速布局 | — | — |

## Events

`input`（v-model）、`change (value, option)`、`clear`

## Slots

| 插槽 | 说明 |
| --- | --- |
| empty | 无数据时内容（默认「暂无数据」） |

## 无障碍

触发器 `role="combobox"` + `aria-expanded/haspopup`，下拉 `role="listbox"`，选项 `role="option"`；
置于 `LhFormItem` 内校验失败时自动 `aria-invalid`。
