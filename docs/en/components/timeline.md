# Timeline

A chronological display of a sequence of events. `alternate` mode arranges items left and right alternately; items support types and hollow nodes.

<DemoBlock name="timeline" title="Timeline" :height="560">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| mode | Layout mode (alternate alternates left and right) | `'left' \| 'alternate'` | `'left'` |
| sx | sx shorthand layout props | — | — |

## TimelineItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| timestamp | Timestamp | `string` | — |
| type | Node type | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | Hollow node | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## Slots

The TimelineItem default slot holds the item content.
