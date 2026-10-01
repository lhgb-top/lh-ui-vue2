<template>
  <div
    class="lh-skeleton-item"
    :class="[`lh-skeleton-item--${props.variant}`, { 'lh-skeleton-item--animated': props.animated }]"
    :style="itemStyle"
    aria-hidden="true"
  ></div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhSkeletonItem' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhSkeletonItem } from './index'
import type { LhSkeletonItemProps, LhSkeletonVariant } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  variant: { type: String as PropType<LhSkeletonVariant>, default: 'text' },
  animated: { type: Boolean, default: true },
  sx: { type: [Object, Array, String] as PropType<LhSkeletonItemProps['sx']>, default: undefined },
})

const { itemStyle } = useLhSkeletonItem(props)
</script>
