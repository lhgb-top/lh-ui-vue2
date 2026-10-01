<template>
  <div
    :class="dividerClasses"
    :style="dividerStyle"
    :role="role"
    :aria-orientation="ariaOrientation"
  >
    <span
      v-if="hasContent"
      class="lh-divider__label"
    >
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhDivider' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhDivider } from './index'
import type { LhDividerProps, LhDividerDirection, LhDividerLabelPosition } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  direction: { type: String as PropType<LhDividerDirection>, default: 'horizontal' },
  dashed: { type: Boolean, default: false },
  labelPosition: { type: String as PropType<LhDividerLabelPosition>, default: 'center' },
  borderStyle: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhDividerProps['sx']>, default: undefined },
})

const { hasContent, dividerClasses, role, ariaOrientation, dividerStyle } = useLhDivider(props)
</script>
