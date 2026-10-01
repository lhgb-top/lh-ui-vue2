<template>
  <div
    :class="spaceClasses"
    :style="spaceStyle"
    role="presentation"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhSpace' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhSpace } from './index'
import type { LhSpaceProps, LhSpaceAlignment, LhSpaceSizeInput } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  direction: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  size: { type: [String, Number, Array] as unknown as PropType<LhSpaceSizeInput>, default: 'medium' },
  wrap: { type: Boolean, default: true },
  alignment: { type: String as PropType<LhSpaceAlignment>, default: 'start' },
  sx: { type: [Object, Array, String] as PropType<LhSpaceProps['sx']>, default: undefined },
})

const { spaceClasses, spaceStyle } = useLhSpace(props)
</script>
