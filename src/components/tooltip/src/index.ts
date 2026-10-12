import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { LhTooltipProps } from './types'
import { useLhConfigContext } from '../../config-provider/src'
import {
  useLhClickOutside,
  useLhPopper,
  useLhTrigger,
} from '../../../composables/overlay'
import { useLhComponentTheme, useLhZIndex } from '../../../composables'
import { generateId } from '@lh-ui/share/utils'
import { getPopperClass, getPopperStyle, getDefaultDelay } from '@lh-ui/share/core/tooltip'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { isEscapeKey } from '@lh-ui/share/core/shared/keyboard'

/**
 * Tooltip Composable
 *
 * 定位与触发逻辑走共享基建（useLhPopper / useLhTrigger，见 composables/overlay.ts），
 * 与 Popover / Popconfirm / Dropdown 同一套几何与显隐语义。
 */
export function useLhTooltip(props: LhTooltipProps, popperHostRef: Ref<HTMLElement | null>) {
  const configContext = useLhConfigContext()
  const { componentStyle } = useLhComponentTheme('tooltip', props, configContext)
  const { zIndex } = useLhZIndex()

  const tooltipId = generateId('lh-tooltip')
  const isVisible = ref(false)
  const tooltipRef = ref<HTMLElement | null>(null)
  const triggerRef = ref<HTMLElement | null>(null)

  // 外部控制模式
  const isControlled = computed(() => props.manual === true && props.visible !== undefined)

  // 获取触发方式
  const trigger = computed(() => props.trigger || 'hover')

  // 延迟（使用 core 纯函数）
  const delay = computed(() =>
    getDefaultDelay(props.showAfter ?? props.openDelay, props.hideAfter ?? props.closeDelay),
  )

  const { popperStyle: positionStyle, actualPlacement, updatePosition } = useLhPopper({
    triggerRef,
    popperRef: tooltipRef,
    visible: isVisible,
    placement: computed(() => props.placement || 'top'),
    gap: 8,
    // 严格按 placement 定位时关闭自动翻转（默认开启，与 Popover/Popconfirm/Dropdown 一致）
    flip: computed(() => props.flip ?? true),
    // 触发器滚出视口即收起提示，避免 fixed 弹层浮在页面内容之上
    onScrollOut: () => {
      hide()
    },
  })

  const {
    show,
    hide,
    toggle,
    onTriggerMouseenter,
    onTriggerMouseleave,
    onTriggerClick,
    onTriggerFocusin,
    onTriggerFocusout,
  } = useLhTrigger({
    trigger,
    visible: isVisible,
    disabled: computed(() => props.disabled),
    isControlled,
    delay,
  })

  /** click 触发时点击外部关闭 */
  useLhClickOutside(
    () => [triggerRef.value, tooltipRef.value],
    () => {
      if (isVisible.value && trigger.value === 'click' && !isControlled.value) hide()
    },
  )

  /** 键盘 Esc 关闭（对齐 APG tooltip pattern） */
  function onKeydown(event: KeyboardEvent) {
    if (isEscapeKey(event) && isVisible.value && !isControlled.value) hide()
  }

  // 同步外部 visible
  watch(
    () => props.visible,
    (val) => {
      if (isControlled.value && val !== undefined) {
        isVisible.value = val
      }
    },
  )

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    // host 被移动到 body 后不属于组件 $el 子树，卸载时需主动移除，避免泄漏
    popperHostRef.value?.remove()
  })

  /**
   * Vue2 无 Teleport（红线 #4）：mounted 时把 popper host 移到 teleportTarget（默认 body）。
   * 组件保持完整的响应式连接；销毁时 Vue 正常移除节点。
   */
  onMounted(() => {
    const host = popperHostRef.value
    if (!host) return
    const target =
      typeof props.teleportTarget === 'string'
        ? document.querySelector(props.teleportTarget)
        : props.teleportTarget ?? document.body
    if (target && host.parentElement !== target) {
      target.appendChild(host)
    }
  })

  const popperClass = computed(() => {
    const cls = getPopperClass({
      effect: props.effect || 'dark',
      placement: actualPlacement.value,
    })
    if (props.type) {
      cls.push(`lh-tooltip__popper--${props.type}`)
    }
    return cls
  })

  const popperStyle = computed(() => {
    const style = getPopperStyle({
      maxWidth: props.maxWidth,
    })
    // 优先使用 bgColor，其次 type，最后 fallback 给 effect
    const bg =
      props.bgColor || (props.type ? `var(--lh-${props.type}-color, var(--lh-primary-color))` : undefined)
    if (bg) {
      style['--lh-tooltip-bg'] = bg
      // 彩底上的文字色走语义令牌（浅主色预设下写死 #fff 对比度不足 AA）
      style['--lh-tooltip-text'] = 'var(--lh-color-on-primary, #fff)'
      // 箭头颜色同步
      style['--lh-tooltip-arrow-color'] = bg
    }
    return style
  })

  const mergedPopperStyle = computed(() => ({
    ...positionStyle.value,
    ...popperStyle.value,
    ...componentStyle.value,
    zIndex: zIndex.value,
  }))

  /**
   * 触发器根元素样式
   * sx 快速布局作用于根元素（popper 已移到 body，不适用 sx）
   */
  const triggerStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
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
    updatePosition,
    popperClass,
    popperStyle,
    mergedPopperStyle,
    componentStyle,
    triggerStyle,
    trigger,
  }
}
