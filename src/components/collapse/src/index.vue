<template>
  <div
    :class="collapseClasses"
    :style="collapseStyle"
  >
    <slot />
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
// v-model 走 modelValue prop / input 事件（Vue2 无 update:modelValue 事件）
export default {
  name: 'LhCollapse',
  model: { prop: 'modelValue', event: 'input' },
}
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhCollapse } from './index'
import type { LhCollapseProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  modelValue: {
    type: [String, Number, Array] as unknown as PropType<LhCollapseProps['modelValue']>,
    default: undefined,
  },
  accordion: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhCollapseProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const { collapseClasses, collapseStyle } = useLhCollapse(props, emit)
</script>
