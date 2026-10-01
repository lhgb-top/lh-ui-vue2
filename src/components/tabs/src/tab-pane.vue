<template>
  <div
    v-show="isActive"
    :id="`${idPrefix}-panel-${name}`"
    role="tabpanel"
    :aria-labelledby="`${idPrefix}-tab-${name}`"
    tabindex="0"
    class="lh-tab-pane"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhTabPane' }
</script>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { LH_TABS_KEY } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：本组件 Props 就地声明
 */
const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const context = inject(LH_TABS_KEY, null)

const isActive = computed(() => (context ? context.activeName.value === props.name : false))
const idPrefix = computed(() => (context ? context.idPrefix : 'lh-tabs'))
</script>
