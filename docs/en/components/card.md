# Card

A container for aggregating information: a three-part structure of title, content, and actions, with support for a loading skeleton and a hover shadow.

<DemoBlock name="card" title="Card" :height="300">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Title (the header slot is an alternative) | `string` | `''` |
| shadow | When the shadow is shown | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | Makes the whole card clickable (carries button keyboard semantics) | `boolean` | `false` |
| loading | Loading state: the content area is occupied by a skeleton | `boolean` | `false` |
| themeVars / bgPattern / sx | Theme overrides | — | — |

## Slots

| Slot | Description |
| --- | --- |
| header | Title area (alternative to the title prop) |
| default | Content area |
| actions | Actions area (bottom) |
