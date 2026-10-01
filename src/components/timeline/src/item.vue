<template>
  <li
    :class="itemClasses"
    :style="itemStyle"
  >
    <div class="lh-timeline__dot-wrap">
      <span
        class="lh-timeline__dot"
        aria-hidden="true"
      >
        <slot name="dot" />
      </span>
    </div>
    <div class="lh-timeline__body">
      <span
        v-if="props.timestamp || $slots.timestamp"
        class="lh-timeline__timestamp"
      >
        <slot name="timestamp">{{ props.timestamp }}</slot>
      </span>
      <div class="lh-timeline__content">
        <slot />
      </div>
    </div>
  </li>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhTimelineItem' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhTimelineItem } from './index'
import type { LhTimelineItemProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  timestamp: { type: String, default: undefined },
  type: {
    type: String as PropType<'primary' | 'success' | 'warning' | 'danger'>,
    default: undefined,
  },
  hollow: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhTimelineItemProps['sx']>, default: undefined },
})

const { itemClasses, itemStyle } = useLhTimelineItem(props)
</script>
