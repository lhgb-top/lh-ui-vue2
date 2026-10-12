<template>
  <section
    :class="layoutClasses"
    :style="layoutStyle"
  >
    <slot></slot>
  </section>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhLayout' }
</script>

<script lang="ts" setup>
import { onMounted, onUpdated, ref, useSlots } from 'vue'
import type { PropType, VNode } from 'vue'
import { useLhLayout } from './index'
import type { LhLayoutProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  // 默认 undefined：未显式指定方向时按内容自动判定（含 Header/Footer 或直接 Aside → 纵向），
  // 显式传入 'horizontal'/'vertical' 则完全以传入值为准（Element 同款语义）
  direction: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhLayoutProps['sx']>, default: undefined },
})

const slots = useSlots()

// 默认插槽直接渲染 LhHeader / LhFooter 时自动切纵向（Element 语义）；
// 插槽非响应式（红线 #7）：mounted 与 updated 各探测一次，按值条件落防 updated 循环
const hasHeaderFooter = ref(false)

// 2.7 的 useSlots().default 是 VNode 数组（Vue3 才是函数），两种形态都兼容
function getSlotVnodes(): VNode[] {
  const slot = slots.default as unknown
  if (typeof slot === 'function') return ((slot as () => VNode[])() as VNode[]) ?? []
  return (slot as VNode[]) ?? []
}

function detectHeaderFooter(): boolean {
  return getSlotVnodes().some((vnode) => {
    const name = vnode.componentOptions?.Ctor?.options?.name
    return name === 'LhLayoutHeader' || name === 'LhLayoutFooter'
  })
}

function syncHeaderFooter() {
  const detected = detectHeaderFooter()
  if (detected !== hasHeaderFooter.value) hasHeaderFooter.value = detected
}

onMounted(syncHeaderFooter)
onUpdated(syncHeaderFooter)

const { layoutClasses, layoutStyle } = useLhLayout(props, hasHeaderFooter)
</script>
