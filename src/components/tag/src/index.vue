<template>
  <span :class="tagClasses" :style="sxStyle" @click="handleClick">
    <span class="lh-tag__text">
      <slot></slot>
    </span>
    <button
      v-if="props.closable"
      class="lh-tag__close"
      :disabled="props.disabled"
      :aria-label="t('tag.close')"
      @click.stop="handleClose"
    >
      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z"
        />
      </svg>
    </button>
  </span>
</template>

<script lang="ts">
export default { name: 'LhTag' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhTag } from './index'
import type { LhTagProps, LhTagType, LhTagSize } from './types'

const props = defineProps({
  type: { type: String as PropType<LhTagType>, default: 'default' },
  size: { type: String as PropType<LhTagSize>, default: 'medium' },
  closable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  hit: { type: Boolean, default: false },
  onClose: { type: Function as PropType<(e: Event) => void>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhTagProps['sx']>, default: undefined },
})

const emit = defineEmits(['click', 'close'])

const { sxStyle, tagClasses, handleClick, handleClose, t } = useLhTag(props, emit)
</script>
