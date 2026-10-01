<template>
  <span
    :class="spinnerClasses"
    :style="spinnerStyle"
    aria-hidden="true"
  >
    <svg
      class="lh-spinner__circle"
      viewBox="0 0 50 50"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhSpinner' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhSpinner } from './index'
import type { LhSpinnerProps, LhSpinnerSize } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  size: { type: String as PropType<LhSpinnerSize>, default: 'medium' },
  color: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhSpinnerProps['sx']>, default: undefined },
})

const { spinnerClasses, spinnerStyle } = useLhSpinner(props)
</script>
