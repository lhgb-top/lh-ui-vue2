<template>
  <div
    class="lh-statistic"
    :style="sxStyle"
  >
    <div
      v-if="props.title || $slots.title"
      class="lh-statistic__title"
    >
      <slot name="title">{{ props.title }}</slot>
    </div>
    <div class="lh-statistic__content">
      <span
        v-if="props.prefix || $slots.prefix"
        class="lh-statistic__prefix"
      >
        <slot name="prefix">{{ props.prefix }}</slot>
      </span>
      <span
        class="lh-statistic__value"
        aria-live="polite"
      >{{ displayValue }}</span>
      <span
        v-if="props.suffix || $slots.suffix"
        class="lh-statistic__suffix"
      >
        <slot name="suffix">{{ props.suffix }}</slot>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhStatistic' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhStatistic } from './index'
import type { LhStatisticProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  title: { type: String, default: undefined },
  value: { type: [Number, String] as PropType<number | string>, required: true },
  precision: { type: Number, default: 0 },
  separator: { type: String, default: ',' },
  prefix: { type: String, default: undefined },
  suffix: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhStatisticProps['sx']>, default: undefined },
})

const { sxStyle, displayValue } = useLhStatistic(props)
</script>
