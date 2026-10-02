<template>
  <section
    :class="layoutClasses"
    :style="layoutStyle"
  >
    <slot></slot>
  </section>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhLayout' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhLayout } from './index'
import type { LhLayoutProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  direction: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  sx: { type: [Object, Array, String] as PropType<LhLayoutProps['sx']>, default: undefined },
})

const { layoutClasses, layoutStyle } = useLhLayout(props)
</script>
