# Select 选择器

下拉选择。默认下拉挂载到 body（fixed 定位跟随触发器），可用 `popperContainer` 指定容器或传空原地渲染；完整键盘导航（方向键 / Enter / ESC）。

<DemoBlock name="select" title="选择器" :height="280">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 18px">
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhSelect v-model="value" :options="options" placeholder="请选择题材" clearable name="theme" />
      <LhSelect v-model="value" :options="options" size="small" />
      <LhSelect v-model="value" :options="options" size="large" />
    </div>
    <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
      <LhSelect v-model="value" :options="options" disabled />
      <LhSelect v-model="empty" :options="[]" aria-label="空数据">
        <template #empty>
          <span class="demo-note">插槽 empty：暂无匹配题材</span>
        </template>
      </LhSelect>
    </div>
    <p class="demo-note">当前值：{{ value || '（未选择）' }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    value: 'ink',
    empty: undefined,
    options: [
      { value: 'ink', label: '水墨' },
      { value: 'paper', label: '宣纸' },
      { value: 'seal', label: '印章' },
      { value: 'blank', label: '留白' },
    ],
  }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 选中值（与 option.value 匹配；受控 modelValue prop） | `unknown` | — |
| options | 选项列表 `{ value, label, disabled? }` | `LhSelectOption[]` | `[]` |
| placeholder | 占位文案，缺省用语言包 | `string` | `t('select.placeholder')` |
| clearable | 显示清空按钮 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | 禁用 | `boolean` | `false` |
| popperContainer | 下拉挂载目标 | `'body' \| HTMLElement \| string` | `'body'` |
| name / ariaLabel | 无障碍标注 | `string` | — |
| sx | sx 快速布局 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| input | v-model 事件 | — |
| change | 选中值变化时触发 | `(value, option)` |
| clear | 清空时触发 | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| empty | 无数据时内容（默认「暂无数据」） |

## 无障碍

触发器 `role="combobox"` + `aria-expanded/haspopup`，下拉 `role="listbox"`，选项 `role="option"`；
置于 `LhFormItem` 内校验失败时自动 `aria-invalid`。
