<template>
  <div
    :class="rootClasses"
    :style="rootStyle"
  >
    <div
      class="lh-tabs__header"
      role="tablist"
      @keydown="onKeydown"
    >
      <button
        v-for="pane in records"
        :id="`${idPrefix}-tab-${pane.name}`"
        :key="pane.name"
        type="button"
        role="tab"
        class="lh-tabs__tab"
        :class="{
          'lh-tabs__tab--active': pane.name === activeName,
          'lh-tabs__tab--disabled': pane.disabled,
        }"
        :aria-selected="pane.name === activeName ? 'true' : 'false'"
        :aria-controls="`${idPrefix}-panel-${pane.name}`"
        :tabindex="pane.name === activeName ? 0 : -1"
        :disabled="pane.disabled"
        :data-name="pane.name"
        @click="setActive(pane.name)"
      >
        <span class="lh-tabs__tab-label">{{ pane.label }}</span>
        <span
          v-if="closable && !pane.disabled"
          class="lh-tabs__tab-close"
          aria-hidden="true"
          @click.stop="removePane(pane.name)"
        >✕</span>
      </button>
      <button
        v-if="addable"
        type="button"
        class="lh-tabs__add"
        :aria-label="t('tabs.add', '新增标签页')"
        @click="emit('tab-add')"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>

    <div class="lh-tabs__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
// v-model 走 modelValue prop / input 事件
export default {
  name: 'LhTabs',
  model: { prop: 'modelValue', event: 'input' },
}
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhTabs } from './index'
import { t } from '../../../locale'
import type { LhTabsProps, LhTabsType, LhTabsPosition } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  modelValue: { type: String, default: undefined },
  type: { type: String as PropType<LhTabsType>, default: 'line' },
  closable: { type: Boolean, default: false },
  addable: { type: Boolean, default: false },
  tabPosition: { type: String as PropType<LhTabsPosition>, default: 'top' },
  sx: { type: [Object, Array, String] as PropType<LhTabsProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'tab-change', 'tab-remove', 'tab-add'])

const { records, activeName, idPrefix, setActive, removePane, onKeydown, rootClasses, rootStyle } =
  useLhTabs(props, emit)
</script>
