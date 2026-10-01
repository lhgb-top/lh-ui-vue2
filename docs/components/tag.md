# Tag 标签

轻量标签。type 语义色 + round/hit 形态 + 可关闭。

<DemoBlock name="tag" title="标签" :height="160">

```vue
<template>
  <LhTag>默认</LhTag>
  <LhTag type="primary">主要</LhTag>
  <LhTag type="danger" closable @close="onClose">可关闭</LhTag>
  <LhTag type="info" round>圆角</LhTag>
</template>
```

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 语义色 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| closable | 显示关闭按钮（aria-label 走语言包） | `boolean` | `false` |
| disabled | 禁用（关闭按钮拦截） | `boolean` | `false` |
| round / hit | 圆角 / 描边强调 | `boolean` | `false` |
| onClose | 关闭回调（与 close 事件并存） | `(e: Event) => void` | — |
| sx | sx 快速布局 | — | — |

## Events

`click`、`close (e)`。
