<template>
  <div
    ref="triggerRef"
    class="lh-popconfirm"
    :style="triggerStyle"
    :aria-expanded="isVisible ? 'true' : 'false'"
    aria-haspopup="dialog"
    @mouseenter="onTriggerMouseenter"
    @mouseleave="onTriggerMouseleave"
    @click="onTriggerClick"
    @focusin="onTriggerFocusin"
    @focusout="onTriggerFocusout"
  >
    <slot></slot>
    <!-- 2.7 无 Teleport：host 根元素 mounted 时移到 body（v-if 放在 popper 层） -->
    <div
      ref="popperHostRef"
      class="lh-popconfirm__host"
    >
      <transition name="lh-popconfirm-fade">
        <div
          v-if="isVisible"
          :id="popconfirmId"
          ref="popperRef"
          :class="popperClass"
          :style="mergedPopperStyle"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          @mouseenter="onPopperMouseenter"
          @mouseleave="onPopperMouseleave"
        >
          <div class="lh-popconfirm__main">
            <LhIcon
              v-if="showIcon"
              :name="iconName"
              class="lh-popconfirm__icon"
              aria-hidden="true"
            />
            <div
              :id="titleId"
              class="lh-popconfirm__title"
            >
              <slot name="content">{{ title }}</slot>
            </div>
          </div>
          <div class="lh-popconfirm__actions">
            <LhButton
              size="small"
              @click="handleCancel"
            >
              {{ cancelLabel }}
            </LhButton>
            <LhButton
              size="small"
              :type="confirmButtonType"
              @click="handleConfirm"
            >
              {{ confirmLabel }}
            </LhButton>
          </div>
          <div class="lh-popconfirm__arrow"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhPopconfirm' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhPopconfirm } from './index'
import LhIcon from '../../icon'
import LhButton from '../../button'
import type {
  LhPopconfirmProps,
  LhPopconfirmPlacement,
  LhPopconfirmType,
  LhPopconfirmTrigger,
} from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  type: { type: String as PropType<LhPopconfirmType>, default: 'warning' },
  placement: { type: String as PropType<LhPopconfirmPlacement>, default: 'top' },
  trigger: { type: String as PropType<LhPopconfirmTrigger>, default: 'click' },
  title: { type: String, default: undefined },
  confirmText: { type: String, default: undefined },
  cancelText: { type: String, default: undefined },
  confirmButtonType: { type: String as PropType<'default' | 'primary'>, default: 'primary' },
  visible: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: false },
  showIcon: { type: Boolean, default: true },
  popperClass: { type: String, default: undefined },
  teleportTarget: {
    type: [String, Object] as PropType<LhPopconfirmProps['teleportTarget']>,
    default: 'body',
  },
  showAfter: { type: Number, default: undefined },
  hideAfter: { type: Number, default: undefined },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhPopconfirmProps['sx']>, default: undefined },
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'show', 'hide'])

const {
  popconfirmId,
  titleId,
  triggerRef,
  popperRef,
  popperHostRef,
  isVisible,
  popperClass,
  mergedPopperStyle,
  triggerStyle,
  iconName,
  confirmLabel,
  cancelLabel,
  show,
  hide,
  toggle,
  handleConfirm,
  handleCancel,
  onTriggerMouseenter,
  onTriggerMouseleave,
  onTriggerClick,
  onTriggerFocusin,
  onTriggerFocusout,
  onPopperMouseenter,
  onPopperMouseleave,
} = useLhPopconfirm(props, emit)

defineExpose({ isVisible, show, hide, toggle })
</script>
