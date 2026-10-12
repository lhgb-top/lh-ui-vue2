import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  buildHeaderCells,
  clampColumnWidth,
  computeVisibleRange,
  cycleSortOrder,
  filterTableRows,
  flattenLeafColumns,
  getCellValue,
  getGridTemplate,
  getHeaderStickyOffsets,
  getStickyOffsets,
  getTableCellClassNames,
  getTableClassNames,
  LH_TABLE_ROW_HEIGHT,
  sortTableRows,
} from '@lh-ui/share/core/table'
import type { LhTableColumn, LhTableHeaderCell, LhTableRow, LhTableSortOrder } from '@lh-ui/share/core/table'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_KEYS } from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
import { useLhZIndex } from '../../../composables'
import { useLhClickOutside, useLhPopper } from '../../../composables/overlay'
import type { LhTableProps } from './types'

export interface LhTableEmits {
  (e: 'sortChange', payload: { prop: string; order: LhTableSortOrder | undefined }): void
  (e: 'rowClick', row: LhTableRow, index: number): void
  (e: 'filterChange', payload: { prop: string; values: (string | number)[] }): void
  (e: 'update:filteredValues', values: Record<string, (string | number)[]>): void
  (e: 'columnResize', payload: { prop: string; width: number }): void
}

/**
 * Table 组件 Composable（纯逻辑在 @lh-ui/share/core/table）
 *
 * Vue2 适配要点：
 * - 筛选/列宽覆盖状态用 ref 对象整体替换（红线 #1：动态加属性不响应）
 * - 无 Teleport：筛选面板 host 在 mounted 移到 body，卸载时移除
 */
export function useLhTable(props: LhTableProps, emit: LhTableEmits) {
  const rootRef = ref<HTMLElement | null>(null)
  const bodyRef = ref<HTMLElement | null>(null)
  const filterPanelRef = ref<HTMLElement | null>(null)
  // 2.7 无 Teleport：筛选面板 host 在 mounted 时移到 body，卸载时移除防泄漏
  const filterPanelHostRef = ref<HTMLElement | null>(null)
  const filterTriggerRefs = ref<HTMLElement[]>([])

  // ---------- 列结构（多级表头） ----------

  const headerCells = computed(() => buildHeaderCells(props.columns))
  const leafColumns = computed(() => flattenLeafColumns(props.columns))

  const headerRows = computed(() => {
    const rows: LhTableHeaderCell[][] = []
    for (const cell of headerCells.value) {
      ;(rows[cell.level] ??= []).push(cell)
    }
    return rows
  })

  const headerDepth = computed(() => headerRows.value.length)

  // ---------- 排序 ----------

  const sortProp = ref<string | undefined>(props.defaultSortProp)
  const sortOrder = ref<LhTableSortOrder | undefined>(props.defaultSortOrder)

  function toggleSort(column: LhTableColumn): void {
    if (!column.sortable) return
    const nextOrder = sortProp.value === column.prop ? cycleSortOrder(sortOrder.value) : 'asc'
    sortProp.value = nextOrder ? column.prop : undefined
    sortOrder.value = nextOrder
    emit('sortChange', { prop: column.prop, order: nextOrder })
  }

  function ariaSort(column: LhTableColumn): 'ascending' | 'descending' | 'none' | undefined {
    if (!column.sortable) return undefined
    if (sortProp.value !== column.prop || !sortOrder.value) return 'none'
    return sortOrder.value === 'asc' ? 'ascending' : 'descending'
  }

  function sortIcon(column: LhTableColumn): string {
    if (sortProp.value !== column.prop || !sortOrder.value) return '↕'
    return sortOrder.value === 'asc' ? '↑' : '↓'
  }

  // ---------- 筛选 ----------

  const innerFiltered = ref<Record<string, (string | number)[]>>({
    ...props.defaultFilteredValues,
  })
  const filteredValues = computed(() => props.filteredValues ?? innerFiltered.value)

  function isColumnFiltered(prop: string): boolean {
    return (filteredValues.value[prop] ?? []).length > 0
  }

  const activeFilters = computed(() =>
    leafColumns.value
      .filter((column) => column.filters?.length)
      .map((column) => ({ column, values: filteredValues.value[column.prop] ?? [] })),
  )

  const openFilterProp = ref<string | null>(null)
  const draftValues = ref<(string | number)[]>([])
  const filterTriggerEl = ref<HTMLElement | null>(null)
  const { nextZIndex } = useLhZIndex()
  const filterPanelZIndex = ref(nextZIndex())

  const filterPanelColumn = computed(() =>
    openFilterProp.value ? leafColumns.value.find((c) => c.prop === openFilterProp.value) ?? null : null,
  )

  function toggleFilter(column: LhTableColumn, event: MouseEvent): void {
    if (openFilterProp.value === column.prop) {
      closeFilter()
      return
    }
    openFilterProp.value = column.prop
    filterPanelZIndex.value = nextZIndex()
    draftValues.value = [...(filteredValues.value[column.prop] ?? [])]
    filterTriggerEl.value = event.currentTarget as HTMLElement
  }

  function closeFilter(): void {
    openFilterProp.value = null
    draftValues.value = []
  }

  function toggleDraftValue(value: string | number): void {
    const i = draftValues.value.indexOf(value)
    if (i === -1) draftValues.value = [...draftValues.value, value]
    else draftValues.value = draftValues.value.filter((v) => v !== value)
  }

  function setDraftValue(value: string | number): void {
    draftValues.value = [value]
  }

  function commitFilter(prop: string, values: (string | number)[]): void {
    innerFiltered.value = { ...filteredValues.value, [prop]: values }
    emit('update:filteredValues', innerFiltered.value)
    emit('filterChange', { prop, values })
  }

  function confirmFilter(): void {
    const prop = openFilterProp.value
    if (!prop) return
    commitFilter(prop, [...draftValues.value])
    closeFilter()
  }

  function resetFilter(): void {
    const prop = openFilterProp.value
    if (!prop) return
    draftValues.value = []
    commitFilter(prop, [])
    closeFilter()
  }

  const { popperStyle: filterPanelPosition } = useLhPopper({
    triggerRef: filterTriggerEl,
    popperRef: filterPanelRef,
    visible: computed(() => openFilterProp.value !== null),
    placement: 'bottom-start',
  })

  const filterPanelStyle = computed(() => ({
    ...filterPanelPosition.value,
    zIndex: String(filterPanelZIndex.value),
  }))

  useLhClickOutside(
    () => [filterPanelRef.value, ...filterTriggerRefs.value],
    () => {
      if (openFilterProp.value) closeFilter()
    },
  )

  // ---------- 列宽拖拽 ----------

  const widthOverrides = ref<Record<string, number>>({})

  function isResizable(column: LhTableColumn): boolean {
    return !!props.resizable && column.resizable !== false && typeof column.width === 'number'
  }

  const resolvedLeafColumns = computed(() =>
    leafColumns.value.map((column) => {
      const override = widthOverrides.value[column.prop]
      return override != null ? { ...column, width: override } : column
    }),
  )

  const stickyOffsets = computed(() => getStickyOffsets(resolvedLeafColumns.value))
  const headerStickyOffsets = computed(() =>
    getHeaderStickyOffsets(resolvedLeafColumns.value, headerCells.value),
  )
  const gridTemplate = computed(() => getGridTemplate(resolvedLeafColumns.value))

  let resizingProp: string | null = null
  let resizeStartX = 0
  let resizeStartWidth = 0

  function onResizeStart(event: MouseEvent, column: LhTableColumn): void {
    if (!isResizable(column)) return
    event.preventDefault()
    // 红线 #8：事件里要跨 nextTick 用的坐标必须同步捕获
    resizingProp = column.prop
    resizeStartX = event.clientX
    resizeStartWidth = widthOverrides.value[column.prop] ?? (column.width as number)
    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
  }

  function onResizeMove(event: MouseEvent): void {
    if (!resizingProp) return
    const next = clampColumnWidth(resizeStartWidth + (event.clientX - resizeStartX))
    widthOverrides.value = { ...widthOverrides.value, [resizingProp]: next }
  }

  function onResizeEnd(): void {
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
    if (resizingProp) {
      const prop = resizingProp
      resizingProp = null
      emit('columnResize', { prop, width: widthOverrides.value[prop] as number })
    }
  }

  function onResizeKeydown(event: KeyboardEvent, column: LhTableColumn): void {
    if (!isResizable(column)) return
    if (event.key !== LH_KEYS.ArrowLeft && event.key !== LH_KEYS.ArrowRight) return
    event.preventDefault()
    const step = (event.key === LH_KEYS.ArrowRight ? 1 : -1) * 10
    const current = widthOverrides.value[column.prop] ?? (column.width as number)
    widthOverrides.value = {
      ...widthOverrides.value,
      [column.prop]: clampColumnWidth(current + step),
    }
    emit('columnResize', { prop: column.prop, width: widthOverrides.value[column.prop] as number })
  }

  // ---------- 数据链：过滤 → 排序 → 虚拟切片 ----------

  const filteredRows = computed(() => filterTableRows(props.data, activeFilters.value))
  const sortedRows = computed(() =>
    sortTableRows(filteredRows.value, sortProp.value ?? '', sortOrder.value, props.sorter),
  )

  const isVirtual = computed(() => props.height != null)
  const scrollTop = ref(0)
  const viewportHeight = ref(0)
  const range = computed(() =>
    computeVisibleRange(scrollTop.value, viewportHeight.value, props.rowHeight ?? LH_TABLE_ROW_HEIGHT, sortedRows.value.length),
  )
  const totalHeight = computed(() => range.value.totalHeight)
  const visibleRows = computed(() =>
    isVirtual.value ? sortedRows.value.slice(range.value.start, range.value.end) : sortedRows.value,
  )
  const windowStyle = computed(() =>
    isVirtual.value ? { transform: `translateY(${range.value.offsetY}px)` } : undefined,
  )
  const rowHeightStyle = computed(() =>
    isVirtual.value ? { height: `${props.rowHeight ?? LH_TABLE_ROW_HEIGHT}px` } : undefined,
  )

  function onScroll(event: Event): void {
    if (!isVirtual.value) return
    scrollTop.value = (event.target as HTMLElement).scrollTop
  }

  let resizeObserver: ResizeObserver | null = null

  function measure(): void {
    const el = bodyRef.value
    if (el) viewportHeight.value = el.clientHeight
  }

  // ---------- 样式与类名 ----------

  function rowKeyOf(row: LhTableRow, index: number): string | number {
    const key = row[props.rowKey ?? 'id']
    return key == null ? index : (key as string | number)
  }

  function cellStyle(colIndex: number): Record<string, string> {
    const sticky = stickyOffsets.value[colIndex]
    const style: Record<string, string> = {}
    if (sticky.left != null) style.left = `${sticky.left}px`
    if (sticky.right != null) style.right = `${sticky.right}px`
    const align = resolvedLeafColumns.value[colIndex].align
    if (align) style.textAlign = align
    return style
  }

  function headerCellStyle(cell: LhTableHeaderCell): Record<string, string> {
    const style: Record<string, string> = {
      gridColumn: `${cell.leafStart + 1} / span ${cell.colspan}`,
      gridRow: `${cell.level + 1} / span ${cell.rowspan}`,
    }
    const sticky = headerStickyOffsets.value[headerCells.value.indexOf(cell)]
    if (sticky?.left != null) style.left = `${sticky.left}px`
    if (sticky?.right != null) style.right = `${sticky.right}px`
    const align = cell.column.align
    if (align) style.textAlign = align
    return style
  }

  const gridRowStyle = computed(() => ({ gridTemplateColumns: gridTemplate.value }))

  const headerStyle = computed(() => ({
    gridTemplateColumns: gridTemplate.value,
    gridTemplateRows: `repeat(${headerDepth.value}, auto)`,
  }))

  function headerCellClasses(cell: LhTableHeaderCell): string[] {
    return getTableCellClassNames({
      align: cell.column.align ?? 'left',
      fixed: cell.column.fixed,
      lastFixedLeft: cell.isLeaf && isLastFixedLeft(cell.leafStart),
      firstFixedRight: cell.isLeaf && isFirstFixedRight(cell.leafStart),
      resizable: cell.isLeaf && isResizable(cell.column),
    })
  }

  function bodyCellClasses(colIndex: number): string[] {
    const column = resolvedLeafColumns.value[colIndex]
    return getTableCellClassNames({
      align: column.align ?? 'left',
      fixed: column.fixed,
      lastFixedLeft: isLastFixedLeft(colIndex),
      firstFixedRight: isFirstFixedRight(colIndex),
    })
  }

  function isLastFixedLeft(leafIndex: number): boolean {
    return resolvedLeafColumns.value[leafIndex + 1]?.fixed !== 'left'
  }

  function isFirstFixedRight(leafIndex: number): boolean {
    return resolvedLeafColumns.value[leafIndex - 1]?.fixed !== 'right'
  }

  const tableClasses = computed(() =>
    getTableClassNames({
      stripe: !!props.stripe,
      border: !!props.border,
      size: props.size ?? 'default',
      virtual: isVirtual.value,
    }),
  )

  const rootStyle = computed(() => sxToStyle(props.sx ?? {}))

  const bodyStyle = computed(() => {
    if (props.height == null) {
      return props.maxHeight == null
        ? undefined
        : {
            maxHeight:
              typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
          }
    }
    return { height: typeof props.height === 'number' ? `${props.height}px` : props.height }
  })

  const emptyText = computed(() => t('table.empty', '暂无数据'))
  const filterTitle = computed(() => t('table.filterTitle', '筛选'))
  const resizeLabel = computed(() => t('table.resizeLabel', '调整列宽'))
  const filterResetText = computed(() => t('table.filterReset', '重置'))
  const filterConfirmText = computed(() => t('table.filterConfirm', '确定'))

  onMounted(() => {
    measure()
    if (typeof ResizeObserver !== 'undefined' && bodyRef.value) {
      resizeObserver = new ResizeObserver(measure)
      resizeObserver.observe(bodyRef.value)
    }
    window.addEventListener('resize', measure)
    // Vue2 无 Teleport：筛选面板 host 移到 body
    const host = filterPanelHostRef.value
    if (host && host.parentElement !== document.body) document.body.appendChild(host)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    window.removeEventListener('resize', measure)
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
    // host 被移出 $el 子树，卸载时主动移除防泄漏
    filterPanelHostRef.value?.remove()
  })

  return {
    rootRef,
    bodyRef,
    filterPanelRef,
    filterPanelHostRef,
    filterTriggerRefs,
    headerRows,
    headerCells,
    leafColumns,
    sortProp,
    sortOrder,
    openFilterProp,
    draftValues,
    filterPanelColumn,
    filterPanelStyle,
    filteredRows,
    sortedRows,
    range,
    totalHeight,
    visibleRows,
    windowStyle,
    rowHeightStyle,
    headerStyle,
    gridRowStyle,
    tableClasses,
    rootStyle,
    bodyStyle,
    emptyText,
    filterTitle,
    resizeLabel,
    filterResetText,
    filterConfirmText,
    toggleSort,
    ariaSort,
    sortIcon,
    isColumnFiltered,
    toggleFilter,
    toggleDraftValue,
    setDraftValue,
    confirmFilter,
    resetFilter,
    isResizable,
    onResizeStart,
    onResizeKeydown,
    onScroll,
    rowKeyOf,
    cellStyle,
    headerCellStyle,
    headerCellClasses,
    bodyCellClasses,
    getCellValue,
  }
}
