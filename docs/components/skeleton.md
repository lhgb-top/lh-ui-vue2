# Skeleton 骨架屏

内容加载过程中的占位。`LhSkeleton` 组合式占位（头像 + 文本行），`LhSkeletonItem` 按形状自由拼装。

<DemoBlock name="skeleton" title="骨架屏" :height="480">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col">
    <div class="demo-row" style="gap: 24px; align-items: flex-start; flex-wrap: wrap">
      <div style="width: 260px">
        <p class="demo-note">avatar + rows + animated</p>
        <LhSkeleton :loading="loading" :rows="3" avatar animated>
          <div>
            <strong>溪山行旅图</strong>
            <p>范宽·北宋。雨点皴写山石，气势雄壮。</p>
          </div>
        </LhSkeleton>
      </div>
      <div style="width: 260px">
        <p class="demo-note">SkeletonItem 自由组合形状</p>
        <LhSkeletonItem variant="rect" style="width: 100%; height: 120px" animated />
        <LhSkeletonItem variant="text" style="margin-top: 12px" animated />
        <div class="demo-row" style="gap: 12px; margin-top: 12px">
          <LhSkeletonItem variant="circle" style="width: 40px; height: 40px" animated />
          <LhSkeletonItem variant="text" style="flex: 1" animated />
        </div>
      </div>
    </div>
    <p class="demo-note">loading=false 时渲染真实内容</p>
    <LhSkeleton :loading="false" :rows="2">
      <p>这是真实内容：loading 关闭后骨架屏让位给插槽。</p>
    </LhSkeleton>
    <LhButton size="small" style="margin-top: 12px" @click="toggle">
      {{ loading ? '关闭加载态' : '重新加载' }}
    </LhButton>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true,
  }),
  methods: {
    toggle() {
      this.loading = !this.loading
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Skeleton Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否处于加载态（false 时渲染 default 插槽的真实内容） | `boolean` | `false` |
| rows | 文本行数 | `number` | — |
| avatar | 是否包含圆形头像占位 | `boolean` | `false` |
| animated | 是否开启动画 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## SkeletonItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variant | 占位块形状 | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | 是否开启动画 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## Slots

LhSkeleton 默认插槽：`loading=false` 时渲染的真实内容。
