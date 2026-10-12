# Transfer 穿梭框

双列表穿梭选择。`v-model` 绑定**左侧（源）键**——值为空时全部数据在右侧（目标），穿梭即增删源键；`disabled` 的项不可移动。

<DemoBlock name="transfer" title="穿梭框" :height="630">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div style="max-width: 640px">
    <LhTransfer v-model="sourceKeys" :data="data" />
    <p class="demo-note">v-model 为左侧（源）键：{{ sourceKeys.join('、') || '（空）' }}</p>
    <LhTransfer v-model="sourceKeys" :data="data" disabled />
    <p class="demo-note">disabled 整组禁用（按钮与勾选框均不可点）</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    sourceKeys: ['ink', 'paper'],
    data: [
      { key: 'ink', label: '水墨' },
      { key: 'paper', label: '宣纸' },
      { key: 'brush', label: '狼毫' },
      { key: 'seal', label: '印章', disabled: true },
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
| data | 全量数据 | `LhTransferItem[]` | `[]` |
| v-model | 左侧（源）键列表（受控 value prop）；未传时内部兜底为空即全部在右 | `Array<string \| number>` | — |
| disabled | 禁用 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## Events

`input`（v-model）、`change (sourceKeys, direction)`

## 无障碍

两侧列表 `role="listbox"` + 选项 `role="option"` + `aria-selected`；
穿梭按钮 `aria-label` 标明方向与数量，禁用态置 `aria-disabled`，支持键盘勾选与触发移动。
