<template>
  <div class="lh-checkbox-group" :class="`lh-checkbox-group--${props.size}`" role="group">
    <slot></slot>
  </div>
</template>

<script lang="ts">
// 2.7 自定义 model：modelValue prop + input 事件
export default { name: 'LhCheckboxGroup', model: { prop: 'modelValue', event: 'input' } }
</script>

<script lang="ts" setup>
import { computed, provide, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { toggleCheckboxValue } from '@lh-ui/share/core/checkbox'
import type { LhCheckboxSize } from './types'
import { LH_CHECKBOX_GROUP_KEY } from './types'

const props = defineProps({
  modelValue: { type: Array as PropType<unknown[]>, default: () => [] },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
  size: { type: String as PropType<LhCheckboxSize>, default: 'medium' },
})

const emit = defineEmits(['input', 'change'])

const values = ref([...props.modelValue])

watch(
  () => props.modelValue,
  (nextValue) => {
    values.value = [...nextValue]
  },
)

function toggle(value: unknown, checked: boolean) {
  const nextValues = toggleCheckboxValue(values.value, value, checked)
  values.value = nextValues
  emit('input', nextValues)
  emit('change', nextValues)
}

// 红线 #6：computed 引用而非 props 快照
provide(LH_CHECKBOX_GROUP_KEY, {
  values,
  disabled: computed(() => props.disabled),
  name: computed(() => props.name),
  size: computed(() => props.size),
  toggle,
})
</script>
