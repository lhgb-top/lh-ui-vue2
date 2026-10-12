# InputNumber 计数器

数字输入框。支持 min/max 边界、step 步进与 stepStrictly 倍数约束、precision 小数位、加减按钮开关与三档尺寸；键盘 ↑/↓ 同样步进。

<DemoBlock name="input-number" title="计数器" :height="320">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 20px">
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="count" :min="1" :max="99" :step="1" placeholder="数量" name="count" />
      <span class="demo-note">min=1 max=99，受控值：{{ count }}</span>
    </div>
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="price" :step="0.5" :precision="2" :min="0" />
      <span class="demo-note">step=0.5 precision=2：{{ price }}</span>
    </div>
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="strict" :step="10" step-strictly />
      <span class="demo-note">stepStrictly：输入框失焦后归到 10 的倍数</span>
    </div>
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="noControls" :controls="false" placeholder="无步进器" />
      <LhInputNumber v-model="disabledVal" disabled />
    </div>
    <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center">
      <LhInputNumber v-model="sized" size="small" />
      <LhInputNumber v-model="sized" size="medium" />
      <LhInputNumber v-model="sized" size="large" />
    </div>
    <p class="demo-note">controls=false 隐藏加减按钮；输入框聚焦时方向键（↑/↓）也可步进。</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    count: 6,
    price: 12.5,
    strict: 20,
    noControls: undefined,
    disabledVal: 3,
    sized: 8,
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值（model: modelValue/input） | `number \| null` | `null` |
| min | 最小值（低于则归到 min） | `number` | — |
| max | 最大值（超过则归到 max） | `number` | — |
| step | 步进值 | `number` | `1` |
| stepStrictly | 输入值必须是 step 的倍数（失焦归位） | `boolean` | `false` |
| precision | 小数位数（超出则四舍五入） | `number` | — |
| controls | 显示加减按钮 | `boolean` | `true` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | 禁用 | `boolean` | `false` |
| placeholder | 占位文案 | `string` | — |
| name | 原生 name | `string` | — |
| sx | sx 快速布局属性 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| input | v-model 事件 | `(val)` |
| change | 值变化时触发 | `(val)` |

## 无障碍

加减按钮为原生 `button`；输入框聚焦时 ↑/↓ 步进；置于 `LhFormItem` 内校验失败时 `aria-invalid`。
