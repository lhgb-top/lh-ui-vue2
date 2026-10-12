# Collapse 折叠面板

可展开 / 收起的内容区域，支持手风琴模式（同时只展开一个）与 `v-model` 受控。

<DemoBlock name="collapse" title="折叠面板" :height="420">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前激活的面板（受控 modelValue prop） | `string \| number \| (string \| number)[]` | — |
| accordion | 手风琴模式：同时只展开一个 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## CollapseItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 面板唯一标识（必填） | `string \| number` | — |
| title | 标题（也可用 title 插槽） | `string` | `''` |
| disabled | 禁用展开 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 当前激活面板变化时触发 | 当前激活值，手风琴为单值，否则为数组 |
