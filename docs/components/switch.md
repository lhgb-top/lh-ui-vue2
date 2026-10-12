# Switch 开关

开关切换。支持 active/inactive 文案、loading 与 disabled；点击与 Enter/Space 键均可切换。

<DemoBlock name="switch" title="开关" :height="130">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 20px">
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap">
      <LhSwitch v-model="on" active-text="夜模式" inactive-text="昼模式" name="theme" />
      <LhSwitch v-model="loading" loading />
      <LhSwitch v-model="on2" disabled />
    </div>
    <div class="demo-row" style="gap: 24px; flex-wrap: wrap; align-items: center">
      <LhSwitch v-model="s" size="small" active-text="小" />
      <LhSwitch v-model="m" size="medium" active-text="中" />
      <LhSwitch v-model="l" size="large" active-text="大" />
    </div>
    <p class="demo-note">loading 态禁点且显示加载圈；name 透传到原生 input。</p>
  </div>
</template>

<script>
export default {
  data: () => ({ on: true, on2: false, loading: true, s: true, m: true, l: false }),
}
</script>
```
<!-- gen-demo-code:end -->
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

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| input | v-model 事件 | — |
| change | 开关状态变化时触发 | `(value)` |

## 无障碍

根元素 `role="switch"` + `aria-checked/disabled`；置于 `LhFormItem` 内校验失败时 `aria-invalid`。
