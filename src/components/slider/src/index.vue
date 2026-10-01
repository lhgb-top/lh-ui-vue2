<template>
  <div
    ref="sliderRef"
    :class="wrapperClasses"
    :aria-invalid="!!formItem?.errorMessage || undefined"
    :style="sxStyle"
  >
    <div
      v-if="marksList.length"
      class="lh-slider__marks"
    >
      <span
        v-for="mark in marksList"
        :key="mark.value"
        class="lh-slider__mark"
        :style="{ left: getMarkPosition(mark.value) + '%' }"
      >
        {{ mark.label }}
      </span>
    </div>
    <div class="lh-slider__track">
      <div
        class="lh-slider__bar"
        :style="barStyle"
      />
      <div
        class="lh-slider__button-wrapper"
        :style="button1Style"
        @mousedown="onDragStart($event, 0)"
        @touchstart.prevent="onDragStart($event, 0)"
      >
        <div class="lh-slider__button" />
      </div>
      <div
        v-if="range"
        class="lh-slider__button-wrapper"
        :style="button2Style"
        @mousedown="onDragStart($event, 1)"
        @touchstart.prevent="onDragStart($event, 1)"
      >
        <div class="lh-slider__button" />
      </div>
    </div>
    <div
      v-if="showInput"
      class="lh-slider__input"
    >
      <span class="lh-slider__input-text">{{ displayValue }}</span>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
// v-model 走 modelValue prop / input 事件
export default {
  name: 'LhSlider',
  model: { prop: 'modelValue', event: 'input' },
}
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhSlider } from './index'
import type { LhComponentSize } from '@lh-ui/share/core/shared'
import type { LhSliderProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  modelValue: {
    type: [Number, Array] as unknown as PropType<LhSliderProps['modelValue']>,
    default: null,
  },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
  range: { type: Boolean, default: false },
  showInput: { type: Boolean, default: false },
  size: { type: String as PropType<LhComponentSize>, default: 'medium' },
  marks: { type: Object as PropType<Record<number, string>>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhSliderProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const {
  sxStyle,
  sliderRef,
  formItem,
  marksList,
  displayValue,
  wrapperClasses,
  barStyle,
  button1Style,
  button2Style,
  getMarkPosition,
  onDragStart,
} = useLhSlider(props, emit)
</script>
