<template>
  <header
    class="lh-layout-header"
    :style="sectionStyle"
  >
    <slot></slot>
  </header>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名
export default { name: 'LhLayoutHeader' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhLayoutSection } from './index'
import type { LhLayoutSectionProps } from './types'

const props = defineProps({
  sx: { type: [Object, Array, String] as PropType<LhLayoutSectionProps['sx']>, default: undefined },
})

const { sectionStyle } = useLhLayoutSection(props)
</script>
