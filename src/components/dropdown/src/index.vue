<template>
  <div
    ref="triggerRef"
    class="lh-dropdown"
    :style="triggerStyle"
    :aria-expanded="isVisible ? 'true' : 'false'"
    aria-haspopup="menu"
    @mouseenter="onTriggerMouseenter"
    @mouseleave="onTriggerMouseleave"
    @click="onTriggerClick"
    @contextmenu="onTriggerContextmenu"
  >
    <slot></slot>
    <!-- 2.7 无 Teleport：host 根元素 mounted 时移到 body（v-if 放在 menu 层） -->
    <div
      ref="popperHostRef"
      class="lh-dropdown__host"
    >
      <transition name="lh-dropdown-fade">
        <ul
          v-if="isVisible"
          :id="dropdownId"
          ref="popperRef"
          :class="menuClass"
          :style="mergedMenuStyle"
          role="menu"
          @mouseenter="onMenuMouseenter"
          @mouseleave="onMenuMouseleave"
          @keydown="onMenuKeydown"
        >
          <slot name="dropdown"></slot>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhDropdown' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { provide } from 'vue'
import { useLhDropdown } from './index'
import { LH_DROPDOWN_KEY } from './types'
import type { LhDropdownProps, LhDropdownPlacement, LhDropdownTrigger } from './types'
import { isValidElementOrSelector } from '../../../utils/element-prop'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  trigger: { type: String as PropType<LhDropdownTrigger>, default: 'click' },
  placement: { type: String as PropType<LhDropdownPlacement>, default: 'bottom-start' },
  flip: { type: Boolean, default: true },
  visible: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: false },
  hideOnClick: { type: Boolean, default: true },
  teleportTarget: {
    validator: isValidElementOrSelector,
    default: 'body',
  } as PropType<LhDropdownProps['teleportTarget']>,
  popperClass: { type: String, default: undefined },
  maxHeight: { type: [String, Number] as PropType<LhDropdownProps['maxHeight']>, default: undefined },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhDropdownProps['sx']>, default: undefined },
})

const emit = defineEmits(['update:visible', 'command', 'visible-change'])

const {
  dropdownId,
  triggerRef,
  popperRef,
  popperHostRef,
  isVisible,
  context,
  menuClass,
  mergedMenuStyle,
  triggerStyle,
  show,
  hide,
  toggle,
  onTriggerMouseenter,
  onTriggerMouseleave,
  onTriggerClick,
  onTriggerContextmenu,
  onMenuMouseenter,
  onMenuMouseleave,
  onMenuKeydown,
} = useLhDropdown(props, emit)

provide(LH_DROPDOWN_KEY, context)

defineExpose({ isVisible, show, hide, toggle })
</script>
