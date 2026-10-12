# Collapse

Collapsible content regions, with accordion mode (only one panel open at a time) and `v-model` control.

<DemoBlock name="collapse" title="Collapse panels" :height="420">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 420px">
    <p class="demo-note">可同时展开多个</p>
    <LhCollapse v-model="actives">
      <LhCollapseItem name="song" title="宋代">
        <p class="demo-note">范宽《溪山行旅图》、郭熙《早春图》。</p>
      </LhCollapseItem>
      <LhCollapseItem name="yuan" title="元代">
        <p class="demo-note">黄公望《富春山居图》。</p>
      </LhCollapseItem>
      <LhCollapseItem name="ming" title="明代" disabled>
        <p class="demo-note">禁用面板。</p>
      </LhCollapseItem>
    </LhCollapse>
    <p class="demo-note">手风琴模式（同时只展开一个）</p>
    <LhCollapse v-model="active" accordion>
      <LhCollapseItem name="gongbi" title="工笔">
        <p class="demo-note">精细勾勒，层层渲染。</p>
      </LhCollapseItem>
      <LhCollapseItem name="xieyi" title="写意">
        <p class="demo-note">笔墨放纵，不求形似。</p>
      </LhCollapseItem>
    </LhCollapse>
    <p class="demo-note">当前展开：{{ Array.isArray(actives) ? actives.join('、') : actives }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({ actives: ['song'], active: 'gongbi' }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Collapse Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Currently active panel(s) (controlled modelValue prop) | `string \| number \| (string \| number)[]` | — |
| accordion | Accordion mode: only one panel open at a time | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## CollapseItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| name | Unique panel identifier (required) | `string \| number` | — |
| title | Panel title (or use the title slot) | `string` | `''` |
| disabled | Disable expansion | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| change | Emitted when the active panel(s) change | The active value(s): a single value in accordion mode, otherwise an array |
