# Steps 步骤条

引导用户完成分步流程。水平/垂直方向、可点击导航与状态覆盖。

<DemoBlock name="steps" title="步骤条" :height="640">

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| current | 当前步骤索引（:current.sync，事件名 update:current，0 起） | `number` | `0` |
| direction | 方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | 步骤是否可点击导航 | `boolean` | `false` |
| status | 整体覆盖所有步骤的状态（用于自定义展示） | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| sx | sx 快速布局属性 | — | — |

## Step Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 步骤标题（也可用 title 插槽） | `string` | — |
| description | 步骤描述（也可用 description 插槽） | `string` | — |
| icon | 自定义图标类名（未传时 finish/error 用勾叉，其余显示序号） | `string` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击步骤项（需 clickable 开启才有意义） | `(索引)` |
