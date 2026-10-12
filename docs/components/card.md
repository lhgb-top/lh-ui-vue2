# Card 卡片

信息聚合容器。标题、内容、操作区三段式结构，支持加载态骨架与悬停阴影。

<DemoBlock name="card" title="卡片" :height="300">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-row" style="align-items: flex-start">
    <LhCard title="溪山行旅图" style="width: 240px">
      <p class="demo-note">范宽·北宋。雨点皴写山石，气势雄壮。</p>
      <template #actions>
        <LhButton size="small">赏析</LhButton>
        <LhButton size="small" type="primary">收藏</LhButton>
      </template>
    </LhCard>
    <LhCard title="加载态" loading style="width: 240px">
      <p class="demo-note">内容区以骨架占位。</p>
    </LhCard>
    <LhCard title="可点击卡片" clickable shadow="hover" style="width: 240px">
      <p class="demo-note">shadow=hover 悬停浮起，clickable 承担 button 语义。</p>
    </LhCard>
    <LhCard style="width: 240px">
      <template #header>
        <span style="font-weight: 600">header 插槽标题</span>
      </template>
      <p class="demo-note">title 与 header 插槽二选一。</p>
    </LhCard>
  </div>
</template>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题（也可用 header 插槽） | `string` | `''` |
| shadow | 阴影显示时机 | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | 整卡可点击（承担 button 键盘语义） | `boolean` | `false` |
| loading | 加载态：内容区以骨架占位 | `boolean` | `false` |
| themeVars / bgPattern / sx | 主题覆盖 | — | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| header | 标题区（与 title prop 二选一） |
| default | 内容区 |
| actions | 操作区（底部） |
