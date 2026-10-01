<template>
  <div
    v-if="readonly"
    :class="rateClasses"
    :style="rateStyle"
    role="img"
    :aria-label="ariaText"
  >
    <span
      v-for="i in max"
      :key="i"
      class="lh-rate__star lh-rate__star--static"
      :class="`lh-rate__star--${fillOf(i)}`"
      aria-hidden="true"
    >{{ character ?? '★' }}</span>
    <span
      v-if="showScore"
      class="lh-rate__score"
    >{{ scoreText }}</span>
  </div>

  <div
    v-else
    :class="rateClasses"
    :style="rateStyle"
    role="radiogroup"
    :aria-label="ariaText"
    @keydown="handleKeydown"
  >
    <button
      v-for="i in max"
      :key="i"
      type="button"
      class="lh-rate__star"
      :class="`lh-rate__star--${fillOf(i)}`"
      role="radio"
      :aria-checked="value === i ? 'true' : 'false'"
      :aria-label="starAria(i)"
      :disabled="disabled || undefined"
      :tabindex="i === Math.ceil(value) || (value === 0 && i === 1) ? 0 : -1"
      @click="select(i, $event)"
    >{{ character ?? '★' }}</button>
    <span
      v-if="showScore"
      class="lh-rate__score"
    >{{ scoreText }}</span>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
// v-model 走 modelValue prop / input 事件
export default {
  name: 'LhRate',
  model: { prop: 'modelValue', event: 'input' },
}
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhRate } from './index'
import type { LhRateProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  allowHalf: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  character: { type: String, default: undefined },
  showScore: { type: Boolean, default: false },
  scoreTemplate: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhRateProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const {
  value,
  ariaText,
  starAria,
  scoreText,
  fillOf,
  select,
  handleKeydown,
  rateClasses,
  rateStyle,
} = useLhRate(props, emit)
</script>
