# Switch 开关

开关切换。支持 active/inactive 文案、loading 与 disabled；点击与 Enter/Space 键均可切换。

<DemoBlock name="switch" title="开关" :height="180">

```vue
<template>
  <LhSwitch v-model="on" active-text="夜模式" inactive-text="昼模式" />
</template>
```

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 开关状态（model: modelValue/input） | `boolean` | `false` |
| activeText / inactiveText | 两侧文案 | `string` | `''` |
| loading | 加载中（禁点 + 圈） | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| name | 原生 name | `string` | `''` |

## Events

`input`（v-model）、`change (value)`。

## 无障碍

根元素 `role="switch"` + `aria-checked/disabled`；置于 `LhFormItem` 内校验失败时 `aria-invalid`。
