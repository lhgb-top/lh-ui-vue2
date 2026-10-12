# Empty 空状态

空数据时的占位展示。可用默认插槽放操作按钮，也可传图片地址替换默认插画。

<DemoBlock name="empty" title="空状态" :height="420">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <LhEmpty description="暂无画作记录" />
    <LhEmpty>
      <template #default>
        <LhButton type="primary" @click="reload">重新加载</LhButton>
      </template>
    </LhEmpty>
    <p class="demo-note">未传 description 时取语言包默认文案；下方为自定义图片示例。</p>
    <LhEmpty
      description="自定义图片地址"
      image="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='160'%20height='120'%3E%3Crect%20width='160'%20height='120'%20fill='%23e8e2d5'/%3E%3Cpath%20d='M0%2086%20Q40%2060%2080%2086%20T160%2086%20V120%20H0%20Z'%20fill='%23c9c2b2'/%3E%3Ctext%20x='50%'%20y='50'%20font-size='16'%20fill='%232b4c7c'%20text-anchor='middle'%20font-family='serif'%3E%E6%B0%B4%E5%A2%A8%E7%95%99%E7%99%BD%3C/text%3E%3C/svg%3E"
    />
  </div>
</template>

<script>
export default {
  methods: {
    reload() {
      alert('演示：触发重新加载')
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| description | 空状态描述文案（未传时取语言包 empty.description） | `string` | — |
| image | 自定义图片 URL（替代默认内联插画） | `string` | — |
| sx | sx 快速布局属性 | — | — |

## Slots

默认插槽：描述下方的操作区（如「重新加载」按钮）。
