<template>
  <div
    :class="rowClasses"
    :style="rowStyle"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhRow' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhRow } from './index'
import type { LhRowJustify, LhRowAlign, LhRowProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  justify: { type: String as PropType<LhRowJustify>, default: 'start' },
  align: { type: String as PropType<LhRowAlign>, default: 'top' },
  gutter: { type: [Number, Array] as PropType<number | [number, number]>, default: 0 },
  wrap: { type: Boolean, default: true },
  sx: { type: [Object, Array, String] as PropType<LhRowProps['sx']>, default: undefined },
})

const { rowClasses, rowStyle } = useLhRow(props)
</script>
