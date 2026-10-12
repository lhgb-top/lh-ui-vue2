# Timeline 时间线

按时间顺序展示事项流转。`alternate` 模式左右交替排列，条目支持类型与空心节点。

<DemoBlock name="timeline" title="时间线" :height="560">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <p class="demo-note">mode="left"（默认）</p>
    <LhTimeline>
      <LhTimelineItem timestamp="2026-09-01" type="primary">启动「宋画全集」数字化</LhTimelineItem>
      <LhTimelineItem timestamp="2026-09-10" type="success">完成 120 幅高清采集</LhTimelineItem>
      <LhTimelineItem timestamp="2026-09-20" type="warning" hollow>校色复核发现 3 处偏差</LhTimelineItem>
      <LhTimelineItem timestamp="2026-10-01" type="danger">复核完成，重新发布</LhTimelineItem>
    </LhTimeline>
    <p class="demo-note">mode="alternate"（左右交替）</p>
    <LhTimeline mode="alternate">
      <LhTimelineItem timestamp="北宋" type="primary">范宽《溪山行旅图》</LhTimelineItem>
      <LhTimelineItem timestamp="北宋" hollow>郭熙《早春图》</LhTimelineItem>
      <LhTimelineItem timestamp="元代" type="success">黄公望《富春山居图》</LhTimelineItem>
    </LhTimeline>
  </div>
</template>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Timeline Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 布局模式（alternate 左右交替） | `'left' \| 'alternate'` | `'left'` |
| sx | sx 快速布局属性 | — | — |

## TimelineItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| timestamp | 时间戳 | `string` | — |
| type | 节点类型 | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | 空心节点 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## Slots

TimelineItem 默认插槽：条目内容。
