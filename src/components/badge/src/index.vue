<template>
  <div
    class="lh-badge"
    :class="badgeClasses"
    :style="sxStyle"
  >
    <slot></slot>
    <transition name="lh-badge-zoom">
      <!-- 2.7 会移除 false 值属性：显式写 'true'/'false' 字符串，保持与 Vue3 渲染一致 -->
      <sup
        v-if="shouldShow"
        class="lh-badge__content"
        :style="badgeStyle"
        :aria-hidden="props.isDot ? 'true' : 'false'"
      >
        <span v-if="!props.isDot">{{ displayValue }}</span>
      </sup>
    </transition>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhBadge' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhBadge } from './index'
import type { LhBadgeProps, LhBadgeType, LhBadgeSize, LhBadgeOffset } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  type: { type: String as PropType<LhBadgeType>, default: 'danger' },
  value: { type: [String, Number] as PropType<string | number>, default: undefined },
  size: { type: String as PropType<LhBadgeSize>, default: 'medium' },
  max: { type: Number, default: 99 },
  isDot: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  offset: { type: Array as unknown as PropType<LhBadgeOffset>, default: undefined },
  showZero: { type: Boolean, default: false },
  content: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhBadgeProps['sx']>, default: undefined },
})

const { sxStyle, shouldShow, displayValue, badgeClasses, badgeStyle } = useLhBadge(props)
</script>
