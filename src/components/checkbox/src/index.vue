<template>
  <label
    class="lh-checkbox"
    :class="[
      `lh-checkbox--${effectiveSize}`,
      {
        'lh-checkbox--checked': isChecked,
        'lh-checkbox--disabled': isDisabled,
        'lh-checkbox--indeterminate': props.indeterminate,
      },
    ]"
    :style="sxStyle"
  >
    <input
      ref="inputRef"
      class="lh-checkbox__input"
      type="checkbox"
      :name="group?.name.value || props.name"
      :value="props.value"
      :checked="isChecked"
      :disabled="isDisabled"
      :aria-invalid="!!formItem?.errorMessage || undefined"
      @change="handleChange"
    />
    <span class="lh-checkbox__box" aria-hidden="true"></span>
    <span v-if="props.label || $slots.default" class="lh-checkbox__label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<script lang="ts">
// 2.7 自定义 model：modelValue prop + input 事件（value prop 保留给 group 成员值）
export default { name: 'LhCheckbox', model: { prop: 'modelValue', event: 'input' } }
</script>

<script lang="ts" setup>
import { computed, inject, ref, watchEffect } from 'vue'
import type { PropType } from 'vue'
import { isCheckboxChecked } from '@lh-ui/share/core/checkbox'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhCheckboxProps, LhCheckboxSize } from './types'
import { LH_CHECKBOX_GROUP_KEY } from './types'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  value: { type: null as unknown as PropType<unknown>, default: undefined },
  label: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
  name: { type: String, default: undefined },
  size: { type: String as PropType<LhCheckboxSize>, default: 'medium' },
  sx: { type: [Object, Array, String] as PropType<LhCheckboxProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

// sx 快速布局属性：转内联样式作用于根元素
const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

const group = inject(LH_CHECKBOX_GROUP_KEY, null)
const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)
const inputRef = ref<HTMLInputElement | null>(null)
const isInGroup = Boolean(group && props.value !== undefined)
const effectiveSize = computed(() => group?.size.value || props.size)
const isDisabled = computed(() => Boolean(props.disabled || group?.disabled.value))
const isChecked = computed(() => {
  if (isInGroup && group) return isCheckboxChecked(group.values.value, props.value)
  return Boolean(props.modelValue)
})

watchEffect(() => {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate
})

function handleChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  if (isInGroup && group) {
    group.toggle(props.value, checked)
    return
  }
  emit('input', checked)
  emit('change', checked)
}
</script>
