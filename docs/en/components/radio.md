# Radio

Used standalone (v-model matches the radio's own value) or grouped (`LhRadioGroup` manages the selected value).

<DemoBlock name="radio" title="Radio" :height="210">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Selected value (model: modelValue/input) | `unknown` | — |
| value | Value of this radio | `unknown` | — |
| label | Label text (or use the default slot) | `string` | — |
| disabled / size / name | — | — | — |

## RadioGroup Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Selected value of the group | `unknown` | — |
| disabled / size / name | Apply to every child radio | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the selected value changes | `(value)` |

`change` is suppressed in the disabled state.
