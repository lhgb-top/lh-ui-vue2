<template>
  <label
    class="lh-radio"
    :class="[
      `lh-radio--${effectiveSize}`,
      {
        'lh-radio--checked': isChecked,
        'lh-radio--disabled': isDisabled,
      },
    ]"
    :style="sxStyle"
  >
    <input
      class="lh-radio__input"
      type="radio"
      :name="group?.name.value || props.name"
      :value="props.value"
      :checked="isChecked"
      :disabled="isDisabled"
      :aria-invalid="!!formItem?.errorMessage || undefined"
      @change="handleChange"
    />
    <span class="lh-radio__box" aria-hidden="true"></span>
    <span v-if="props.label || $slots.default" class="lh-radio__label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<script lang="ts">
// 2.7 自定义 model：modelValue prop + input 事件（value prop 保留给单选框取值）
export default { name: 'LhRadio', model: { prop: 'modelValue', event: 'input' } }
</script>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { PropType } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhRadioProps, LhRadioSize } from './types'
import { LH_RADIO_GROUP_KEY } from './types'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'

const props = defineProps({
  modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
  value: { type: null as unknown as PropType<unknown>, default: undefined },
  label: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
  size: { type: String as PropType<LhRadioSize>, default: 'medium' },
  sx: { type: [Object, Array, String] as PropType<LhRadioProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

// sx 快速布局属性：转内联样式作用于根元素
const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

const group = inject(LH_RADIO_GROUP_KEY, null)
const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)
const isInGroup = Boolean(group && props.value !== undefined)
const effectiveSize = computed(() => group?.size.value || props.size)
const isDisabled = computed(() => Boolean(props.disabled || group?.disabled.value))
const isChecked = computed(() => {
  if (isInGroup && group) return Object.is(group.modelValue.value, props.value)
  return Object.is(props.modelValue, props.value)
})

function handleChange() {
  if (isDisabled.value) return
  if (isInGroup && group) {
    group.onChange(props.value)
    return
  }
  emit('input', props.value)
  emit('change', props.value)
}
</script>
