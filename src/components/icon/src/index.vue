<template>
  <span
    :class="['lh-icon', props.name ? `lh-icon--${props.name}` : '']"
    :style="mergedStyle"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <svg
      v-if="svgPath"
      viewBox="0 0 24 24"
      :width="iconSize"
      :height="iconSize"
      fill="currentColor"
    >
      <path :d="svgPath" />
    </svg>
    <slot v-else></slot>
  </span>
</template>

<script lang="ts">
// 2.7 无 defineOptions：inheritAttrs: false 让 $attrs 透传到根元素由模板显式控制
export default { name: 'LhIcon', inheritAttrs: false }
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useLhIcon } from './index'
import type { LhIconProps } from './types'

const props = defineProps({
  name: { type: String as PropType<LhIconProps['name']>, default: undefined },
  size: { type: [String, Number] as PropType<string | number>, default: undefined },
  color: { type: String, default: undefined },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
})

const { svgPath, iconStyle, iconSize, componentStyle } = useLhIcon(props)

const mergedStyle = computed(() => ({
  ...iconStyle.value,
  ...componentStyle.value,
}))
</script>
