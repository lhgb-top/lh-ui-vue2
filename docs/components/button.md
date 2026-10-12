# Button 按钮

基础操作按钮。type/size/plain/block/round/circle/loading 等形态齐全，支持渲染为 `<a>` 链接。

<DemoBlock name="button" title="按钮形态">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `'default' \| 'primary'` 等（LH_BUTTON_TYPE_CONST） | `'default'` |
| size | 尺寸，不传则从 ConfigProvider 继承 | `'small' \| 'medium' \| 'large'` | — |
| loading | 加载状态（禁点 + spinner） | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| plain / block / round / circle | 形态修饰 | `boolean` | `false` |
| icon | 内置图标类名 | `string` | `''` |
| nativeType | 原生 type | `'button' \| 'submit' \| 'reset'` | `'button'` |
| href / target | 传入 href 渲染为 `<a>` | `string` | `''` / `'_self'` |
| themeVars / bgPattern / sx | 主题覆盖（见主题章节） | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | loading/disabled 时不可点击 | `(e: MouseEvent)` |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 按钮文本 |
| icon | 自定义图标（覆盖默认 `<i>`） |
