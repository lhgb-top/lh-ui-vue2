<template>
  <ol
    ref="rootRef"
    :class="rootClasses"
    :style="rootStyle"
    role="list"
  >
    <slot></slot>
  </ol>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhSteps' }
</script>

<script lang="ts" setup>
import { onMounted, onUnmounted, onUpdated, nextTick, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { getStepsLineLastIndices } from '@lh-ui/share/core/steps'
import { useLhSteps } from './index'
import type { LhStepsProps, LhStepsDirection, LhStepStatus } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  current: { type: Number, default: 0 },
  direction: { type: String as PropType<LhStepsDirection>, default: 'horizontal' },
  clickable: { type: Boolean, default: false },
  status: { type: String as PropType<LhStepStatus>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhStepsProps['sx']>, default: undefined },
})

const emit = defineEmits(['update:current', 'change'])

const { rootClasses, rootStyle, itemTokens, lineLastIndices } = useLhSteps(props, emit)

// 按 DOM 位序重排子项 uid：中段 v-if 的 step 卸载重挂曾被 push 到数组尾，
// 序号与 DOM 顺序脱钩；签名比对防「updated → 重渲染」死循环（红线 #7）
const rootRef = ref<HTMLElement | null>(null)
let lastOrderSig = ''
onUpdated(() => {
  if (!rootRef.value) return
  const next = Array.from(
    rootRef.value.querySelectorAll<HTMLElement>('[data-lh-step-item]'),
  ).map((el) => el.getAttribute('data-lh-step-item') ?? '')
  const sig = next.join('|')
  if (sig !== lastOrderSig) {
    lastOrderSig = sig
    itemTokens.value = next
  }
  measureLineLast()
})

// 横向定宽折行时，找出每一行最后一项索引：相邻项纵向偏移量不同即发生了折行，
// 行末项（含全局末项）的连接线会指向行尾空白，由样式层据此隐藏
function measureLineLast() {
  if (!rootRef.value || props.direction !== 'horizontal') {
    lineLastIndices.value = []
    return
  }
  // DOM 顺序即 itemTokens 顺序，与各步骤的 ownIndex 一一对应
  const offsetTops = Array.from(rootRef.value.children).map((el) => (el as HTMLElement).offsetTop)
  lineLastIndices.value = getStepsLineLastIndices(offsetTops)
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  measureLineLast()
  // 容器宽度变化会改变折行位置（ResizeObserver 在 jsdom 等环境不存在，守卫掉）
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    resizeObserver = new ResizeObserver(() => measureLineLast())
    resizeObserver.observe(rootRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

// 步骤增删、方向切换后 DOM 已更新再重算折行位置
watch(
  () => [props.direction, itemTokens.value] as const,
  () => {
    void nextTick().then(measureLineLast)
  },
)
</script>
