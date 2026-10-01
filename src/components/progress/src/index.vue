<template>
  <div
    :class="progressClasses"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="clamped"
    :aria-valuetext="text"
    :style="sxStyle"
  >
    <!-- 线形进度条 -->
    <template v-if="props.type === 'line'">
      <div
        class="lh-progress__bar"
        :style="{ height: `${props.strokeWidth}px` }"
      >
        <div
          class="lh-progress__bar-inner"
          :style="barStyle"
        ></div>
      </div>
      <div
        v-if="props.showText"
        class="lh-progress__text"
      >
        <slot
          name="text"
          :percentage="clamped"
        >
          {{ text }}
        </slot>
      </div>
    </template>

    <!-- 圆形进度环 -->
    <template v-else>
      <div
        class="lh-progress__circle"
        :style="{ width: `${props.width}px`, height: `${props.width}px` }"
      >
        <svg viewBox="0 0 100 100">
          <circle
            class="lh-progress__circle-track"
            cx="50"
            cy="50"
            :r="circleRadius"
            fill="none"
            :stroke-width="relativeStroke"
          />
          <circle
            class="lh-progress__circle-value"
            cx="50"
            cy="50"
            :r="circleRadius"
            fill="none"
            :stroke-width="relativeStroke"
            :stroke="trackColor"
            :stroke-dasharray="dasharray"
            stroke-linecap="round"
            :style="circleTransform"
          />
        </svg>
        <div
          v-if="props.showText"
          class="lh-progress__text lh-progress__circle-text"
        >
          <slot
            name="text"
            :percentage="clamped"
          >
            {{ text }}
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhProgress' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhProgress } from './index'
import type { LhProgressProps, LhProgressStatus, LhProgressType } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  percentage: { type: Number, required: true },
  type: { type: String as PropType<LhProgressType>, default: 'line' },
  status: { type: String as PropType<LhProgressStatus>, default: 'normal' },
  color: {
    type: [String, Function] as PropType<string | ((percentage: number) => string)>,
    default: undefined,
  },
  strokeWidth: { type: Number, default: 6 },
  width: { type: Number, default: 126 },
  showText: { type: Boolean, default: true },
  format: { type: Function as PropType<(percentage: number) => string>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhProgressProps['sx']>, default: undefined },
})

const {
  sxStyle,
  clamped,
  trackColor,
  text,
  progressClasses,
  barStyle,
  relativeStroke,
  circleRadius,
  dasharray,
  circleTransform,
} = useLhProgress(props)
</script>
