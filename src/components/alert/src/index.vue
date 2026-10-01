<template>
  <div
    v-if="visible"
    :class="alertClasses"
    :style="alertStyle"
    :role="alertRole"
  >
    <LhIcon
      v-if="props.showIcon"
      :name="iconName"
      class="lh-alert__icon"
    />
    <div class="lh-alert__content">
      <span
        v-if="$slots.title || props.title"
        class="lh-alert__title"
      >
        <slot name="title">{{ props.title }}</slot>
      </span>
      <p class="lh-alert__description">
        <slot></slot>
      </p>
    </div>
    <button
      v-if="props.closable"
      type="button"
      class="lh-alert__close"
      :aria-label="props.closeLabel || t('alert.close', '关闭警告')"
      @click="handleClose"
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
      >
        <path
          fill="currentColor"
          d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhAlert' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import LhIcon from '../../icon'
import { useLhAlert } from './index'
import { t } from '../../../locale'
import type { LhAlertProps, LhAlertType } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  type: { type: String as PropType<LhAlertType>, default: 'info' },
  title: { type: String, default: undefined },
  closable: { type: Boolean, default: false },
  showIcon: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  closeLabel: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhAlertProps['sx']>, default: undefined },
})

const emit = defineEmits(['close'])

const { visible, alertClasses, alertRole, iconName, alertStyle, handleClose } = useLhAlert(
  props,
  emit,
)
</script>
