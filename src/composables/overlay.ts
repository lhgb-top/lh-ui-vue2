/**
 * 弹层基建（Vue 2.7 响应式胶水）：供 Tooltip / Popover / Popconfirm / Drawer / Dropdown /
 * Dialog / Select 下拉共用。纯几何计算在 @lh-ui/share/core/shared（popper / focus-trap），
 * 本文件只把纯函数接到响应式引用上（plus 平价移植，生命周期钩子 2.7 均支持）。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'
import type { Ref } from 'vue'
import {
  computePosition,
  getWindowViewport,
  isOutsideViewport,
} from '@lh-ui/share/core/shared/popper'
import type { LhPlacement } from '@lh-ui/share/core/shared/popper'
import {
  focusFirst,
  saveActiveElement,
  restoreActiveElement,
  setInertOutside,
  supportsInert,
  trapTabKey,
} from '@lh-ui/share/core/shared/focus-trap'

/** useLhPopper 入参 */
export interface UseLhPopperOptions {
  /** 触发器元素引用 */
  triggerRef: Ref<HTMLElement | null>
  /** 弹出层元素引用 */
  popperRef: Ref<HTMLElement | null>
  /** 弹出层是否可见（可见时才计算与监听重定位） */
  visible: Ref<boolean>
  /** 期望方位（可传响应式引用） */
  placement: LhPlacement | Ref<LhPlacement>
  /** 与触发器的间距，默认 8 */
  gap?: number
  /** 视口安全边距，默认 8 */
  padding?: number
  /** 主轴溢出翻转，默认开启 */
  flip?: boolean | Ref<boolean>
  /** 交叉轴溢出夹回，默认开启 */
  shift?: boolean | Ref<boolean>
  /**
   * 滚动/调整窗口导致触发器完全离开视口时的回调。
   * 弹出层是 fixed 定位且跟随触发器重算位置；触发器滚出视口后，它会被
   * 钳在视口边缘并浮在页面内容之上（观感上「层级太高」）。组件层据此
   * 自行决定是否关闭（hover 类提示应关闭，受控弹层可忽略）。
   */
  onScrollOut?: () => void
}

/**
 * useLhPopper - 弹出层定位
 *
 * 可见时计算 fixed 定位，并在窗口 resize、滚动、触发器或弹出层尺寸变化时重定位。
 */
export function useLhPopper(options: UseLhPopperOptions) {
  const popperStyle = ref<Record<string, string>>({})
  const actualPlacement = ref<LhPlacement>(unref(options.placement))

  function updatePosition() {
    const trigger = options.triggerRef.value
    const popper = options.popperRef.value
    if (!trigger || !popper || !options.visible.value) return

    const { top, left, placement, arrowOffset } = computePosition(
      trigger.getBoundingClientRect(),
      // 弹出层取布局尺寸而非 getBoundingClientRect：进出过渡带 transform: scale(0.96)，
      // 变形中的视口尺寸是缩放后的，按它算出的位置在过渡结束后会 stale（差约 4%）
      {
        top: 0,
        left: 0,
        width: popper.offsetWidth,
        height: popper.offsetHeight,
        right: popper.offsetWidth,
        bottom: popper.offsetHeight,
      },
      getWindowViewport(),
      {
        placement: unref(options.placement),
        gap: options.gap ?? 8,
        padding: options.padding ?? 8,
        flip: unref(options.flip) ?? true,
        shift: unref(options.shift) ?? true,
      },
    )

    popperStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      // 箭头通过 CSS 变量传给 SCSS，未定位时回退到 50% 居中
      '--lh-arrow-offset': `${arrowOffset}px`,
    }
    actualPlacement.value = placement
  }

  /** 滚动 / 窗口变化时重定位，触发器整体离开视口则通知组件层关闭 */
  function onScrollOrResize() {
    if (!options.visible.value) return
    const trigger = options.triggerRef.value
    if (trigger && isOutsideViewport(trigger.getBoundingClientRect(), getWindowViewport())) {
      options.onScrollOut?.()
      return
    }
    updatePosition()
  }

  let resizeObserver: ResizeObserver | null = null

  watch(
    () => options.visible.value,
    (visible) => {
      if (visible) {
        nextTick(() => {
          updatePosition()
          // 弹出层每次出现都重新挂观测，消失时取下，避免持有已卸载的节点
          if (resizeObserver && options.popperRef.value) {
            resizeObserver.observe(options.popperRef.value)
          }
        })
      } else {
        if (resizeObserver && options.popperRef.value) {
          resizeObserver.unobserve(options.popperRef.value)
        }
        popperStyle.value = {}
        actualPlacement.value = unref(options.placement)
      }
    },
  )

  // placement / flip / shift 任一变化都重定位（运行时改 flip 开关也要立即生效）
  watch(
    () => [unref(options.placement), unref(options.flip) ?? true, unref(options.shift) ?? true],
    () => {
      if (options.visible.value) nextTick(updatePosition)
    },
  )

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (options.visible.value) updatePosition()
      })
      if (options.triggerRef.value) resizeObserver.observe(options.triggerRef.value)
    }
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', onScrollOrResize)
    window.removeEventListener('scroll', onScrollOrResize, true)
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  return { popperStyle, actualPlacement, updatePosition }
}

/** useLhClickOutside 入参 */
export interface UseLhClickOutsideOptions {
  /** 监听的事件类型：mousedown 在点击处理器之前触发，适合即时收起 */
  eventType?: 'mousedown' | 'click'
}

/**
 * useLhClickOutside - 点击外部判定
 *
 * 传入需要「算作内部」的元素引用，点击落在它们之外时触发回调。
 */
export function useLhClickOutside(
  getEls: () => (HTMLElement | null | undefined)[],
  handler: (event: MouseEvent) => void,
  options: UseLhClickOutsideOptions = {},
) {
  const eventType = options.eventType ?? 'mousedown'

  function listener(event: MouseEvent) {
    const target = event.target as Node | null
    if (!target) return
    const els = getEls().filter((el): el is HTMLElement => !!el)
    if (els.some((el) => el.contains(target))) return
    handler(event)
  }

  onMounted(() => {
    if (typeof document === 'undefined') return
    document.addEventListener(eventType, listener)
  })

  onBeforeUnmount(() => {
    if (typeof document === 'undefined') return
    document.removeEventListener(eventType, listener)
  })

  return { listener }
}

/** useLhFocusTrap 入参 */
export interface UseLhFocusTrapOptions {
  /** 是否用 inert 锁住容器以外的内容（不支持 inert 的环境自动回退纯焦点圈） */
  inertOutside?: boolean
}

/**
 * useLhFocusTrap - 焦点圈
 *
 * trap(el) 后：记录先前焦点、把焦点移入容器、Tab 键在容器内循环；
 * release() 时归还焦点。组件卸载时自动释放。
 */
export function useLhFocusTrap(options: UseLhFocusTrapOptions = {}) {
  const trapped = ref<HTMLElement | null>(null)
  let savedActive: HTMLElement | null = null
  let locked: HTMLElement[] = []

  function onKeydown(event: KeyboardEvent) {
    if (!trapped.value) return
    trapTabKey(trapped.value, event)
  }

  /** 圈住指定元素并把焦点移入 */
  function trap(el: HTMLElement | null, focusTarget?: HTMLElement | null): void {
    if (trapped.value) release(false)
    if (!el) return
    trapped.value = el
    savedActive = saveActiveElement()

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', onKeydown)
    }

    if (options.inertOutside && supportsInert()) {
      locked = setInertOutside(el, true, locked)
    }

    if (focusTarget) {
      // 弹层此时尚未落位（同 tick 内才写入定位样式），不阻止滚动会把页面拽到容器挂载点
      focusTarget.focus({ preventScroll: true })
    } else {
      nextTick(() => focusFirst(el))
    }
  }

  /** 释放焦点圈并归还焦点 */
  function release(returnFocus = true): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', onKeydown)
    }
    if (locked.length) {
      locked = setInertOutside(trapped.value as HTMLElement, false, locked)
    }
    if (returnFocus) restoreActiveElement(savedActive)
    savedActive = null
    trapped.value = null
  }

  onBeforeUnmount(() => release(false))

  return { trapped, trap, release }
}

/** 触发方式 */
export type LhTriggerType = 'hover' | 'click' | 'focus' | 'manual' | 'contextmenu'

/** useLhTrigger 入参 */
export interface UseLhTriggerOptions {
  /** 触发方式（可传响应式引用） */
  trigger: LhTriggerType | Ref<LhTriggerType>
  /** 可见状态（由组件持有，composable 只负责改它） */
  visible: Ref<boolean>
  /** 是否禁用 */
  disabled?: Ref<boolean | undefined>
  /** 受控模式：为真时 hover/click/focus 都不再直接改 visible */
  isControlled?: Ref<boolean | undefined>
  /** 显隐延迟 */
  delay?: { show: number; hide: number } | Ref<{ show: number; hide: number }>
  /** visible 变为 true 时触发 */
  onShow?: () => void
  /** visible 变为 false 时触发 */
  onHide?: () => void
}

/**
 * useLhTrigger - 统一的显隐触发逻辑
 *
 * 把 hover / click / focus / manual 四种模式、显隐延迟双 timer、
 * 受控模式判定收敛到一处，组件模板只需绑定返回的事件处理器。
 */
export function useLhTrigger(options: UseLhTriggerOptions) {
  let showTimer: ReturnType<typeof setTimeout> | null = null
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  const trigger = computed(() => unref(options.trigger))
  const delay = computed(() => unref(options.delay ?? { show: 0, hide: 0 }))
  // 延迟只用于防误触的 hover/focus；click 与 manual 立即响应
  const useDelay = computed(() => trigger.value === 'hover' || trigger.value === 'focus')
  const disabled = computed(() => options.disabled?.value === true)
  const isControlled = computed(() => options.isControlled?.value === true)

  function clearTimers() {
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  function setVisible(value: boolean) {
    if (options.visible.value === value) return
    options.visible.value = value
    if (value) options.onShow?.()
    else options.onHide?.()
  }

  /** 显示（禁用时不变更状态；受控模式下编程式调用仍生效，交由外部 watch 决定） */
  function show() {
    if (disabled.value) return
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    const showDelay = useDelay.value ? delay.value.show : 0
    if (showDelay > 0) {
      showTimer = setTimeout(() => {
        setVisible(true)
        showTimer = null
      }, showDelay)
    } else {
      setVisible(true)
    }
  }

  /** 隐藏 */
  function hide() {
    if (disabled.value) return
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }
    const hideDelay = useDelay.value ? delay.value.hide : 0
    if (hideDelay > 0) {
      hideTimer = setTimeout(() => {
        setVisible(false)
        hideTimer = null
      }, hideDelay)
    } else {
      setVisible(false)
    }
  }

  function toggle() {
    if (options.visible.value) hide()
    else show()
  }

  // —— 模板事件处理器，按 trigger 取舍；受控模式下全部不响应（由外部控制显隐） ——

  function onTriggerMouseenter() {
    if (isControlled.value || trigger.value !== 'hover') return
    show()
  }

  function onTriggerMouseleave() {
    if (isControlled.value || trigger.value !== 'hover') return
    hide()
  }

  function onTriggerClick() {
    if (isControlled.value || trigger.value !== 'click') return
    toggle()
  }

  function onTriggerFocusin() {
    // hover 模式下键盘焦点进入同样展示（无障碍）；click 模式不响应焦点
    if (isControlled.value || (trigger.value !== 'focus' && trigger.value !== 'hover')) return
    show()
  }

  function onTriggerFocusout() {
    if (isControlled.value || (trigger.value !== 'focus' && trigger.value !== 'hover')) return
    hide()
  }

  onBeforeUnmount(clearTimers)

  return {
    show,
    hide,
    toggle,
    onTriggerMouseenter,
    onTriggerMouseleave,
    onTriggerClick,
    onTriggerFocusin,
    onTriggerFocusout,
  }
}
