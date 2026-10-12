<template>
  <div
    ref="triggerRef"
    class="lh-popover"
    :style="triggerStyle"
    :aria-expanded="isVisible ? 'true' : 'false'"
    :aria-haspopup="isModal ? 'dialog' : undefined"
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
      class="lh-popover__host"
    >
      <transition name="lh-popover-fade">
        <div
          v-if="isVisible"
          :id="popoverId"
          ref="popperRef"
          :class="popperClass"
          :style="mergedPopperStyle"
          role="dialog"
          :aria-modal="isModal ? 'true' : undefined"
          :aria-labelledby="hasTitle ? titleId : undefined"
          @mouseenter="onPopperMouseenter"
          @mouseleave="onPopperMouseleave"
        >
          <div
            v-if="hasTitle"
            :id="titleId"
            class="lh-popover__title"
          >
            <slot name="title">{{ title }}</slot>
          </div>
          <div class="lh-popover__content">
            <slot name="content"></slot>
          </div>
          <div
            v-if="arrow !== false"
            class="lh-popover__arrow"
          ></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhPopover' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhPopover } from './index'
import type { LhPopoverProps, LhPopoverPlacement, LhPopoverTrigger } from './types'
import { isValidElementOrSelector } from '../../../utils/element-prop'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  placement: { type: String as PropType<LhPopoverPlacement>, default: 'top' },
  flip: { type: Boolean, default: true },
  trigger: { type: String as PropType<LhPopoverTrigger>, default: 'click' },
  title: { type: String, default: undefined },
  visible: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: false },
  arrow: { type: Boolean, default: true },
  width: { type: [String, Number] as PropType<LhPopoverProps['width']>, default: undefined },
  popperClass: { type: String, default: undefined },
  teleportTarget: {
    validator: isValidElementOrSelector,
    default: 'body',
  } as PropType<LhPopoverProps['teleportTarget']>,
  showAfter: { type: Number, default: undefined },
  hideAfter: { type: Number, default: undefined },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhPopoverProps['sx']>, default: undefined },
})

const emit = defineEmits(['update:visible', 'show', 'hide'])

const {
  popoverId,
  titleId,
  triggerRef,
  popperRef,
  popperHostRef,
  isVisible,
  isModal,
  hasTitle,
  popperClass,
  mergedPopperStyle,
  triggerStyle,
  show,
  hide,
  toggle,
  onTriggerMouseenter,
  onTriggerMouseleave,
  onTriggerClick,
  onTriggerFocusin,
  onTriggerFocusout,
  onPopperMouseenter,
  onPopperMouseleave,
} = useLhPopover(props, emit)

defineExpose({ isVisible, show, hide, toggle })
</script>
