<template>
  <!--
    Vue2 无 Teleport（红线 #4）：host 根元素在 mounted 时挂到 body。
    v-if 放在 container 层，host 始终存在（可移动、可被 Vue 正常销毁）。
  -->
  <div ref="rootRef" class="lh-dialog__host">
    <transition name="lh-dialog-fade">
      <div v-if="isVisible" class="lh-dialog__container">
        <div class="lh-dialog__overlay" @click="handleModalClick"></div>
        <div
          ref="dialogRef"
          :class="['lh-dialog__wrapper', `lh-dialog__wrapper--${props.position}`]"
          :style="dialogStyle"
        >
          <div
            :class="['lh-dialog', { 'lh-dialog--fullscreen': props.fullscreen }]"
            :style="mergedDialogContentStyle"
            role="dialog"
            aria-modal="true"
            :aria-label="props.title || t('dialog.ariaLabel', '对话框')"
          >
            <!-- Header -->
            <div
              ref="headerRef"
              :class="['lh-dialog__header', { 'lh-dialog__header--draggable': props.draggable }]"
              @mousedown="handleHeaderMousedown"
            >
              <slot name="header">
                <span class="lh-dialog__title">{{ props.title }}</span>
              </slot>
              <button
                v-if="props.showClose !== false"
                class="lh-dialog__close"
                :aria-label="t('dialog.close', '关闭')"
                @click="close"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z"
                  />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="lh-dialog__body">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="lh-dialog__footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
// 2.7 自定义 model：modelValue prop + input 事件
export default { name: 'LhDialog', model: { prop: 'modelValue', event: 'input' } }
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useLhDialog } from './index'
import type { LhDialogProps } from './types'
import { t } from '../../../locale'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: [String, Number] as PropType<string | number>, default: '480px' },
  fullscreen: { type: Boolean, default: false },
  showClose: { type: Boolean, default: true },
  closeOnClickModal: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  draggable: { type: Boolean, default: false },
  center: { type: Boolean, default: false },
  position: {
    type: String as PropType<'top' | 'center' | 'bottom'>,
    default: 'center',
  },
  lockScroll: { type: Boolean, default: true },
  beforeClose: { type: Function as PropType<(done: () => void) => void>, default: undefined },
  top: { type: String, default: '15vh' },
  zIndex: { type: Number, default: undefined },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhDialogProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'open', 'close', 'opened', 'closed'])

const {
  dialogRef,
  headerRef,
  rootRef,
  isVisible,
  close,
  handleModalClick,
  dialogStyle,
  dialogContentStyle,
  dialogDragStyle,
  componentStyle,
  handleHeaderMousedown,
} = useLhDialog(props, emit)

const mergedDialogContentStyle = computed(() => ({
  ...dialogContentStyle.value,
  ...dialogDragStyle.value,
  ...componentStyle.value,
}))

defineExpose({
  close,
  isVisible,
})
</script>
