import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { LhDropdownProps, LhDropdownContext, DropdownItemRecord } from './types'
import { useLhConfigContext } from '../../config-provider/src/index'
import { useLhComponentTheme, useLhZIndex } from '../../../composables'
import { useLhPopper, useLhTrigger, useLhClickOutside } from '../../../composables/overlay'
import { generateId } from '@lh-ui/share/utils'
import {
  DEFAULT_DROPDOWN_PLACEMENT,
  getDropdownClass,
  getDropdownMenuStyle,
} from '@lh-ui/share/core/dropdown'
import { sxToStyle, focusFirst } from '@lh-ui/share/core/shared'

export interface LhDropdownEmits {
  /** 双向绑定走 .sync 语义（事件名 update:visible） */
  (e: 'update:visible', value: boolean): void
  (e: 'command', command: string | number | undefined): void
  (e: 'visible-change', value: boolean): void
}

/**
 * Dropdown Composable
 *
 * 键盘行为对齐 WAI-ARIA APG menu pattern：
 * 方向键在菜单项间循环、Home/End 跳首尾、Enter/Space 触发、Esc 关闭并归还焦点。
 * 焦点落在真实的菜单项元素上（roving tabindex），禁用项保持可聚焦以进入无障碍树。
 */
export function useLhDropdown(props: LhDropdownProps, emit: LhDropdownEmits) {
  const configContext = useLhConfigContext()
  const { componentStyle } = useLhComponentTheme('dropdown', props, configContext)
  const { zIndex } = useLhZIndex()

  const dropdownId = generateId('lh-dropdown')
  const triggerRef = ref<HTMLElement | null>(null)
  const popperRef = ref<HTMLElement | null>(null)
  // 2.7 无 Teleport：host 根元素在 mounted 时移到 teleportTarget，卸载时移除防泄漏
  const popperHostRef = ref<HTMLElement | null>(null)
  const isVisible = ref(props.visible ?? false)

  const items = ref<DropdownItemRecord[]>([])
  const activeIndex = ref(-1)

  // 传入 visible 即视为受控：触发器与外部点击不再自行切换显隐。
  // 注意：Boolean 类型的 prop 未传递时会被 Vue 解析为 false 而非 undefined，
  // 不能用 props.visible !== undefined 判定，必须看父级是否真的写了这个 prop。
  // 2.7 的占位 vnode 在 proxy.$vnode（Vue3 是 instance.vnode.props）
  const vm = getCurrentInstance() as unknown as
    | { proxy?: { $vnode?: { componentOptions?: { propsData?: Record<string, unknown> } } } }
    | undefined
  const isControlled = computed(() =>
    'visible' in (vm?.proxy?.$vnode?.componentOptions?.propsData ?? {}),
  )

  const placement = computed(() => props.placement ?? DEFAULT_DROPDOWN_PLACEMENT)

  const { popperStyle, actualPlacement, updatePosition } = useLhPopper({
    triggerRef,
    popperRef,
    visible: isVisible,
    placement,
    // 触发器滚出视口时必须收起：fixed 菜单不会随触发器离开，会悬浮在页面内容之上。
    // 受控模式同样收起，hide() 会抛出 update:visible 让外部状态保持同步。
    onScrollOut: () => {
      hide()
    },
  })

  const { show, hide, toggle, onTriggerMouseenter, onTriggerMouseleave, onTriggerClick } =
    useLhTrigger({
      // contextmenu 由组件自身的 onTriggerContextmenu 处理；传给 useLhTrigger 后，
      // click/hover/focus 三类内建处理器都会因为 trigger 不匹配而保持静默
      trigger: computed(() => props.trigger ?? 'click'),
      visible: isVisible,
      disabled: computed(() => props.disabled),
      isControlled,
      delay: computed(() => ({ show: 200, hide: 100 })),
      onShow: () => {
        emit('visible-change', true)
        emit('update:visible', true)
      },
      onHide: () => {
        emit('visible-change', false)
        emit('update:visible', false)
        activeIndex.value = -1
      },
    })

  /**
   * 右键触发
   */
  function onTriggerContextmenu(event: MouseEvent) {
    if (props.trigger !== 'contextmenu') return
    event.preventDefault()
    show()
  }

  /**
   * 悬停在弹出层上时保持打开（hover 模式）
   */
  function onMenuMouseenter() {
    if (props.trigger === 'hover') show()
  }

  function onMenuMouseleave() {
    if (props.trigger === 'hover') hide()
  }

  useLhClickOutside(
    () => [triggerRef.value, popperRef.value],
    () => {
      if (isVisible.value && !isControlled.value) hide()
    },
  )

  /**
   * 归还焦点到触发器内的首个可聚焦元素
   */
  function returnFocus() {
    const trigger = triggerRef.value
    if (!trigger) return
    // 触发器根元素通常不是可聚焦区域，优先聚焦其内部的真实交互元素
    if (!focusFirst(trigger)) trigger.focus?.()
  }

  /**
   * Esc 关闭（焦点在触发器上时菜单自身的 keydown 收不到，补一层文档监听）
   */
  function onDocumentKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !isVisible.value || isControlled.value) return
    hide()
    returnFocus()
  }

  onMounted(() => {
    document.addEventListener('keydown', onDocumentKeydown)
    // host 被移出 $el 子树，卸载时主动移除防泄漏
    if (popperHostRef.value && popperHostRef.value.parentElement !== document.body) {
      document.body.appendChild(popperHostRef.value)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onDocumentKeydown)
    popperHostRef.value?.remove()
  })

  function handleItemClick(command: string | number | undefined) {
    emit('command', command)
    if (props.hideOnClick !== false) hide()
  }

  /**
   * 菜单键盘导航（对齐 APG menu pattern）
   */
  function onMenuKeydown(event: KeyboardEvent) {
    const enabled = items.value.filter((item) => !item.disabled)
    if (enabled.length === 0) return

    const current = enabled.findIndex((item) => item.el === document.activeElement)

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        const next = current === -1 ? 0 : (current + 1) % enabled.length
        focusItem(enabled[next])
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const prev =
          current === -1 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length
        focusItem(enabled[prev])
        break
      }
      case 'Home': {
        event.preventDefault()
        focusItem(enabled[0])
        break
      }
      case 'End': {
        event.preventDefault()
        focusItem(enabled[enabled.length - 1])
        break
      }
      case 'Enter':
      case ' ': {
        if (current === -1) return
        event.preventDefault()
        handleItemClick(enabled[current].command)
        break
      }
      case 'Escape': {
        event.preventDefault()
        hide()
        returnFocus()
        break
      }
    }
  }

  function focusItem(item: DropdownItemRecord) {
    item.el.focus()
    activeIndex.value = items.value.indexOf(item)
  }

  // 同步外部 visible
  watch(
    () => props.visible,
    (val) => {
      if (val !== undefined && val !== isVisible.value) isVisible.value = val
    },
  )

  const context: LhDropdownContext = {
    items,
    activeIndex,
    registerItem(item: DropdownItemRecord) {
      items.value.push(item)
    },
    unregisterItem(item: DropdownItemRecord) {
      const index = items.value.indexOf(item)
      if (index > -1) items.value.splice(index, 1)
      if (activeIndex.value >= items.value.length) activeIndex.value = -1
    },
    onItemClick: handleItemClick,
  }

  const menuClass = computed(() =>
    getDropdownClass({
      placement: actualPlacement.value,
      popperClass: props.popperClass,
    }),
  )

  const mergedMenuStyle = computed(() => ({
    ...popperStyle.value,
    ...componentStyle.value,
    ...getDropdownMenuStyle(props.maxHeight),
    zIndex: zIndex.value,
  }))

  const triggerStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
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
    updatePosition,
  }
}
