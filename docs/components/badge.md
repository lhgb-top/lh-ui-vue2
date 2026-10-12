# Badge 徽标

图标/按钮角落的数值或状态标记。支持类型配色、`max` 截断、红点、零值显隐与位置偏移。

<DemoBlock name="badge" title="徽标" :height="320">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 40px; flex-wrap: wrap">
      <LhBadge :value="12" type="primary">
        <LhButton>未读消息</LhButton>
      </LhBadge>
      <LhBadge :value="999" :max="99">
        <LhButton>超出 max 截断</LhButton>
      </LhBadge>
      <LhBadge is-dot>
        <LhButton>红点模式</LhButton>
      </LhBadge>
      <LhBadge :value="0" :show-zero="true">
        <LhButton>showZero</LhButton>
      </LhBadge>
      <LhBadge :value="0">
        <LhButton>零值默认隐藏</LhButton>
      </LhBadge>
      <LhBadge :value="3" type="danger" size="small">
        <LhButton>small 尺寸</LhButton>
      </LhBadge>
    </div>
    <p class="demo-note">offset 微调位置 / hidden 隐藏 / content 自定义文案</p>
    <div class="demo-row" style="gap: 40px; flex-wrap: wrap">
      <LhBadge content="热" type="danger" :offset="[6, 4]">
        <LhButton>offset 偏移</LhButton>
      </LhBadge>
      <LhBadge :value="5" :hidden="hidden">
        <LhButton>hidden 开关</LhButton>
      </LhBadge>
      <LhButton size="small" @click="hidden = !hidden">{{ hidden ? '显示徽标' : '隐藏徽标' }}</LhButton>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    hidden: false,
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型配色 | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'danger'` |
| value | 徽标数值（超出 max 时截断为 `max+`） | `string \| number` | — |
| size | 尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| max | 数值上限 | `number` | — |
| isDot | 红点模式（忽略 value） | `boolean` | `false` |
| hidden | 隐藏徽标 | `boolean` | `false` |
| offset | 相对默认位置的偏移 `[x, y]` | `[number, number]` | — |
| showZero | value 为 0 时是否仍展示 | `boolean` | `false` |
| content | 自定义文案（覆盖 value） | `string` | — |
| sx | sx 快速布局属性 | — | — |

## Slots

默认插槽：徽标挂载的宿主元素。
