# Segmented 分段选择

分段控制器。选项支持字符串快捷写法与 `{ value, label, disabled }` 对象写法；block 可撑满容器宽度。

<DemoBlock name="segmented" title="分段选择" :height="330">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 20px">
    <LhSegmented v-model="view" :options="['列表', '网格', '图册']" />
    <p class="demo-note">字符串数组快捷写法：{{ view }}</p>
    <LhSegmented v-model="dynasty" :options="options" />
    <p class="demo-note">对象写法（含 disabled 项）：{{ dynasty }}</p>
    <LhSegmented v-model="view" :options="['列表', '网格', '图册']" disabled />
    <LhSegmented v-model="view" :options="['列表', '网格', '图册']" block />
    <p class="demo-note">block 撑满容器宽度</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    view: '列表',
    dynasty: 'tang',
    options: [
      { value: 'tang', label: '唐' },
      { value: 'song', label: '宋' },
      { value: 'yuan', label: '元' },
      { value: 'ming', label: '明', disabled: true },
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
| v-model | 当前值（model: modelValue/input） | `string \| number` | — |
| options | 选项（字符串或对象，必填） | `(string \| number \| { value, label, disabled? })[]` | — |
| disabled | 整体禁用 | `boolean` | `false` |
| block | 撑满容器宽度 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## Events

`input`（v-model，参数 `(val)`）、`change (val)`。

## 无障碍

根元素 `role="radiogroup"`，每项 `role="radio"` + `aria-checked`；键盘 ←/→ 切换。
