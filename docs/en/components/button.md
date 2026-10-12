# Button

Basic action button. Covers type / size / plain / block / round / circle / loading variants, and can also render as an `<a>` link.

<DemoBlock name="button" title="Button variants">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row">
      <LhButton>默认按钮</LhButton>
      <LhButton type="primary">主要按钮</LhButton>
      <LhButton type="success">成功</LhButton>
      <LhButton type="warning">警告</LhButton>
      <LhButton type="danger">危险</LhButton>
    </div>
    <div class="demo-row">
      <LhButton type="primary" plain>朴素按钮</LhButton>
      <LhButton type="primary" round>圆角按钮</LhButton>
      <LhButton type="primary" circle icon="lh-icon-search" />
      <LhButton type="primary" loading>加载中</LhButton>
      <LhButton type="primary" disabled>禁用</LhButton>
    </div>
    <div class="demo-row">
      <LhButton size="small">小型</LhButton>
      <LhButton size="medium">默认尺寸</LhButton>
      <LhButton size="large">大型</LhButton>
      <LhButton type="primary" block style="max-width: 200px">块级（block）</LhButton>
    </div>
    <div class="demo-row">
      <LhButton icon="lh-icon-search">图标按钮</LhButton>
      <LhButton native-type="submit" type="primary">原生 type=submit</LhButton>
      <LhButton href="https://lh-ui.lhgb.top" target="_blank">链接按钮（href）</LhButton>
    </div>
  </div>
</template>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Button type | `'default' \| 'primary'` etc. (LH_BUTTON_TYPE_CONST) | `'default'` |
| size | Size; falls back to ConfigProvider when not set | `'small' \| 'medium' \| 'large'` | — |
| loading | Loading state (disables clicks and shows a spinner) | `boolean` | `false` |
| disabled | Disabled | `boolean` | `false` |
| plain / block / round / circle | Shape modifiers | `boolean` | `false` |
| icon | Built-in icon class name | `string` | `''` |
| nativeType | Native type | `'button' \| 'submit' \| 'reset'` | `'button'` |
| href / target | Renders as an `<a>` when href is passed | `string` | `''` / `'_self'` |
| themeVars / bgPattern / sx | Theme overrides (see the theming section) | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| click | Not clickable while loading or disabled | `(e: MouseEvent)` |

## Slots

| Slot | Description |
| --- | --- |
| default | Button text |
| icon | Custom icon (overrides the default `<i>`) |
