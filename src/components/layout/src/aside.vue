<template>
  <aside
    class="lh-layout-aside"
    :style="asideStyle"
    :aria-label="props.ariaLabel"
  >
    <slot></slot>
  </aside>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名
export default { name: 'LhLayoutAside' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhLayoutAside } from './index'
import type { LhLayoutAsideProps } from './types'

const props = defineProps({
  width: { type: [Number, String] as PropType<number | string>, default: undefined },
  ariaLabel: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhLayoutAsideProps['sx']>, default: undefined },
})

const { asideStyle } = useLhLayoutAside(props)
</script>
