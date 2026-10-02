<template>
  <ul
    ref="rootRef"
    :class="menuClasses"
    :style="menuStyle"
    :role="props.mode === 'horizontal' ? 'menubar' : 'menu'"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </ul>
</template>

<script lang="ts">
// 2.7 自定义 model：modelValue prop + input 事件（红线 #7）
export default { name: 'LhMenu', model: { prop: 'modelValue', event: 'input' } }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhMenu } from './index'
import type { LhMenuMode } from '@lh-ui/share/core/menu'
import type { LhMenuProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  modelValue: { type: String, default: undefined },
  mode: { type: String as PropType<LhMenuMode>, default: 'vertical' },
  collapse: { type: Boolean, default: false },
  defaultOpeneds: { type: Array as PropType<string[]>, default: () => [] },
  openeds: { type: Array as PropType<string[]>, default: undefined },
  uniqueOpened: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhMenuProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'update:openeds', 'select', 'open', 'close'])

const { rootRef, handleKeydown, menuClasses, menuStyle } = useLhMenu(props, emit)
</script>
