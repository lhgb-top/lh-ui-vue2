<script lang="ts">
export default { name: 'LhCascader' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import LhIcon from '../../icon'
import { useLhCascader } from './index'
import type { LhCascaderItemConfig, LhCascaderNode, LhCascaderProps } from './types'
import type { LhComponentSize } from '@lh-ui/share/core/shared/types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import { isValidElementOrSelector } from '../../../utils/element-prop'

const props = defineProps({
  value: { type: Array as PropType<(string | number)[]>, default: () => [] },
  options: { type: Array as PropType<LhCascaderNode[]>, default: () => [] },
  size: {
    type: String as PropType<LhComponentSize>,
    default: 'medium',
    validator: (v: string) => ['small', 'medium', 'large'].includes(v),
  },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  placeholder: { type: String, default: '' },
  readonly: { type: Boolean, default: false },
  showAllLevels: { type: Boolean, default: true },
  checkStrictly: { type: Boolean, default: false },
  emitPath: { type: Boolean, default: true },
  multiple: { type: Boolean, default: false },
  cascading: { type: Boolean, default: true },
  separator: { type: String, default: '/' },
  collapseTags: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  itemConfig: { type: Object as PropType<LhCascaderItemConfig>, default: () => ({}) },
  teleportTarget: {
    validator: isValidElementOrSelector,
    default: 'body',
  } as PropType<LhCascaderProps['teleportTarget']>,
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const {
  formItem,
  containerRef,
  panelRef,
  panelHostRef,
  inputRef,
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
  onItemHover,
  onItemClick,
  onItemKeydown,
  onTriggerKeydown,
  selectSearchResult,
  isPanelActive,
  isSelected,
} = useLhCascader(props, emit)
</script>

<template>
  <div
    ref="containerRef"
    :class="containerClasses"
    :aria-invalid="!!formItem?.errorMessage || undefined"
    :style="sxStyle"
    @click="open"
  >
    <!-- 已选标签（多选） -->
    <div
      v-if="showTags"
      class="lh-cascader__tags"
    >
      <div
        v-for="(tag, idx) in visibleTags"
        :key="idx"
        class="lh-cascader__tag"
      >
        {{ tag }}
      </div>
      <span
        v-if="collapseTags && selectedCount > visibleTags.length"
        class="lh-cascader__tag-more"
      >
        +{{ selectedCount - visibleTags.length }}
      </span>
    </div>

    <!-- 输入框 -->
    <div class="lh-cascader__input">
      <input
        ref="inputRef"
        :value="displayValue"
        :placeholder="displayPlaceholder"
        :disabled="disabled"
        :readonly="!filterable"
        :tabindex="disabled ? -1 : 0"
        class="lh-cascader__input-inner"
        v-bind="triggerAria"
        @input="onInput"
        @focus="handleFocus"
        @keydown="onTriggerKeydown"
      >
    </div>

    <!-- 清除按钮 -->
    <button
      v-if="showClear"
      class="lh-cascader__clear"
      type="button"
      @click.stop="handleClear"
    >
      <LhIcon
        name="close"
        size="small"
      />
    </button>

    <!-- 箭头图标 -->
    <LhIcon
      name="arrow-down"
      size="small"
    />

    <!--
      Vue2 无 Teleport（红线 #4）：面板 host 在 mounted 被移到 teleportTarget，
      卸载时若被移走则主动 remove 防泄漏
    -->
    <div ref="panelHostRef" class="lh-cascader__panel-host">
      <Transition name="lh-cascader-panel">
        <div
          v-if="internalVisible"
          ref="panelRef"
          class="lh-cascader__panel"
          :style="panelStyle"
          v-bind="panelAria"
        >
          <div class="lh-cascader-panel">
            <template v-if="filterable && filterKeyword">
              <!-- 搜索结果 -->
              <div class="lh-cascader-panel__search">
                <div
                  v-for="result in searchResults"
                  :key="result.path.join('-')"
                  class="lh-cascader-panel__search-item"
                  :class="{ 'lh-cascader-panel__search-item--active': isSelected(result.path) }"
                  @click="selectSearchResult(result)"
                >
                  <span
                    v-for="(label, i) in result.pathLabels"
                    :key="i"
                  >
                    {{ label }}
                    <span v-if="i < result.pathLabels.length - 1">/</span>
                  </span>
                </div>
                <div
                  v-if="!searchResults.length"
                  class="lh-cascader-panel__empty"
                >
                  <slot name="no-match">{{ noMatchText }}</slot>
                </div>
              </div>
            </template>
            <template v-else>
              <!-- 级联面板列 -->
              <div
                v-for="(panel, pIndex) in panels"
                :key="pIndex"
                class="lh-cascader-panel__column"
                role="listbox"
                :aria-label="columnLabel(pIndex)"
              >
                <div class="lh-cascader-panel__column-body">
                  <div
                    v-for="(item, index) in panel.items"
                    :key="item.value"
                    class="lh-cascader-panel__item"
                    :class="{
                      'lh-cascader-panel__item--active': isPanelActive(pIndex, item.value),
                      'lh-cascader-panel__item--disabled': item.isDisabled,
                    }"
                    role="option"
                    :tabindex="item.isDisabled ? -1 : itemTabIndex(pIndex, index)"
                    :aria-selected="isPanelActive(pIndex, item.value) ? 'true' : 'false'"
                    :aria-disabled="item.isDisabled ? 'true' : undefined"
                    @mouseenter="onItemHover(pIndex, item)"
                    @click="onItemClick(pIndex, item)"
                    @keydown="onItemKeydown($event, pIndex, index)"
                  >
                    <span class="lh-cascader-panel__item-label">{{ item.label }}</span>
                    <LhIcon
                      v-if="item.isExpanded"
                      name="arrow-right"
                      size="small"
                    />
                    <LhIcon
                      v-else-if="item.hasChildren"
                      name="arrow-down"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
