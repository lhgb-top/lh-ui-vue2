import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, useSlots } from 'vue'
import type { LhPopoverProps } from './types'
import { useLhConfigContext } from '../../config-provider/src/index'
import { useLhComponentTheme, useLhZIndex } from '../../../composables'
import {
  useLhFocusTrap,
  useLhPopper,
  useLhTrigger,
  useLhClickOutside,
} from '../../../composables/overlay'
import { generateId } from '@lh-ui/share/utils'
import {
  LH_POPOVER_PLACEMENT_DEFAULT,
  getPopoverClass,
  getPopoverWidthStyle,
  getDefaultDelay,
} from '@lh-ui/share/core/popover'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { isEscapeKey } from '@lh-ui/share/core/shared/keyboard'

export interface LhPopoverEmits {
  /** 双向绑定走 .sync 语义（事件名 update:visible） */
  (e: 'update:visible', value: boolean): void
  (e: 'show'): void
  (e: 'hide'): void
}

/**
 * Popover Composable
 */
export function useLhPopover(props: LhPopoverProps, emit: LhPopoverEmits) {
  const slots = useSlots()

  const configContext = useLhConfigContext()
  const { componentStyle } = useLhComponentTheme('popover', props, configContext)
  const { zIndex } = useLhZIndex()

  const popoverId = generateId('lh-popover')
  const titleId = generateId('lh-popover-title')
  const triggerRef = ref<HTMLElement | null>(null)
  const popperRef = ref<HTMLElement | null>(null)
  // 2.7 无 Teleport：host 根元素在 mounted 时移到 teleportTarget，卸载时移除防泄漏
  const popperHostRef = ref<HTMLElement | null>(null)
  const teleportTarget = computed(() => {
    // SSR / 非 DOM 环境守卫：与 cascader/date-picker/time-picker 的守卫口径一致
    if (typeof document === 'undefined') return null
    return typeof props.teleportTarget === 'string'
      ? (document.querySelector(props.teleportTarget) as HTMLElement | null)
      : (props.teleportTarget ?? document.body)
  })
  const shouldTeleport = computed(() => (props.teleportTarget ?? 'body') === 'body')

  const isVisible = ref(props.visible ?? false)

  // 外部控制模式（trigger 为 manual 且外部传入 visible）
  const isControlled = computed(() => props.trigger === 'manual' && props.visible !== undefined)

  const placement = computed(() => props.placement ?? LH_POPOVER_PLACEMENT_DEFAULT)

  const { popperStyle, actualPlacement, updatePosition } = useLhPopper({
    triggerRef,
    popperRef,
    visible: isVisible,
    placement,
    // 严格按 placement 定位时关闭自动翻转（默认开启，与 Tooltip/Popconfirm/Dropdown 一致）
    flip: computed(() => props.flip ?? true),
    // 触发器滚出视口时必须收起：弹出层是 fixed 定位，触发器离开后它仍会以高 z-index
    // 悬浮在页面内容之上。受控模式下同样收起，hide() 会抛出 update:visible 让外部状态同步。
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
    trigger: computed(() => props.trigger ?? 'click'),
    visible: isVisible,
    disabled: computed(() => props.disabled),
    isControlled,
    delay: computed(() => getDefaultDelay(props.showAfter, props.hideAfter)),
    onShow: () => {
      emit('show')
      emit('update:visible', true)
    },
    onHide: () => {
      emit('hide')
      emit('update:visible', false)
    },
  })

  /**
   * 弹出层内的悬停联动：hover 模式下指针移进弹出层不触发隐藏
   */
  function onPopperMouseenter() {
    if (props.trigger === 'hover') show()
  }

  function onPopperMouseleave() {
    if (props.trigger === 'hover') hide()
  }

  /**
   * 点击触发时把焦点圈进弹出层，关闭时归还
   */
  const { trap, release } = useLhFocusTrap()
  const isModal = computed(() => props.trigger === 'click')

  watch(isVisible, (visible) => {
    if (visible) {
      nextTick(() => {
        if (isModal.value) trap(popperRef.value)
      })
    } else {
      release()
    }
  })

  /**
   * 点击外部关闭（受控模式交由外部决定）
   */
  useLhClickOutside(
    () => [triggerRef.value, popperRef.value],
    () => {
      if (isVisible.value && !isControlled.value) hide()
    },
  )

  /**
   * ESC 关闭
   */
  function onKeydown(event: KeyboardEvent) {
    if (isEscapeKey(event) && isVisible.value && !isControlled.value) hide()
  }

  // 同步外部 visible
  watch(
    () => props.visible,
    (val) => {
      if (val !== undefined && val !== isVisible.value) isVisible.value = val
    },
  )

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    // host 被移出 $el 子树，卸载时主动移除防泄漏
    if (shouldTeleport.value && popperHostRef.value) {
      document.body.appendChild(popperHostRef.value)
    } else if (popperHostRef.value && teleportTarget.value) {
      teleportTarget.value.appendChild(popperHostRef.value)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    release()
    popperHostRef.value?.remove()
  })

  const hasTitle = computed(() => !!props.title || !!slots.title)

  const popperClass = computed(() =>
    getPopoverClass({
      placement: actualPlacement.value,
      arrow: props.arrow,
      popperClass: props.popperClass,
    }),
  )

  const mergedPopperStyle = computed(() => ({
    ...popperStyle.value,
    ...componentStyle.value,
    ...getPopoverWidthStyle(props.width),
    zIndex: zIndex.value,
  }))

  /**
   * 触发器根元素样式（sx 作用于触发器，弹出层已移至 body）
   */
  const triggerStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
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
    updatePosition,
  }
}
