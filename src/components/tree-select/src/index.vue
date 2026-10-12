<script lang="ts">
export default { name: 'LhTreeSelect' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import LhTree from '../../tree/src/index.vue'
import { useLhTreeSelect } from './index'
import type { LhTreeSelectProps, LhTreeNode } from './types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

const props = defineProps({
  data: { type: Array as PropType<LhTreeNode[]>, default: () => [] },
  value: {
    type: [String, Array] as PropType<LhTreeSelectProps['value']>,
    default: undefined,
  },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: undefined },
  teleported: { type: Boolean, default: true },
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const {
  rootRef,
  triggerRef,
  panelRef,
  panelHostRef,
  isOpen,
  expandedKeys,
  selectedKeys,
  checkedKeys,
  displayText,
  placeholderText,
  triggerLabel,
  rootStyle,
  panelStyle,
  toggleOpen,
  onSelectedChange,
  onCheckedChange,
  onExpandedChange,
  handleTriggerKeydown,
} = useLhTreeSelect(props, emit)
</script>

<template>
  <div
    ref="rootRef"
    class="lh-tree-select"
    :class="{
      'lh-tree-select--open': isOpen,
      'lh-tree-select--disabled': disabled,
    }"
    :style="rootStyle"
  >
    <button
      ref="triggerRef"
      type="button"
      class="lh-tree-select__trigger"
      :disabled="disabled || undefined"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="tree"
      :aria-label="triggerLabel"
      @click="toggleOpen"
      @keydown="handleTriggerKeydown"
    >
      <span
        v-if="displayText"
        class="lh-tree-select__value"
      >{{ displayText }}</span>
      <span
        v-else
        class="lh-tree-select__placeholder"
      >{{ placeholderText }}</span>
      <span
        class="lh-tree-select__arrow"
        :class="{ 'lh-tree-select__arrow--open': isOpen }"
        aria-hidden="true"
      >▾</span>
    </button>

    <!--
      Vue2 无 Teleport（红线 #4）：teleported 时 host 在 mounted 被移到 body，
      卸载时若被移走则主动 remove 防泄漏
    -->
    <div ref="panelHostRef" class="lh-tree-select__panel-host">
      <Transition name="lh-fade-in">
        <div
          v-if="isOpen"
          ref="panelRef"
          class="lh-tree-select__panel"
          :style="panelStyle"
          role="listbox"
          :aria-multiselectable="multiple ? 'true' : undefined"
        >
          <LhTree
            :data="data"
            :show-checkbox="multiple"
            :expanded-keys="expandedKeys"
            :selected-keys="selectedKeys"
            :checked-keys="checkedKeys"
            @update:expandedKeys="onExpandedChange"
            @update:selectedKeys="onSelectedChange"
            @update:checkedKeys="onCheckedChange"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>
