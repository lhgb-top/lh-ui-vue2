# Skeleton

A placeholder while content loads. `LhSkeleton` is a composed placeholder (avatar + text rows), while `LhSkeletonItem` lets you assemble blocks freely by shape.

<DemoBlock name="skeleton" title="Skeleton" :height="480">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| loading | Whether it is in the loading state (false renders the default slot's real content) | `boolean` | `false` |
| rows | Number of text rows | `number` | — |
| avatar | Whether to include a circular avatar placeholder | `boolean` | `false` |
| animated | Whether to enable the animation | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## SkeletonItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| variant | Placeholder block shape | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | Whether to enable the animation | `boolean` | `false` |
| sx | sx shorthand layout props | — | — |

## Slots

The LhSkeleton default slot holds the real content rendered once `loading=false`.
