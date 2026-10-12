# Steps

Guides users through a step-by-step flow. Horizontal and vertical directions, clickable navigation, and status override.

<DemoBlock name="steps" title="Steps" :height="640">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 680px; gap: 28px">
    <LhSteps :current="current">
      <LhStep title="采集" description="高清扫描入库" />
      <LhStep title="校色" description="色值基准比对" />
      <LhStep title="审校" description="专家复核" />
      <LhStep title="发布" description="上线数字展厅" />
    </LhSteps>
    <div class="demo-row" style="gap: 12px">
      <LhButton size="small" :disabled="current === 0" @click="current--">上一步</LhButton>
      <LhButton size="small" type="primary" :disabled="current === 3" @click="current++">下一步</LhButton>
    </div>
    <LhSteps :current="2" direction="vertical">
      <LhStep title="采集" description="已完成" />
      <LhStep title="校色" description="已完成" />
      <LhStep title="审校" description="进行中" />
      <LhStep title="发布" description="待处理" />
    </LhSteps>
    <LhSteps :current="1" status="error" :clickable="true" @click="onStepClick">
      <LhStep title="第一步" />
      <LhStep title="出错的一步" icon="lh-icon-user" />
      <LhStep title="第三步" />
    </LhSteps>
    <p class="demo-note">clickable 可点击导航；status="error" 覆盖整体状态；icon 自定义图标。</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    current: 1,
  }),
  methods: {
    onStepClick(index) {
      this.current = index
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Steps Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| current | Current step index (`:current.sync`, event name `update:current`, starting at 0) | `number` | `0` |
| direction | Direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | Whether steps can be clicked for navigation | `boolean` | `false` |
| status | Overrides the status of all steps (for custom display) | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| sx | sx shorthand layout prop | — | — |

## Step Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Step title (a title slot is also available) | `string` | — |
| description | Step description (a description slot is also available) | `string` | — |
| icon | Custom icon class name (when omitted, finish/error use a check or cross and the rest show the index) | `string` | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| click | Emitted when a step is clicked (only meaningful with `clickable` enabled) | `(index)` |
