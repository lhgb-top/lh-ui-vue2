<template>
  <div
    ref="triggerRef"
    class="lh-tooltip"
    :style="triggerStyle"
    :aria-describedby="isVisible ? tooltipId : undefined"
    @mouseenter="onTriggerMouseenter"
    @mouseleave="onTriggerMouseleave"
    @click="onTriggerClick"
    @focusin="onTriggerFocusin"
    @focusout="onTriggerFocusout"
  >
    <slot></slot>

    <!--
      Vue2 无 Teleport（红线 #4）：popper 宿主在 mounted 时被移到 teleportTarget（默认 body）。
      host 无样式（内容为 fixed 定位，不占布局流）。
    -->
    <div ref="popperHostRef" class="lh-tooltip__host">
      <transition name="lh-tooltip-fade">
        <div
          v-if="isVisible"
          :id="tooltipId"
          ref="tooltipRef"
          :class="popperClass"
          :style="mergedPopperStyle"
          role="tooltip"
        >
          <span class="lh-tooltip__content">{{ content }}</span>
          <div class="lh-tooltip__arrow"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'LhTooltip' }
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { useLhTooltip } from './index'
import type {
  LhTooltipProps,
  LhTooltipPlacement,
  LhTooltipTrigger,
  LhTooltipEffect,
  LhTooltipType,
} from './types'

const props = defineProps({
  content: { type: String, default: '' },
  placement: { type: String as PropType<LhTooltipPlacement>, default: 'top' },
  trigger: { type: String as PropType<LhTooltipTrigger>, default: 'hover' },
  disabled: { type: Boolean, default: false },
  manual: { type: Boolean, default: false },
  visible: { type: Boolean, default: undefined },
  showAfter: { type: Number, default: 0 },
  hideAfter: { type: Number, default: 0 },
  openDelay: { type: Number, default: undefined },
  closeDelay: { type: Number, default: undefined },
  effect: { type: String as PropType<LhTooltipEffect>, default: 'dark' },
  type: { type: String as PropType<LhTooltipType>, default: undefined },
  bgColor: { type: String, default: undefined },
  maxWidth: { type: [String, Number] as PropType<string | number>, default: '200px' },
  teleportTarget: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: 'body',
  },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhTooltipProps['sx']>, default: undefined },
})

const popperHostRef = ref<HTMLElement | null>(null)

const {
  tooltipId,
  isVisible,
  tooltipRef,
  triggerRef,
  show,
  hide,
  toggle,
  onTriggerMouseenter,
  onTriggerMouseleave,
  onTriggerClick,
  onTriggerFocusin,
  onTriggerFocusout,
  popperClass,
  mergedPopperStyle,
  triggerStyle,
} = useLhTooltip(props, popperHostRef)

defineExpose({
  show,
  hide,
  toggle,
  isVisible,
})
</script>
