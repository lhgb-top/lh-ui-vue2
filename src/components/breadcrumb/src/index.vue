<template>
  <nav
    ref="rootRef"
    class="lh-breadcrumb"
    :style="rootStyle"
    :aria-label="t('breadcrumb.label', '面包屑导航')"
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
import { onUpdated, ref } from 'vue'
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

const { rootStyle, itemTokens } = useLhBreadcrumb(props)

// 按 DOM 位序重排子项 uid：中段 v-if 的 item 卸载重挂曾被 push 到数组尾，
// 序号/折叠判定与 DOM 顺序脱钩；签名比对防「updated → 重渲染」死循环（红线 #7）
const rootRef = ref<HTMLElement | null>(null)
let lastOrderSig = ''
onUpdated(() => {
  if (!rootRef.value) return
  const next = Array.from(
    rootRef.value.querySelectorAll<HTMLElement>('[data-lh-bc-item]'),
  ).map((el) => el.getAttribute('data-lh-bc-item') ?? '')
  const sig = next.join('|')
  if (sig !== lastOrderSig) {
    lastOrderSig = sig
    itemTokens.value = next
  }
})
</script>
