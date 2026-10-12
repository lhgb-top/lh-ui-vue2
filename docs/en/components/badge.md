# Badge

A numeric or status marker on the corner of an icon or button. Supports type-based coloring, `max` truncation, a dot mode, zero-value visibility, and position offsets.

<DemoBlock name="badge" title="Badge" :height="320">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Type-based coloring | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'danger'` |
| value | Badge value (truncated to `max+` when it exceeds max) | `string \| number` | — |
| size | Size | `'small' \| 'default' \| 'large'` | `'default'` |
| max | Numeric upper bound | `number` | — |
| isDot | Dot mode (ignores value) | `boolean` | `false` |
| hidden | Hide the badge | `boolean` | `false` |
| offset | Offset from the default position, `[x, y]` | `[number, number]` | — |
| showZero | Whether to still display when value is 0 | `boolean` | `false` |
| content | Custom label (overrides value) | `string` | — |
| sx | sx shorthand layout props | — | — |

## Slots

The default slot is the host element the badge is attached to.
