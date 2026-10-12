<script lang="ts">
export default { name: 'LhTransfer' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhTransfer } from './index'
import type { LhTransferItem } from './types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

const props = defineProps({
  data: { type: Array as PropType<LhTransferItem[]>, default: () => [] },
  // 默认 undefined：value 未传时走非受控（内部分区），传 [] 表示受控的「左侧为空」
  value: { type: Array as PropType<Array<string | number>>, default: undefined },
  disabled: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const {
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
  transferClasses,
  transferStyle,
  panelClasses,
  sourceTitle,
  targetTitle,
  searchPlaceholder,
  emptyText,
  moveRightLabel,
  moveLeftLabel,
  itemTabIndex,
  onItemKeydown,
  toggleItem,
  checkAll,
  move,
} = useLhTransfer(props, emit)
</script>

<template>
  <div
    :class="transferClasses"
    :style="transferStyle"
  >
    <!-- 左面板（源） -->
    <div :class="panelClasses('left')">
      <div class="lh-transfer-panel__header">
        <label class="lh-transfer-panel__check-all">
          <input
            type="checkbox"
            :checked="leftAllState === 'all'"
            :indeterminate.prop="leftAllState === 'some'"
            :disabled="disabled || undefined"
            @change="checkAll('left')"
          >
          <span>{{ sourceTitle }}</span>
        </label>
        <span class="lh-transfer-panel__count">{{ leftItems.length }} / {{ data.length }}</span>
      </div>

      <div class="lh-transfer-panel__body">
        <input
          v-model="leftQuery"
          type="text"
          class="lh-transfer-panel__search"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
        >
        <ul
          class="lh-transfer-panel__list"
          role="listbox"
          aria-multiselectable="true"
          :aria-label="sourceTitle"
        >
          <li
            v-for="(item, index) in filteredLeft"
            :key="item.key"
            class="lh-transfer-panel__item"
            :class="{ 'lh-transfer-panel__item--disabled': item.disabled }"
            role="option"
            :tabindex="item.disabled ? -1 : itemTabIndex('left', index)"
            :aria-selected="checkedKeys.includes(item.key) ? 'true' : 'false'"
            :aria-disabled="item.disabled || undefined"
            @click="toggleItem(item)"
            @keydown="onItemKeydown($event, 'left', index)"
          >
            <input
              type="checkbox"
              class="lh-transfer-panel__checkbox"
              :checked="checkedKeys.includes(item.key)"
              :disabled="disabled || item.disabled || undefined"
              @click.stop
              @change="toggleItem(item)"
            >
            <span>{{ item.label }}</span>
          </li>
          <li
            v-if="filteredLeft.length === 0"
            class="lh-transfer-panel__empty"
          >{{ emptyText }}</li>
        </ul>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="lh-transfer__actions">
      <button
        type="button"
        class="lh-transfer__button"
        :disabled="leftCheckedCount === 0 || disabled || undefined"
        :aria-label="moveRightLabel"
        @click="move('left-to-right')"
      >›</button>
      <button
        type="button"
        class="lh-transfer__button"
        :disabled="rightCheckedCount === 0 || disabled || undefined"
        :aria-label="moveLeftLabel"
        @click="move('right-to-left')"
      >‹</button>
    </div>

    <!-- 右面板（目标） -->
    <div :class="panelClasses('right')">
      <div class="lh-transfer-panel__header">
        <label class="lh-transfer-panel__check-all">
          <input
            type="checkbox"
            :checked="rightAllState === 'all'"
            :indeterminate.prop="rightAllState === 'some'"
            :disabled="disabled || undefined"
            @change="checkAll('right')"
          >
          <span>{{ targetTitle }}</span>
        </label>
        <span class="lh-transfer-panel__count">{{ rightItems.length }} / {{ data.length }}</span>
      </div>

      <div class="lh-transfer-panel__body">
        <input
          v-model="rightQuery"
          type="text"
          class="lh-transfer-panel__search"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
        >
        <ul
          class="lh-transfer-panel__list"
          role="listbox"
          aria-multiselectable="true"
          :aria-label="targetTitle"
        >
          <li
            v-for="(item, index) in filteredRight"
            :key="item.key"
            class="lh-transfer-panel__item"
            :class="{ 'lh-transfer-panel__item--disabled': item.disabled }"
            role="option"
            :tabindex="item.disabled ? -1 : itemTabIndex('right', index)"
            :aria-selected="checkedKeys.includes(item.key) ? 'true' : 'false'"
            :aria-disabled="item.disabled || undefined"
            @click="toggleItem(item)"
            @keydown="onItemKeydown($event, 'right', index)"
          >
            <input
              type="checkbox"
              class="lh-transfer-panel__checkbox"
              :checked="checkedKeys.includes(item.key)"
              :disabled="disabled || item.disabled || undefined"
              @click.stop
              @change="toggleItem(item)"
            >
            <span>{{ item.label }}</span>
          </li>
          <li
            v-if="filteredRight.length === 0"
            class="lh-transfer-panel__empty"
          >{{ emptyText }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
