<template>
  <div
    ref="placeholderRef"
    class="lh-affix-placeholder"
    :style="placeholderStyle"
  >
    <div
      :class="affixClasses"
      :style="affixStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhAffix' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhAffix } from './index'
import type { LhAffixProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  offsetTop: { type: Number, default: 0 },
  offsetBottom: { type: Number, default: 0 },
  target: { type: [String, Object] as PropType<string | HTMLElement>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhAffixProps['sx']>, default: undefined },
})

const emit = defineEmits(['change'])

const { placeholderRef, affixClasses, affixStyle, placeholderStyle } = useLhAffix(props, emit)
</script>
