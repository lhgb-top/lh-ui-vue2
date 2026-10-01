<template>
  <ol
    :class="timelineClasses"
    :style="timelineStyle"
  >
    <slot />
  </ol>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhTimeline' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhTimeline } from './index'
import type { LhTimelineProps, LhTimelineMode } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  mode: { type: String as PropType<LhTimelineMode>, default: 'left' },
  sx: { type: [Object, Array, String] as PropType<LhTimelineProps['sx']>, default: undefined },
})

const { timelineClasses, timelineStyle } = useLhTimeline(props)
</script>
