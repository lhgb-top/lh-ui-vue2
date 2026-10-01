<template>
  <div
    v-if="props.loading"
    :class="skeletonClasses"
    :style="skeletonStyle"
    :aria-busy="true"
    aria-live="polite"
  >
    <LhSkeletonItem
      v-if="props.avatar"
      variant="circle"
      :animated="props.animated"
      class="lh-skeleton__avatar"
    />
    <div class="lh-skeleton__content">
      <LhSkeletonItem
        v-for="(width, i) in rowWidths"
        :key="i"
        variant="text"
        :animated="props.animated"
        :style="{ width }"
      />
    </div>
  </div>
  <!-- 2.7 模板编译器禁止 <slot> 作根（可能多节点）：真实内容包一层 display:contents 的中性容器 -->
  <div
    v-else
    style="display: contents"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhSkeleton' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import LhSkeletonItem from './item.vue'
import { useLhSkeleton } from './index'
import type { LhSkeletonProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  loading: { type: Boolean, default: true },
  rows: { type: Number, default: 3 },
  avatar: { type: Boolean, default: false },
  animated: { type: Boolean, default: true },
  sx: { type: [Object, Array, String] as PropType<LhSkeletonProps['sx']>, default: undefined },
})

const { skeletonClasses, rowWidths, skeletonStyle } = useLhSkeleton(props)
</script>
