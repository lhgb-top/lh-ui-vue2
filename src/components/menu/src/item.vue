<template>
  <li
    :class="itemClasses"
    :style="itemStyle"
    role="menuitem"
    :tabindex="props.disabled ? -1 : 0"
    :aria-disabled="props.disabled || undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </li>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhMenuItem' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhMenuItem } from './index'
import type { LhMenuItemProps } from './types'

const props = defineProps({
  index: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhMenuItemProps['sx']>, default: undefined },
})

const emit = defineEmits(['click'])

const { itemClasses, itemStyle, handleClick, handleKeydown } = useLhMenuItem(props, emit)
</script>
