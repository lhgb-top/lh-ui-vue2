<template>
  <div
    :class="segmentedClasses"
    :style="segmentedStyle"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <button
      v-for="(option, index) in normalized"
      :key="String(option.value)"
      type="button"
      class="lh-segmented__option"
      :class="{ 'lh-segmented__option--checked': option.value === value }"
      role="radio"
      :aria-checked="option.value === value ? 'true' : 'false'"
      :disabled="disabled || option.disabled || undefined"
      :tabindex="tabStops[index] ? 0 : -1"
      @click="select(option)"
    >{{ option.label }}</button>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
// v-model 走 modelValue prop / input 事件
export default {
  name: 'LhSegmented',
  model: { prop: 'modelValue', event: 'input' },
}
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhSegmented } from './index'
import type { LhSegmentedProps, LhSegmentedInput } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  modelValue: {
    type: [String, Number] as PropType<LhSegmentedProps['modelValue']>,
    default: undefined,
  },
  options: { type: Array as PropType<LhSegmentedInput[]>, required: true },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhSegmentedProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const { normalized, value, tabStops, select, handleKeydown, segmentedClasses, segmentedStyle } =
  useLhSegmented(props, emit)
</script>
