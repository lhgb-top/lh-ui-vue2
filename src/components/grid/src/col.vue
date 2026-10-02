<template>
  <div
    :class="colClasses"
    :style="colStyle"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhCol' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhCol } from './index'
import type { LhColProps } from './types'

const props = defineProps({
  span: { type: Number, default: undefined },
  offset: { type: Number, default: undefined },
  push: { type: Number, default: undefined },
  pull: { type: Number, default: undefined },
  xs: { type: [Number, Object] as PropType<LhColProps['xs']>, default: undefined },
  sm: { type: [Number, Object] as PropType<LhColProps['sm']>, default: undefined },
  md: { type: [Number, Object] as PropType<LhColProps['md']>, default: undefined },
  lg: { type: [Number, Object] as PropType<LhColProps['lg']>, default: undefined },
  xl: { type: [Number, Object] as PropType<LhColProps['xl']>, default: undefined },
  sizes: { type: Object as PropType<LhColProps['sizes']>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhColProps['sx']>, default: undefined },
})

const { colClasses, colStyle } = useLhCol(props)
</script>
