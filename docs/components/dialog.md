# Dialog 对话框

模态对话框。Vue2 无 Teleport：弹层宿主在 mounted 时挂到 body（fixed 定位），组件保持完整响应式连接；遮罩点击 / ESC / 关闭按钮 / `beforeClose` 均可控制关闭，支持拖拽与滚动锁定。

<DemoBlock name="dialog" title="对话框" :height="200">

```vue
<template>
  <LhButton type="primary" @click="visible = true">打开对话框</LhButton>
  <LhDialog v-model="visible" title="题跋" width="420px">
    <p>正文内容</p>
    <template #footer>
      <LhButton @click="visible = false">取消</LhButton>
      <LhButton type="primary" @click="visible = false">确定</LhButton>
    </template>
  </LhDialog>
</template>
```

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 显隐（model: modelValue/input；也兼容 `:visible.sync` 之外的标准 v-model 用法） | `boolean` | `false` |
| title | 标题 | `string` | `''` |
| width | 宽度 | `string \| number` | `'480px'` |
| position | 位置 | `'top' \| 'center' \| 'bottom'` | `'center'` |
| fullscreen | 全屏 | `boolean` | `false` |
| showClose | 显示关闭按钮 | `boolean` | `true` |
| closeOnClickModal / closeOnPressEscape | 遮罩 / ESC 关闭 | `boolean` | `true` |
| draggable | 头部拖拽（视口边界约束） | `boolean` | `false` |
| lockScroll | 锁定 body 滚动 | `boolean` | `true` |
| beforeClose | 关闭前拦截，调 `done()` 真正关闭 | `(done) => void` | — |
| top | 顶部距离（position=top 时生效） | `string` | `'15vh'` |
| zIndex / themeVars / bgPattern / sx | 层级与主题覆盖 | — | — |

## Events

`input`（v-model）、`open`、`opened`、`close`、`closed`

## Slots

`default`（正文）、`header`（自定义标题）、`footer`（底部操作区）

## 实例方法

`close()`、`isVisible`（defineExpose）。
