<template>
  <div class="lh-radio-group" :class="`lh-radio-group--${props.size}`" role="radiogroup">
    <slot></slot>
  </div>
</template>

<script lang="ts">
// 2.7 自定义 model：modelValue prop + input 事件
export default { name: 'LhRadioGroup', model: { prop: 'modelValue', event: 'input' } }
</script>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import type { PropType } from 'vue'
import type { LhRadioSize } from './types'
import { LH_RADIO_GROUP_KEY } from './types'

const props = defineProps({
  modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
  size: { type: String as PropType<LhRadioSize>, default: 'medium' },
})

const emit = defineEmits(['input', 'change'])

function onChange(value: unknown) {
  emit('input', value)
  emit('change', value)
}

// 红线 #6：computed 引用而非 props 快照
provide(LH_RADIO_GROUP_KEY, {
  modelValue: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  name: computed(() => props.name),
  size: computed(() => props.size),
  onChange,
})
</script>
