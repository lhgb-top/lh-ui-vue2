<template>
  <nav
    class="lh-breadcrumb"
    :style="rootStyle"
    :aria-label="t('breadcrumb.label', 'Breadcrumb')"
  >
    <ol class="lh-breadcrumb__list">
      <slot></slot>
    </ol>
  </nav>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhBreadcrumb' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhBreadcrumb } from './index'
import { t } from '../../../locale'
import type { LhBreadcrumbProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  separator: { type: String, default: '/' },
  maxItems: { type: Number, default: 0 },
  sx: { type: [Object, Array, String] as PropType<LhBreadcrumbProps['sx']>, default: undefined },
})

const { rootStyle } = useLhBreadcrumb(props)
</script>
