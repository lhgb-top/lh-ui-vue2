<script lang="ts">
export default { name: 'LhTable' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhTable } from './index'
import type { LhTableColumn, LhTableRow, LhTableSortOrder } from '@lh-ui/share/core/table'
import type { LhTableProps } from './types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

const props = defineProps({
  data: { type: Array as PropType<LhTableRow[]>, default: () => [] },
  columns: { type: Array as PropType<LhTableColumn[]>, default: () => [] },
  height: { type: [Number, String] as PropType<number | string>, default: undefined },
  maxHeight: { type: [Number, String] as PropType<number | string>, default: undefined },
  rowHeight: { type: Number, default: 48 },
  stripe: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  size: {
    type: String as PropType<'small' | 'default' | 'large'>,
    default: 'default',
    validator: (v: string) => ['small', 'default', 'large'].includes(v),
  },
  rowKey: { type: String, default: 'id' },
  defaultSortProp: { type: String, default: undefined },
  defaultSortOrder: {
    type: String as PropType<LhTableSortOrder>,
    default: undefined,
    validator: (v: string) => v === 'asc' || v === 'desc',
  },
  sorter: { type: Function as PropType<LhTableProps['sorter']>, default: undefined },
  resizable: { type: Boolean, default: false },
  defaultFilteredValues: {
    type: Object as PropType<Record<string, (string | number)[]>>,
    default: () => ({}),
  },
  filteredValues: {
    type: Object as PropType<Record<string, (string | number)[]>>,
    default: undefined,
  },
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const emit = defineEmits([
  'sortChange',
  'rowClick',
  'filterChange',
  'update:filteredValues',
  'columnResize',
])

const {
  rootRef,
  bodyRef,
  filterPanelRef,
  filterPanelHostRef,
  filterTriggerRefs,
  headerRows,
  leafColumns,
  sortProp,
  sortOrder,
  openFilterProp,
  draftValues,
  filterPanelColumn,
  filterPanelStyle,
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
} = useLhTable(props, emit)
</script>

<template>
  <div
    ref="rootRef"
    :class="tableClasses"
    :style="rootStyle"
    role="grid"
    :aria-rowcount="data.length"
    :aria-colcount="leafColumns.length"
  >
    <div
      class="lh-table__header"
      role="rowgroup"
      :style="headerStyle"
    >
      <div
        v-for="(row, rowIndex) in headerRows"
        :key="rowIndex"
        class="lh-table__header-row"
        role="row"
      >
        <div
          v-for="cell in row"
          :key="cell.column.prop"
          role="columnheader"
          :class="headerCellClasses(cell)"
          :style="headerCellStyle(cell)"
          :aria-sort="ariaSort(cell.column)"
          :aria-colspan="cell.colspan > 1 ? cell.colspan : undefined"
          :aria-rowspan="cell.rowspan > 1 ? cell.rowspan : undefined"
        >
          <button
            v-if="cell.column.sortable"
            type="button"
            class="lh-table__sort-trigger"
            @click="toggleSort(cell.column)"
          >
            <span>{{ cell.column.label }}</span>
            <span
              class="lh-table__sort-icon"
              :class="{ 'lh-table__sort-icon--active': sortProp === cell.column.prop && sortOrder }"
              aria-hidden="true"
            >{{ sortIcon(cell.column) }}</span>
          </button>
          <span v-else>{{ cell.column.label }}</span>

          <!-- 筛选触发器（仅叶子列） -->
          <button
            v-if="cell.isLeaf && cell.column.filters && cell.column.filters.length"
            ref="filterTriggerRefs"
            type="button"
            class="lh-table__filter-trigger"
            aria-haspopup="true"
            :aria-expanded="openFilterProp === cell.column.prop ? 'true' : 'false'"
            :aria-label="filterTitle"
            @click="toggleFilter(cell.column, $event)"
          >
            <span
              class="lh-table__filter-icon"
              :class="{ 'lh-table__filter-icon--active': isColumnFiltered(cell.column.prop) }"
              aria-hidden="true"
            >⏚</span>
          </button>

          <!-- 列宽拖拽手柄（仅叶子列） -->
          <div
            v-if="cell.isLeaf && isResizable(cell.column)"
            class="lh-table__resize-handle"
            role="separator"
            aria-orientation="vertical"
            :aria-label="resizeLabel"
            tabindex="0"
            @mousedown="onResizeStart($event, cell.column)"
            @keydown="onResizeKeydown($event, cell.column)"
          />
        </div>
      </div>
    </div>

    <!--
      Vue2 无 Teleport（红线 #4）：筛选面板 host 在 mounted 被移到 body，
      卸载时若被移走则主动 remove 防泄漏
    -->
    <div ref="filterPanelHostRef" class="lh-table__filter-panel-host">
      <Transition name="lh-table__filter-fade">
        <div
          v-if="filterPanelColumn"
          ref="filterPanelRef"
          class="lh-table__filter-panel"
          role="group"
          :aria-label="filterTitle"
          :style="filterPanelStyle"
        >
          <div class="lh-table__filter-list">
            <label
              v-for="option in filterPanelColumn.filters"
              :key="String(option.value)"
              class="lh-table__filter-option"
            >
              <input
                v-if="filterPanelColumn.filterMultiple !== false"
                type="checkbox"
                :checked="draftValues.includes(option.value)"
                :value="option.value"
                @change="toggleDraftValue(option.value)"
              >
              <input
                v-else
                type="radio"
                :checked="draftValues.includes(option.value)"
                :value="option.value"
                @change="setDraftValue(option.value)"
              >
              <span>{{ option.text }}</span>
            </label>
          </div>
          <div class="lh-table__filter-actions">
            <button
              type="button"
              class="lh-table__filter-btn"
              @click="resetFilter"
            >{{ filterResetText }}</button>
            <button
              type="button"
              class="lh-table__filter-btn lh-table__filter-btn--primary"
              @click="confirmFilter"
            >{{ filterConfirmText }}</button>
          </div>
        </div>
      </Transition>
    </div>

    <div
      ref="bodyRef"
      class="lh-table__body"
      :style="bodyStyle"
      @scroll="onScroll"
    >
      <div
        v-if="data.length === 0"
        class="lh-table__empty"
      >
        <slot name="empty">{{ emptyText }}</slot>
      </div>

      <div
        v-else
        class="lh-table__phantom"
        :style="{ height: `${totalHeight}px` }"
      >
        <div
          class="lh-table__window"
          :style="windowStyle"
        >
          <div
            v-for="(row, i) in visibleRows"
            :key="rowKeyOf(row, range.start + i)"
            class="lh-table__row"
            role="row"
            :style="{ ...gridRowStyle, ...rowHeightStyle }"
            @click="emit('rowClick', row, range.start + i)"
          >
            <div
              v-for="(column, colIndex) in leafColumns"
              :key="column.prop"
              role="gridcell"
              :class="bodyCellClasses(colIndex)"
              :style="cellStyle(colIndex)"
            >
              <slot
                :name="column.slot"
                :row="row"
                :column="column"
                :index="range.start + i"
                :value="row[column.prop]"
              >{{ getCellValue(row, column) }}</slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
