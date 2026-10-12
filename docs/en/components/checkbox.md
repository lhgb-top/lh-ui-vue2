# Checkbox

Used standalone or grouped (`LhCheckboxGroup`). Inside a group, members are identified by their `value`; the group's disabled / size props apply to every child.

<DemoBlock name="checkbox" title="Checkbox" :height="230">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 18px">
    <div class="demo-row" style="gap: 20px; flex-wrap: wrap">
      <LhCheckbox v-model="single" label="单独勾选" name="agree" />
      <LhCheckbox v-model="indeterminate" label="全选" indeterminate />
      <LhCheckbox v-model="disabledSingle" label="禁用" disabled />
    </div>
    <div>
      <LhCheckboxGroup v-model="picked" name="themes">
        <LhCheckbox label="山水" value="shan" />
        <LhCheckbox label="花鸟" value="hua" />
        <LhCheckbox label="人物" value="ren" disabled />
      </LhCheckboxGroup>
    </div>
    <div>
      <LhCheckboxGroup v-model="picked" disabled>
        <LhCheckbox label="山水" value="shan" />
        <LhCheckbox label="花鸟" value="hua" />
      </LhCheckboxGroup>
      <p class="demo-note">整组 disabled</p>
    </div>
    <div class="demo-row" style="gap: 20px; flex-wrap: wrap; align-items: center">
      <LhCheckboxGroup v-model="picked" size="small">
        <LhCheckbox label="山水" value="shan" />
      </LhCheckboxGroup>
      <LhCheckboxGroup v-model="picked" size="large">
        <LhCheckbox label="山水" value="shan" />
      </LhCheckboxGroup>
    </div>
    <p class="demo-note">组值：{{ JSON.stringify(picked) }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    single: true,
    indeterminate: true,
    disabledSingle: false,
    picked: ['shan'],
  }),
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Checkbox Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Checked state (model: modelValue/input) | `boolean` | `false` |
| value | Member value within a group | `unknown` | — |
| label | Label text (or use the default slot) | `string` | — |
| indeterminate | Indeterminate state (applied to the native control) | `boolean` | `false` |
| disabled / size / name | — | — | — |

## CheckboxGroup Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Array of checked values | `unknown[]` | `[]` |
| disabled / size / name | Apply to every child checkbox | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | — |
| change | Emitted when the checked state changes | `(checked)` |

The group exposes events of the same name, aggregating child changes.
