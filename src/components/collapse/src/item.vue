<template>
  <div
    :class="itemClasses"
    :style="itemStyle"
  >
    <h3 class="lh-collapse__header-wrap">
      <button
        :id="headerId"
        type="button"
        class="lh-collapse__header"
        :aria-expanded="expanded ? 'true' : 'false'"
        :aria-controls="contentId"
        :disabled="props.disabled || undefined"
        @click="handleToggle"
      >
        <slot name="title">{{ props.title }}</slot>
        <span
          class="lh-collapse__arrow"
          aria-hidden="true"
        >▾</span>
      </button>
    </h3>
    <div
      :id="contentId"
      class="lh-collapse__wrap"
      role="region"
      :aria-labelledby="headerId"
      :aria-hidden="expanded ? 'false' : 'true'"
    >
      <div class="lh-collapse__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhCollapseItem' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { generateId } from '@lh-ui/share/utils'
import { getCollapseItemClassNames } from '@lh-ui/share/core/collapse'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_COLLAPSE_CONTEXT_KEY } from './types'
import type { LhCollapseItemProps, LhCollapseKey } from './types'
import { computed, inject } from 'vue'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  name: { type: [String, Number] as PropType<LhCollapseKey>, required: true },
  title: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhCollapseItemProps['sx']>, default: undefined },
})

const context = inject(LH_COLLAPSE_CONTEXT_KEY, null)
// 脱离 LhCollapse 单用兜底：视为始终收起
const expanded = computed(() => context?.activeKeys.value.includes(props.name) ?? false)

const headerId = generateId('lh-collapse-header')
const contentId = generateId('lh-collapse-content')

function handleToggle(): void {
  if (props.disabled) return
  context?.toggle(props.name)
}

const itemClasses = computed(() =>
  getCollapseItemClassNames({ active: expanded.value, disabled: !!props.disabled }),
)

const itemStyle = computed(() => sxToStyle(props.sx ?? {}))
</script>
