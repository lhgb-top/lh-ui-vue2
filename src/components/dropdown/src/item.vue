<template>
  <li
    ref="rootRef"
    :class="itemClass"
    role="menuitem"
    :tabindex="disabled ? -1 : active ? 0 : -1"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="handleClick"
  >
    <slot></slot>
  </li>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhDropdownItem' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type { LhDropdownItemRecord } from './types'
import { LH_DROPDOWN_KEY } from './types'
import { getDropdownItemClass } from '@lh-ui/share/core/dropdown'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：本组件 Props 就地声明
 */
const props = defineProps({
  command: { type: [String, Number] as PropType<string | number>, default: undefined },
  disabled: { type: Boolean, default: false },
  divided: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const rootRef = ref<HTMLElement | null>(null)
const ctx = inject(LH_DROPDOWN_KEY, null)

const record: LhDropdownItemRecord = {
  get el() {
    return rootRef.value as HTMLElement
  },
  command: props.command,
  disabled: props.disabled,
  divided: props.divided,
}

const index = computed(() => (ctx ? ctx.items.value.indexOf(record) : -1))
const active = computed(() => index.value !== -1 && index.value === ctx?.activeIndex.value)

onMounted(() => {
  ctx?.registerItem(record)
})

onBeforeUnmount(() => {
  ctx?.unregisterItem(record)
})

const itemClass = computed(() =>
  getDropdownItemClass({ disabled: props.disabled, divided: props.divided }),
)

function handleClick() {
  if (props.disabled) return
  emit('click', props.command)
  ctx?.onItemClick(props.command)
}
</script>
