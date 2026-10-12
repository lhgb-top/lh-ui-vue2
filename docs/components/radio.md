# Radio 单选框

单独使用（v-model 匹配自身 value）或成组使用（`LhRadioGroup` 管理选中值）。

<DemoBlock name="radio" title="单选框" :height="210">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 18px">
    <div>
      <LhRadioGroup v-model="style" name="painting-style">
        <LhRadio label="工笔" value="gongbi" />
        <LhRadio label="写意" value="xieyi" />
        <LhRadio label="泼墨" value="pomo" disabled />
      </LhRadioGroup>
    </div>
    <div>
      <LhRadioGroup v-model="style" disabled>
        <LhRadio label="工笔" value="gongbi" />
        <LhRadio label="写意" value="xieyi" />
      </LhRadioGroup>
      <p class="demo-note">整组 disabled</p>
    </div>
    <div class="demo-row" style="gap: 20px; flex-wrap: wrap; align-items: center">
      <LhRadioGroup v-model="style" size="small">
        <LhRadio label="工笔" value="gongbi" />
      </LhRadioGroup>
      <LhRadioGroup v-model="style" size="large">
        <LhRadio label="工笔" value="gongbi" />
      </LhRadioGroup>
    </div>
    <div>
      <LhRadio v-model="standalone" label="独立单选（value 透传）" :value="true" />
      <p class="demo-note">当前画风：{{ style }}；独立值：{{ String(standalone) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({ style: 'xieyi', standalone: false }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Radio Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 选中取值（model: modelValue/input） | `unknown` | — |
| value | 本单选框取值 | `unknown` | — |
| label | 文案（或用默认插槽） | `string` | — |
| disabled / size / name | — | — | — |

## RadioGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 组选中值 | `unknown` | — |
| disabled / size / name | 对子项生效 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| input | v-model 事件 | — |
| change | 选中值变化时触发 | `(value)` |

disabled 状态下 change 被拦截。
