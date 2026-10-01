<template>
  <ol
    :class="rootClasses"
    :style="rootStyle"
    role="list"
  >
    <slot></slot>
  </ol>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhSteps' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhSteps } from './index'
import type { LhStepsProps, LhStepsDirection, LhStepStatus } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  current: { type: Number, default: 0 },
  direction: { type: String as PropType<LhStepsDirection>, default: 'horizontal' },
  clickable: { type: Boolean, default: false },
  status: { type: String as PropType<LhStepStatus>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhStepsProps['sx']>, default: undefined },
})

const emit = defineEmits(['update:current', 'change'])

const { rootClasses, rootStyle } = useLhSteps(props, emit)
</script>
