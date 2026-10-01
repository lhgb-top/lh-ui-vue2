<template>
  <div
    :class="wrapperClasses"
    :style="sxStyle"
  >
    <button
      v-if="controls"
      type="button"
      class="lh-input-number__decrease"
      :disabled="isDecreaseDisabled || disabled"
      @click="handleDecrement"
    >
      <span class="lh-input-number__icon">-</span>
    </button>
    <input
      :value="displayValue"
      :class="['lh-input-number__input', `lh-input-number--${size}`]"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      :aria-invalid="!!formItem?.errorMessage || undefined"
      @change="handleInputChange"
      @keydown.up.prevent="handleDecrement"
      @keydown.down.prevent="handleIncrement"
    />
    <button
      v-if="controls"
      type="button"
      class="lh-input-number__increase"
      :disabled="isIncreaseDisabled || disabled"
      @click="handleIncrement"
    >
      <span class="lh-input-number__icon">+</span>
    </button>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
// v-model 走 modelValue prop / input 事件
export default {
  name: 'LhInputNumber',
  model: { prop: 'modelValue', event: 'input' },
}
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhInputNumber } from './index'
import type { LhComponentSize } from '@lh-ui/share/core/shared'
import type { LhInputNumberProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  modelValue: { type: Number as PropType<number | null>, default: null },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
  stepStrictly: { type: Boolean, default: false },
  precision: { type: Number, default: undefined },
  disabled: { type: Boolean, default: false },
  size: { type: String as PropType<LhComponentSize>, default: 'medium' },
  controls: { type: Boolean, default: true },
  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  sx: { type: [Object, Array, String] as PropType<LhInputNumberProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const {
  sxStyle,
  formItem,
  wrapperClasses,
  isDecreaseDisabled,
  isIncreaseDisabled,
  displayValue,
  handleIncrement,
  handleDecrement,
  handleInputChange,
} = useLhInputNumber(props, emit)
</script>
