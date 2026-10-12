import { computed, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import {
  filterTransferItems,
  getTransferCheckAllState,
  getTransferClassNames,
  getTransferPanelClassNames,
  moveTransferKeys,
  partitionTransferData,
  toggleTransferChecked,
  toggleTransferCheckAll,
} from '@lh-ui/share/core/transfer'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import {
  LH_KEYS,
  getNextListIndex,
  isActivationKey,
  isArrowKey,
  isEscapeKey,
} from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
import type { LhTransferProps } from './types'

export interface LhTransferEmits {
  /** Vue2 默认 v-model：input 事件 */
  (e: 'input', keys: Array<string | number>): void
  (e: 'change', keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left'): void
}

/**
 * Transfer 组件 Composable（纯逻辑在 @lh-ui/share/core/transfer）
 *
 * Vue2 适配要点：v-model 走默认 value prop + input 事件
 */
export function useLhTransfer(props: LhTransferProps, emit: LhTransferEmits) {
  /** 左侧（源）键受控值；未传时内部兜底为空即全部在右 */
  const innerSourceKeys = ref<Array<string | number>>([])
  const sourceKeys = computed(() =>
    props.value !== undefined && Array.isArray(props.value) ? props.value : innerSourceKeys.value,
  )

  const checkedKeys = ref<Array<string | number>>([])
  const leftQuery = ref('')
  const rightQuery = ref('')

  const partitioned = computed(() => partitionTransferData(props.data, sourceKeys.value))
  const leftItems = computed(() => partitioned.value.left)
  const rightItems = computed(() => partitioned.value.right)
  const filteredLeft = computed(() => filterTransferItems(leftItems.value, leftQuery.value))
  const filteredRight = computed(() => filterTransferItems(rightItems.value, rightQuery.value))

  const leftAllState = computed(() => getTransferCheckAllState(checkedKeys.value, leftItems.value))
  const rightAllState = computed(() => getTransferCheckAllState(checkedKeys.value, rightItems.value))

  const leftCheckedCount = computed(() =>
    leftItems.value.filter((item) => checkedKeys.value.includes(item.key) && !item.disabled).length,
  )
  const rightCheckedCount = computed(() =>
    rightItems.value.filter((item) => checkedKeys.value.includes(item.key) && !item.disabled).length,
  )

  /**
   * roving tabindex：每个面板只有一个 option 可 Tab 进入，其余 -1
   *
   * 焦点跟着「最近勾选项」走：勾选后焦点停在被勾项，符合「空格勾选 → 继续移动」的
   * 键盘操作心智；无勾选时落在首项
   */
  const leftFocusIndex = ref(-1)
  const rightFocusIndex = ref(-1)

  function focusIndex(side: 'left' | 'right'): Ref<number> {
    return side === 'left' ? leftFocusIndex : rightFocusIndex
  }

  function listItems(side: 'left' | 'right'): LhTransferItem[] {
    return side === 'left' ? filteredLeft.value : filteredRight.value
  }

  /** 最近勾选项位置，没有则首项 */
  function anchorIndex(side: 'left' | 'right'): number {
    const items = listItems(side)
    const lastChecked = items.findIndex((item) => checkedKeys.value.includes(item.key))
    return lastChecked >= 0 ? lastChecked : 0
  }

  function resolveFocus(side: 'left' | 'right'): number {
    const items = listItems(side)
    const idx = focusIndex(side).value
    if (idx >= 0 && idx < items.length) return idx
    // 锚点项被禁用时（如 disabled 项排在最前）回落到首个可用项，保证每列总有 tab 落点
    if (items[anchorIndex(side)]?.disabled) {
      return getNextListIndex(items, -1, 'first', {
        loop: false,
        isDisabled: (item) => !!item.disabled,
      })
    }
    return anchorIndex(side)
  }

  function itemTabIndex(side: 'left' | 'right', index: number): number {
    return index === resolveFocus(side) ? 0 : -1
  }

  function resetFocus(side: 'left' | 'right'): void {
    focusIndex(side).value = -1
  }

  /**
   * 列表项键盘导航（listbox 模式）
   *
   * - 上下方向键在过滤后的列表内移动焦点（跳过禁用项，不循环）
   * - Enter / Space 勾选当前项（与点击等价）
   * - 左右方向键在两面板间跳焦：左列表右移到右列表，右列表左移回左列表
   */
  function onItemKeydown(e: KeyboardEvent, side: 'left' | 'right', index: number): void {
    if (props.disabled) return
    if (isEscapeKey(e)) {
      e.preventDefault()
      resetFocus(side)
      return
    }
    if (isActivationKey(e)) {
      e.preventDefault()
      const item = listItems(side)[index]
      if (item) toggleItem(item)
      return
    }
    if (!isArrowKey(e)) return
    e.preventDefault()

    // 左右方向键跨面板跳焦
    if (e.key === LH_KEYS.ArrowRight && side === 'left') {
      resetFocus('left')
      focusPanel('right', e.currentTarget as HTMLElement)
      return
    }
    if (e.key === LH_KEYS.ArrowLeft && side === 'right') {
      resetFocus('right')
      focusPanel('left', e.currentTarget as HTMLElement)
      return
    }

    // 上下方向键：列表内移动（纵向）
    const isDown = e.key === LH_KEYS.ArrowDown
    const items = listItems(side)
    const next = getNextListIndex(items, index, isDown ? 1 : -1, {
      loop: false,
      isDisabled: (item) => !!item.disabled,
    })
    if (next !== index) focusIndex(side).value = next
  }

  /** 把焦点移到目标面板的可 Tab 项（无函数 ref，靠类名查询 DOM） */
  function focusPanel(side: 'left' | 'right', from?: HTMLElement): void {
    nextTick(() => {
      // 查询限定在本实例子树：document 级 querySelector 在同页多个 Transfer 时
      // 会把焦点落到别的实例（与 cascader/tabs 的子树限定口径一致）
      const scope = from?.closest('.lh-transfer') ?? document
      const panel = scope.querySelector(
        side === 'left' ? '.lh-transfer-panel--left' : '.lh-transfer-panel--right',
      )
      panel?.querySelector<HTMLElement>('.lh-transfer-panel__item[tabindex="0"]')?.focus()
    })
  }

  function toggleItem(item: LhTransferItem): void {
    if (props.disabled || item.disabled) return
    checkedKeys.value = toggleTransferChecked(checkedKeys.value, item.key)
  }

  function checkAll(side: 'left' | 'right'): void {
    if (props.disabled) return
    const items = side === 'left' ? leftItems.value : rightItems.value
    checkedKeys.value = toggleTransferCheckAll(checkedKeys.value, items)
  }

  function move(direction: 'left-to-right' | 'right-to-left'): void {
    if (props.disabled) return
    const next = moveTransferKeys(sourceKeys.value, props.data, checkedKeys.value, direction)
    innerSourceKeys.value = next
    emit('input', next)
    emit('change', next, direction)
    checkedKeys.value = []
  }

  const transferClasses = computed(() => getTransferClassNames({ disabled: !!props.disabled }))
  const transferStyle = computed(() => sxToStyle(props.sx ?? {}))
  const panelClasses = (side: 'left' | 'right') => getTransferPanelClassNames(side)

  const sourceTitle = computed(() => t('transfer.sourceTitle', '列表一'))
  const targetTitle = computed(() => t('transfer.targetTitle', '列表二'))
  const searchPlaceholder = computed(() => t('transfer.searchPlaceholder', '请输入搜索内容'))
  const emptyText = computed(() => t('transfer.empty', '暂无数据'))
  const moveRightLabel = computed(() => t('transfer.moveRight', '移到右侧'))
  const moveLeftLabel = computed(() => t('transfer.moveLeft', '移到左侧'))

  return {
    checkedKeys,
    leftQuery,
    rightQuery,
    leftItems,
    rightItems,
    filteredLeft,
    filteredRight,
    leftAllState,
    rightAllState,
    leftCheckedCount,
    rightCheckedCount,
    itemTabIndex,
    onItemKeydown,
    transferClasses,
    transferStyle,
    panelClasses,
    sourceTitle,
    targetTitle,
    searchPlaceholder,
    emptyText,
    moveRightLabel,
    moveLeftLabel,
    toggleItem,
    checkAll,
    move,
  }
}
