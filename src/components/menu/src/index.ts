import { computed, inject, provide, ref } from 'vue'
import type { Ref } from 'vue'
import {
  getMenuClassNames,
  getMenuItemClassNames,
  getSubMenuClassNames,
  isMenuOpen,
  moveMenuFocus,
  toggleMenuOpen,
} from '@lh-ui/share/core/menu'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import {
  LH_KEYS,
  isActivationKey,
  isHomeOrEndKey,
} from '@lh-ui/share/core/shared/keyboard'
import { generateId } from '@lh-ui/share/utils'
import { LH_MENU_KEY } from './types'
import type { LhMenuContext, LhMenuItemGroupProps, LhMenuItemProps, LhMenuProps, LhSubMenuProps } from './types'

export interface LhMenuEmits {
  /** v-model：modelValue prop / input 事件（2.7 自定义 model） */
  (e: 'input', value: string): void
  (e: 'update:openeds', value: string[]): void
  (e: 'select', index: string, indexPath: string[]): void
  (e: 'open', index: string, indexPath: string[]): void
  (e: 'close', index: string, indexPath: string[]): void
}

export interface LhMenuItemEmits {
  (e: 'click', index: string): void
}

export interface LhSubMenuEmits {
  (e: 'select', index: string, indexPath: string[]): void
}

/**
 * Menu 组件 Composable（展开/激活/焦点遍历纯逻辑在 @lh-ui/share/core/menu）
 */
export function useLhMenu(props: LhMenuProps, emit: LhMenuEmits) {
  // 激活态：受控（传了 modelValue）走 props；未传时内部维护
  const innerActiveKey = ref('')
  const activeKey = computed(() => props.modelValue ?? innerActiveKey.value)

  // 展开态：受控（传了 openeds）走 props；未传时内部维护（初值取 defaultOpeneds）
  const innerOpeneds = ref<string[]>([...(props.defaultOpeneds ?? [])])
  const openeds = computed(() => props.openeds ?? innerOpeneds.value)

  const isPopperMode = () => props.mode === 'horizontal' || !!props.collapse

  function handleSelect(key: string, indexPath: string[]): void {
    innerActiveKey.value = key
    emit('input', key)
    emit('select', key, indexPath)
  }

  function handleToggleOpen(key: string): void {
    const next = toggleMenuOpen(openeds.value, key, !!props.uniqueOpened)
    innerOpeneds.value = next
    emit('update:openeds', next)
    const path = [key]
    if (next.includes(key)) emit('open', key, path)
    else emit('close', key, path)
  }

  function isOpen(key: string): boolean {
    return isMenuOpen(openeds.value, key)
  }

  function isActive(key: string): boolean {
    return activeKey.value === key
  }

  const depth = () => 0

  provide(LH_MENU_KEY, {
    // 红线 #6：provide computed ref 本体，禁止 props 快照
    mode: computed(() => props.mode ?? 'vertical'),
    collapse: computed(() => !!props.collapse),
    activeKey,
    openeds,
    isPopperMode,
    handleSelect,
    handleToggleOpen,
    isOpen,
    isActive,
    depth,
  } satisfies LhMenuContext)

  // ============ 垂直内联模式的 ↑/↓ 跨边界遍历 ============
  // 事件委托到根节点：可见项 = 叶子项 + 子菜单标题（DOM 序即视觉序），
  // 遍历越过子菜单标题 ↔ 面板内项 ↔ 兄弟节点边界。跳过禁用项（tabindex -1）
  // 与收起面板内的项（aria-hidden）。水平模式不走此逻辑（标题自身的 ←/→ 语义保留）。
  const rootRef = ref<HTMLElement | null>(null)

  function collectFocusable(): HTMLElement[] {
    const root = rootRef.value
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter((el) => {
      if (el.tabIndex === -1) return false
      return el.closest('[aria-hidden="true"]') == null
    })
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (props.mode !== 'vertical') return
    const target = event.target as HTMLElement | null
    let direction: 1 | -1 | null = null
    if (event.key === LH_KEYS.ArrowDown) direction = 1
    else if (event.key === LH_KEYS.ArrowUp) direction = -1

    if (direction != null) {
      const items = collectFocusable()
      const next = moveMenuFocus(items, target, direction)
      if (next) {
        event.preventDefault()
        next.focus()
      }
      return
    }

    if (isHomeOrEndKey(event)) {
      const items = collectFocusable()
      if (items.length === 0) return
      event.preventDefault()
      ;(event.key === LH_KEYS.Home ? items[0] : items[items.length - 1]).focus()
    }
  }

  const menuClasses = computed(() =>
    getMenuClassNames({ mode: props.mode ?? 'vertical', collapse: !!props.collapse }),
  )

  const menuStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    rootRef,
    activeKey,
    handleKeydown,
    menuClasses,
    menuStyle,
  }
}

/**
 * MenuItem 组件 Composable：点击激活（经父级 context 抛出）+ Enter/空格触发
 */
export function useLhMenuItem(props: LhMenuItemProps, emit: LhMenuItemEmits) {
  const context = inject(LH_MENU_KEY, null) as LhMenuContext | null

  const itemClasses = computed(() =>
    getMenuItemClassNames({
      active: context ? context.isActive(props.index) : false,
      disabled: !!props.disabled,
    }),
  )

  const itemStyle = computed(() => sxToStyle(props.sx ?? {}))

  function handleClick(): void {
    if (props.disabled) return
    emit('click', props.index)
    context?.handleSelect(props.index, [props.index])
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (props.disabled) return
    if (isActivationKey(event)) {
      event.preventDefault()
      handleClick()
    }
  }

  return { itemClasses, itemStyle, handleClick, handleKeydown }
}

/**
 * SubMenu 组件 Composable：展开态由父级 context 托管；自身向后代下发深度 +1 的上下文
 */
export function useLhSubMenu(props: LhSubMenuProps, emit: LhSubMenuEmits) {
  const context = inject(LH_MENU_KEY, null) as LhMenuContext | null

  const panelId = `lh-sub-menu-panel-${generateId('sm')}`

  const isPopper = computed(() => context?.isPopperMode() ?? false)
  const opened = computed(() => (context ? context.isOpen(props.index) : false))

  // 子菜单自身提供给后代的深度 +1
  const childDepth = (context?.depth() ?? 0) + 1

  provide(LH_MENU_KEY, {
    mode: context?.mode ?? computed(() => 'vertical'),
    collapse: context?.collapse ?? computed(() => false),
    activeKey: (context?.activeKey ?? ref('')) as Ref<string>,
    openeds: (context?.openeds ?? ref([])) as Ref<string[]>,
    isPopperMode: () => context?.isPopperMode() ?? false,
    handleSelect: (key, path) => {
      emit('select', key, [props.index, ...path])
      context?.handleSelect(key, [props.index, ...path])
    },
    handleToggleOpen: (key) => context?.handleToggleOpen(key),
    isOpen: (key) => (context ? context.isOpen(key) : false),
    isActive: (key) => (context ? context.isActive(key) : false),
    depth: () => childDepth,
  } satisfies LhMenuContext)

  function handleTitleClick(): void {
    if (props.disabled) return
    context?.handleToggleOpen(props.index)
  }

  function handleTitleMouseenter(): void {
    if (props.disabled || !isPopper.value) return
    context?.handleToggleOpen(props.index)
  }

  function handleTitleMouseleave(): void {
    // 飞出模式由面板的 mouseleave 收起；此处不主动收起避免焦点误关
  }

  function handlePanelMouseenter(): void {
    // 保持打开
  }

  function handlePanelMouseleave(): void {
    if (props.disabled || !isPopper.value) return
    if (opened.value) context?.handleToggleOpen(props.index)
  }

  /** 键盘开合；展开键（Enter/空格/→）触发后经 focusPanel 聚焦面板首项（DOM 查询留在 SFC） */
  function handleTitleKeydown(event: KeyboardEvent, focusPanel?: () => void): void {
    if (props.disabled) return
    switch (event.key) {
      case LH_KEYS.Enter:
      case LH_KEYS.Space:
      case LH_KEYS.ArrowRight: {
        event.preventDefault()
        if (!opened.value) context?.handleToggleOpen(props.index)
        focusPanel?.()
        break
      }
      case LH_KEYS.ArrowLeft: {
        if (opened.value) {
          event.preventDefault()
          context?.handleToggleOpen(props.index)
        }
        break
      }
      case LH_KEYS.Escape: {
        if (opened.value) {
          event.preventDefault()
          context?.handleToggleOpen(props.index)
        }
        break
      }
    }
  }

  const subMenuClasses = computed(() =>
    getSubMenuClassNames({
      active: context ? context.isActive(props.index) : false,
      disabled: !!props.disabled,
      opened: opened.value,
    }),
  )

  const subMenuStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    panelId,
    isPopper,
    opened,
    depth: () => childDepth,
    handleTitleClick,
    handleTitleMouseenter,
    handleTitleMouseleave,
    handlePanelMouseenter,
    handlePanelMouseleave,
    handleTitleKeydown,
    subMenuClasses,
    subMenuStyle,
  }
}

/**
 * MenuItemGroup 组件 Composable：纯展示容器
 */
export function useLhMenuItemGroup(props: LhMenuItemGroupProps) {
  const groupStyle = computed(() => sxToStyle(props.sx ?? {}))
  return { groupStyle, title: computed(() => props.title) }
}
