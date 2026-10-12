<template>
  <div
    :class="switchClasses"
    role="switch"
    :aria-checked="state.checked ? 'true' : 'false'"
    :aria-disabled="state.disabled ? 'true' : 'false'"
    :aria-invalid="!!formItem?.errorMessage || undefined"
    tabindex="0"
    :style="sxStyle"
    @click="toggle"
    @keyup.enter.space="handleKeyup"
  >
    <span class="lh-switch__core">
      <span v-if="state.loading" class="lh-switch__loading" />
    </span>
    <span v-if="state.activeText || state.inactiveText" class="lh-switch__label">
      {{ switchLabel }}
    </span>
  </div>
</template>

<script lang="ts">
// 2.7 自定义 model：modelValue prop + input 事件（v-model="x" 等价 :modelValue + @input）
export default { name: 'LhSwitch', model: { prop: 'modelValue', event: 'input' } }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhSwitch } from './index'
import type { LhSwitchProps, LhSwitchSize } from './types'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  name: { type: String, default: '' },
  size: { type: String as PropType<LhSwitchSize>, default: 'medium' },
  activeText: { type: String, default: '' },
  inactiveText: { type: String, default: '' },
  sx: { type: [Object, Array, String] as PropType<LhSwitchProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const { sxStyle, formItem, state, switchClasses, switchLabel, toggle, handleKeyup } =
  useLhSwitch(props, emit)
</script>
