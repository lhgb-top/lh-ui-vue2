<script lang="ts">
export default { name: 'LhTree' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhTree } from './index'
import type { LhTreeProps, LhTreeNode } from './types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

const props = defineProps({
  data: { type: Array as PropType<LhTreeNode[]>, default: () => [] },
  showCheckbox: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  expandOnClickNode: { type: Boolean, default: true },
  defaultExpandedKeys: { type: Array as PropType<string[]>, default: () => [] },
  expandedKeys: { type: Array as PropType<string[]>, default: undefined },
  defaultSelectedKeys: { type: Array as PropType<string[]>, default: () => [] },
  selectedKeys: { type: Array as PropType<string[]>, default: undefined },
  defaultCheckedKeys: { type: Array as PropType<string[]>, default: () => [] },
  checkedKeys: { type: Array as PropType<string[]>, default: undefined },
  checkStrictly: { type: Boolean, default: false },
  lazy: { type: Boolean, default: false },
  load: { type: Function as PropType<LhTreeProps['load']>, default: undefined },
  disabled: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const emit = defineEmits([
  'update:expandedKeys',
  'update:selectedKeys',
  'update:checkedKeys',
  'select',
  'check',
  'expand',
  'nodeLoad',
])

const {
  flatNodes,
  expanded,
  selected,
  focusedKey,
  tabbableKey,
  loadingKeys,
  treeClasses,
  treeStyle,
  emptyText,
  toggleExpand,
  toggleCheck,
  handleNodeClick,
  handleKeydown,
  nodeClasses,
} = useLhTree(props, emit)
</script>

<template>
  <div
    :class="treeClasses"
    :style="treeStyle"
    role="tree"
    :aria-multiselectable="showCheckbox ? 'true' : undefined"
    @keydown="handleKeydown"
  >
    <div
      v-for="item in flatNodes"
      :key="item.key"
      :class="[
        ...nodeClasses(item),
        { 'lh-tree-node--focused': item.key === focusedKey },
      ]"
      :style="{ paddingInlineStart: `${item.level * 18 + 8}px` }"
      role="treeitem"
      :aria-level="item.level + 1"
      :aria-expanded="item.isLeaf ? undefined : expanded.includes(item.key) ? 'true' : 'false'"
      :aria-selected="selected.includes(item.key) ? 'true' : 'false'"
      :aria-disabled="item.node.disabled || undefined"
      :tabindex="disabled || item.node.disabled ? -1 : item.key === tabbableKey ? 0 : -1"
      :data-tree-key="item.key"
      @click="handleNodeClick(item)"
    >
      <!-- 展开箭头（懒加载中显示 loading 态） -->
      <span
        v-if="!item.isLeaf"
        class="lh-tree-node__arrow"
        :class="{
          'lh-tree-node__arrow--expanded': expanded.includes(item.key),
          'lh-tree-node__arrow--loading': loadingKeys.includes(item.key),
        }"
        aria-hidden="true"
        @click.stop="toggleExpand(item.key)"
      >▸</span>
      <span
        v-else
        class="lh-tree-node__placeholder"
        aria-hidden="true"
      />

      <!-- 勾选框 -->
      <span
        v-if="showCheckbox"
        class="lh-tree-node__checkbox"
        :class="`lh-tree-node__checkbox--${item.checkState}`"
        role="checkbox"
        :aria-checked="item.checkState === 'checked' ? 'true' : item.checkState === 'indeterminate' ? 'mixed' : 'false'"
        :aria-disabled="item.node.disabled || undefined"
        @click.stop="toggleCheck(item.key)"
      >
        <span
          v-if="item.checkState === 'checked'"
          class="lh-tree-node__checkbox-mark"
          aria-hidden="true"
        >✓</span>
      </span>

      <!-- 标签 -->
      <slot
        name="node"
        :node="item.node"
        :level="item.level"
        :expanded="expanded.includes(item.key)"
        :selected="selected.includes(item.key)"
      >
        <span class="lh-tree-node__label">{{ item.node.label }}</span>
      </slot>
    </div>

    <div
      v-if="flatNodes.length === 0"
      class="lh-tree__empty"
    >
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>
