import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  expandLastValue,
  findNode,
  findPathByValues,
  getField,
  getChildren,
  getPanelItems,
  isLeafNode,
  searchNodes,
} from '@lh-ui/share/core/cascader'
import type {
  LhCascaderItemConfig,
  LhCascaderNode,
  LhCascaderPanelItem,
  LhCascaderSearchResult,
} from '@lh-ui/share/core/cascader'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import {
  LH_KEYS,
  getNextListIndex,
  isActivationKey,
  isArrowKey,
  isEscapeKey,
} from '@lh-ui/share/core/shared/keyboard'
import { generateId } from '@lh-ui/share/utils'
import { resolveAriaAttrs } from '../../../utils/aria'
import { t } from '../../../locale'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'
import { useLhZIndex } from '../../../composables'
import type { LhCascaderProps } from './types'

export interface LhCascaderEmits {
  /** Vue2 默认 v-model：input 事件 */
  (e: 'input', value: (string | number)[]): void
  (e: 'change', value: (string | number)[], path: LhCascaderNode[] | null): void
}

/**
 * Cascader 组件 Composable（纯逻辑在 @lh-ui/share/core/cascader）
 *
 * Vue2 适配要点：
 * - v-model 走默认 value prop + input 事件
 * - 无 Teleport：面板 host 在 mounted 移到 teleportTarget（默认 body），卸载时移除
 * - 多选队列用 ref 数组（红线 #4：reactive 根值数组不可追踪）
 */
export function useLhCascader(props: LhCascaderProps, emit: LhCascaderEmits) {
  const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)
  const { nextZIndex } = useLhZIndex()

  const containerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  // 2.7 无 Teleport：host 根元素在 mounted 时移到 teleportTarget，卸载时移除防泄漏
  const panelHostRef = ref<HTMLElement | null>(null)
  const inputRef = ref<HTMLInputElement | null>(null)

  const internalVisible = ref(false)
  const filterKeyword = ref('')
  const inputValue = ref('')
  const panelPosition = ref({ top: 0, left: 0 })
  const panelZIndex = ref(nextZIndex())

  /** 多选已选路径队列 */
  const multiSelected = ref<(string | number)[][]>([])
  /** 各级面板的展开路径 */
  const expandedValues = ref<(string | number)[][]>([[]])

  const options = computed(() => props.options ?? [])
  const itemConfig = computed<LhCascaderItemConfig>(() => props.itemConfig ?? {})

  const teleportTarget = computed<HTMLElement | null>(() => {
    if (typeof document === 'undefined') return null
    const target = props.teleportTarget ?? 'body'
    if (target === 'body') return document.body
    if (typeof target === 'string') return document.querySelector(target)
    return target
  })

  // ---------- 面板 ----------

  const panels = computed(() => {
    const result: { items: LhCascaderPanelItem[] }[] = []
    let currentNodes = options.value

    // expandedValues[i] = 「到第 i 级的完整路径链」；第 i 列的展开项 = 链的第 i 个元素
    for (let i = 0; currentNodes.length; i++) {
      const path = expandedValues.value[i] ?? []
      const expandedValue = path.length === i + 1 ? path[i] : undefined
      const items = getPanelItems(
        currentNodes,
        new Set(expandedValue !== undefined ? [expandedValue] : []),
        itemConfig.value,
      )
      result.push({ items })

      if (path.length) {
        const node = findNode(currentNodes, path[path.length - 1], false, [], itemConfig.value)
        currentNodes = node ? getChildren(node.node, itemConfig.value) : []
      } else {
        break
      }
    }

    return result
  })

  const searchResults = computed<LhCascaderSearchResult[]>(() => {
    if (!filterKeyword.value) return []
    // searchNodes 内部按 itemConfig 读 label 且大小写不敏感；
    // 直接 flattenNodes + 裸读 node.label 会在自定义键时崩溃且匹配不到
    return searchNodes(options.value, filterKeyword.value, [], itemConfig.value)
  })

  // ---------- 展示 ----------

  const displayPlaceholder = computed(() => props.placeholder || t('cascader.placeholder', '请选择'))

  const displayValue = computed(() => {
    if (filterKeyword.value) return inputValue.value
    if (props.multiple) return ''
    const value = props.value ?? []
    if (value.length) {
      // emitPath=false 时 value 只含末级值，findPathByValues 逐级下钻会落空
      // （末级值不在顶层），改用 findNode 递归整棵树还原完整节点路径
      const nodes =
        props.emitPath === false
          ? findNode(options.value, value[value.length - 1], false, [], itemConfig.value)?.path ??
            null
          : findPathByValues(options.value, value, itemConfig.value)?.nodes ?? null
      if (nodes) {
        const labels = nodes.map((n) => getField<string>(n, 'label', itemConfig.value.label))
        return props.showAllLevels === false
          ? labels[labels.length - 1]
          : labels.join(props.separator ?? '/')
      }
    }
    return ''
  })

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const containerClasses = computed(() => [
    'lh-cascader',
    `lh-cascader--${props.size}`,
    {
      'lh-cascader--disabled': props.disabled,
      'lh-cascader--visible': internalVisible.value,
      'lh-cascader--filterable': props.filterable,
      'lh-cascader--multiple': props.multiple,
    },
  ])

  const panelStyle = computed<Record<string, string>>(() => ({
    position: 'fixed',
    top: `${panelPosition.value.top}px`,
    left: `${panelPosition.value.left}px`,
    zIndex: String(panelZIndex.value),
  }))

  /** 面板 id：触发器 aria-controls 与面板 role="dialog" 共用 */
  const panelId = generateId('lh-cascader-panel')

  /** 触发器无障碍属性包（aria-expanded / aria-controls / aria-haspopup=menu） */
  const triggerAria = computed(() =>
    resolveAriaAttrs({
      'aria-expanded': internalVisible.value,
      'aria-controls': panelId,
      'aria-haspopup': 'menu',
      role: 'combobox',
    }),
  )

  /** 面板容器无障碍属性包 */
  const panelAria = computed(() =>
    resolveAriaAttrs({
      id: panelId,
      role: 'menu',
      'aria-label': t('cascader.panelLabel', '请选择'),
    }),
  )

  /** 各列 listbox 的 aria-label（第 N 级） */
  function columnLabel(panelIndex: number): string {
    return t('cascader.columnLabel', { n: panelIndex + 1 })
  }

  const showClear = computed(() => {
    return (
      props.clearable &&
      !props.disabled &&
      !props.readonly &&
      ((props.multiple && multiSelected.value.length > 0) || (!props.multiple && (props.value?.length ?? 0) > 0))
    )
  })

  const showTags = computed(() => props.multiple && multiSelected.value.length > 0)

  const selectedCount = computed(() => multiSelected.value.length)

  const visibleTags = computed(() => {
    const tags = multiSelected.value.map((path) => {
      const result = findPathByValues(options.value, path, itemConfig.value)
      return (
        result?.nodes
          .map((n) => getField<string>(n, 'label', itemConfig.value.label))
          .join(props.separator ?? '/') || String(path[path.length - 1])
      )
    })
    if (props.collapseTags) return tags.slice(0, 1)
    return tags
  })

  const noMatchText = computed(() => t('cascader.noMatch', '无匹配数据'))

  // ---------- 交互 ----------

  function open() {
    if (props.disabled || props.readonly || internalVisible.value) return
    internalVisible.value = true
    panelZIndex.value = nextZIndex()
    if (props.filterable) inputRef.value?.focus()
    nextTick(() => updatePanelPosition())
  }

  function handleFocus() {
    if (props.disabled || props.readonly) return
    // Escape 关闭后把焦点还给输入框会再次触发 focus，此时不能重开面板
    if (suppressOpenOnFocus.value) return
    internalVisible.value = true
    panelZIndex.value = nextZIndex()
    nextTick(() => updatePanelPosition())
  }

  /** Escape 归还焦点期间抑制 handleFocus 重开面板（同步置位，下一帧放开） */
  const suppressOpenOnFocus = ref(false)

  function close() {
    internalVisible.value = false
  }

  /** 关闭面板并把焦点还给触发器输入框（ combobox 的 Escape 约定） */
  function closeAndReturnFocus() {
    close()
    suppressOpenOnFocus.value = true
    inputRef.value?.focus()
    nextTick(() => {
      suppressOpenOnFocus.value = false
    })
  }

  function updatePanelPosition() {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    panelPosition.value = { top: rect.bottom + 4, left: rect.left }
  }

  function onResizeOrScroll() {
    if (internalVisible.value) updatePanelPosition()
  }

  function handleClear(e: Event) {
    e.stopPropagation()
    emit('input', [])
    emit('change', [], null)
    multiSelected.value = []
    filterKeyword.value = ''
    inputValue.value = ''
    expandedValues.value = [[]]
    close()
  }

  function onInput(e: Event) {
    const target = e.target as HTMLInputElement
    filterKeyword.value = target.value.trim()
    inputValue.value = target.value
  }

  function onBackspace(e: Event) {
    if (!props.multiple || !multiSelected.value.length) return
    const target = e.target as HTMLInputElement
    if (target.value) return
    multiSelected.value.pop()
    const value = multiSelected.value.map((v) => v[v.length - 1])
    emit('input', value)
    emit('change', value, null)
  }

  function onItemHover(panelIndex: number, item: LhCascaderPanelItem) {
    if (!props.cascading || item.isDisabled) return
    // 悬停展开：本级落下，后续列清空
    const parentPath = panelIndex > 0 ? (expandedValues.value[panelIndex - 1] ?? []) : []
    expandedValues.value = [
      ...expandedValues.value.slice(0, panelIndex),
      [...parentPath, item.value],
    ]
  }

  function onItemClick(panelIndex: number, item: LhCascaderPanelItem) {
    if (item.isDisabled) return
    // expandedValues[i] 存「到第 i 级的完整路径链」，panels 据此逐级下钻
    const parentPath = panelIndex > 0 ? (expandedValues.value[panelIndex - 1] ?? []) : []
    const fullPath = [...parentPath, item.value]
    const found = findNode(options.value, item.value, false, [], itemConfig.value)
    const node = found?.node ?? { value: item.value, label: item.label }
    const leaf = isLeafNode(node, itemConfig.value)

    // checkStrictly 下「可选任意层级」：点击父节点直接选中，不钻取
    // （悬停级联仍可展开下级选子节点；普通模式点击父节点先展开）
    if (!props.checkStrictly && item.hasChildren && !leaf && !item.isExpanded) {
      expandedValues.value = [...expandedValues.value.slice(0, panelIndex), fullPath]
      return
    }
    selectNode(fullPath)
  }

  function selectNode(fullPath: (string | number)[]) {
    if (props.multiple) {
      const exists = multiSelected.value.some((v) => v.join(',') === fullPath.join(','))
      if (exists) return
      multiSelected.value.push(fullPath)
      const value = multiSelected.value.map((v) => v[v.length - 1])
      emit('input', value)
      emit('change', value, null)
      return
    }
    const value = props.emitPath === false ? [fullPath[fullPath.length - 1]] : fullPath
    emit('input', value)
    const pathResult = findPathByValues(options.value, fullPath, itemConfig.value)
    emit('change', value, pathResult?.nodes ?? null)
    filterKeyword.value = ''
    inputValue.value = ''
    close()
  }

  function selectSearchResult(result: LhCascaderSearchResult) {
    selectNode(result.path)
    if (props.multiple) {
      filterKeyword.value = ''
      inputValue.value = ''
    }
  }

  function isPanelActive(panelIndex: number, value: string | number): boolean {
    const path = expandedValues.value[panelIndex] || []
    return path.includes(value)
  }

  /**
   * roving tabindex：每列只有一个 option 可 Tab 进入
   *
   * 焦点锚点取该列的展开项（展开链上的项），无展开时取首项
   */
  const columnFocusIndex = ref<Record<number, number>>({})

  function resolveColumnFocus(panelIndex: number): number {
    const items = panels.value[panelIndex]?.items ?? []
    const explicit = columnFocusIndex.value[panelIndex]
    if (explicit !== undefined && explicit >= 0 && explicit < items.length) return explicit
    const expandedIdx = items.findIndex((it) => isPanelActive(panelIndex, it.value))
    return expandedIdx >= 0 ? expandedIdx : 0
  }

  function itemTabIndex(panelIndex: number, index: number): number {
    return index === resolveColumnFocus(panelIndex) ? 0 : -1
  }

  /** 把焦点移到指定列的可 Tab 项（无函数 ref，靠类名查询 DOM） */
  function focusColumnItem(panelIndex: number): void {
    nextTick(() => {
      const columns = panelRef.value?.querySelectorAll<HTMLElement>('.lh-cascader-panel__column')
      const column = columns?.[panelIndex]
      column?.querySelector<HTMLElement>('.lh-cascader-panel__item[tabindex="0"]')?.focus()
    })
  }

  /**
   * 列项键盘导航（listbox 模式）
   *
   * - 上下方向键在列内移动（跳过禁用项）
   * - 左右方向键跨列：右键展开 / 进入下一列，左键回上一列
   * - Enter / Space 等价点击；Escape 关闭并把焦点还给输入框
   */
  function onItemKeydown(e: KeyboardEvent, panelIndex: number, index: number): void {
    if (props.disabled) return
    if (isEscapeKey(e)) {
      e.preventDefault()
      closeAndReturnFocus()
      return
    }
    if (isActivationKey(e)) {
      e.preventDefault()
      const item = panels.value[panelIndex]?.items[index]
      if (!item) return
      onItemClick(panelIndex, item)
      // 点击可能展开新列（面板列数变化），焦点落到进入侧
      if (!internalVisible.value) return
      focusColumnItem(panelIndex + 1 < panels.value.length ? panelIndex + 1 : panelIndex)
      return
    }
    if (!isArrowKey(e)) return
    e.preventDefault()

    const key = e.key
    if (key === LH_KEYS.ArrowRight) {
      const item = panels.value[panelIndex]?.items[index]
      // 有子节点且未展开：右键先展开（等价首次点击）
      if (item?.hasChildren && !item.isExpanded && !props.checkStrictly) {
        onItemClick(panelIndex, item)
        focusColumnItem(panelIndex + 1)
        return
      }
      // 已展开或 checkStrictly 下无子：尝试进入下一列
      if (panelIndex + 1 < panels.value.length) focusColumnItem(panelIndex + 1)
      return
    }
    if (key === LH_KEYS.ArrowLeft) {
      if (panelIndex > 0) focusColumnItem(panelIndex - 1)
      return
    }

    // 上下方向键：列内移动
    const items = panels.value[panelIndex]?.items ?? []
    const next = getNextListIndex(items, index, key === LH_KEYS.ArrowDown ? 1 : -1, {
      loop: false,
      isDisabled: (item) => !!item.isDisabled,
    })
    if (next !== index) {
      columnFocusIndex.value = { ...columnFocusIndex.value, [panelIndex]: next }
      focusColumnItem(panelIndex)
    }
  }

  /**
   * 触发器（combobox）键盘：Backspace 多选回退、ArrowDown/ArrowUp 进入面板、Escape 关闭
   */
  function onTriggerKeydown(e: KeyboardEvent): void {
    if (props.disabled || props.readonly) return
    if (e.key === LH_KEYS.Backspace) {
      onBackspace(e)
      return
    }
    if (isEscapeKey(e)) {
      e.preventDefault()
      closeAndReturnFocus()
      return
    }
    if (!isArrowKey(e)) return
    e.preventDefault()
    // 过滤态无级联列，不抢焦
    if (props.filterable && filterKeyword.value) return
    if (!internalVisible.value) open()
    const dir = e.key === LH_KEYS.ArrowDown || e.key === LH_KEYS.ArrowRight ? 1 : -1
    const panelIndex = dir > 0 ? 0 : panels.value.length - 1
    if (panels.value[panelIndex]) focusColumnItem(panelIndex)
  }

  function isSelected(pathValues: (string | number)[]): boolean {
    if (props.multiple) {
      return multiSelected.value.some((v) => v.join(',') === pathValues.join(','))
    }
    const value = props.value ?? []
    if (!value.length) return false
    // emitPath=false 时绑定的是末级值，先还原成完整路径再与面板/搜索项的完整路径比较
    const current =
      props.emitPath === false
        ? (expandLastValue(options.value, value[value.length - 1], itemConfig.value) ?? value)
        : value
    return JSON.stringify(current) === JSON.stringify(pathValues)
  }

  function onClickOutside(e: MouseEvent) {
    if (!internalVisible.value) return
    if (panelRef.value?.contains(e.target as Node)) return
    if (containerRef.value?.contains(e.target as Node)) return
    close()
  }

  // 受控值变化时重建多选队列
  watch(
    () => props.value,
    (newVal) => {
      if (!props.multiple) return
      // 受控清空（含 [] 与 undefined）时同步清空标签队列，否则外部清空后标签不消失
      if (!newVal || !newVal.length) {
        multiSelected.value = []
        return
      }
      multiSelected.value = newVal.map((v) => expandLastValue(options.value, v, itemConfig.value) ?? [v])
    },
    { immediate: true },
  )

  onMounted(() => {
    document.addEventListener('click', onClickOutside)
    window.addEventListener('resize', onResizeOrScroll)
    window.addEventListener('scroll', onResizeOrScroll, true)
    // Vue2 无 Teleport：面板 host 移到 teleportTarget（默认 body）
    const host = panelHostRef.value
    const target = teleportTarget.value
    if (host && target && host.parentElement !== target) target.appendChild(host)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside)
    window.removeEventListener('resize', onResizeOrScroll)
    window.removeEventListener('scroll', onResizeOrScroll, true)
    // host 被移出 $el 子树，卸载时主动移除防泄漏
    panelHostRef.value?.remove()
  })

  return {
    formItem,
    containerRef,
    panelRef,
    panelHostRef,
    inputRef,
    panelId,
  triggerAria,
  panelAria,
  columnLabel,
  internalVisible,
    filterKeyword,
    panels,
    searchResults,
    displayPlaceholder,
    displayValue,
    sxStyle,
    containerClasses,
    panelStyle,
    showClear,
    showTags,
    selectedCount,
    visibleTags,
    noMatchText,
    itemTabIndex,
    open,
    handleFocus,
    handleClear,
    onInput,
    onBackspace,
    onItemHover,
  onItemClick,
  onItemKeydown,
  onTriggerKeydown,
  selectSearchResult,
  isPanelActive,
  isSelected,
}
}
