<template>
  <div class="lh-config-provider" :style="cssVars">
    <slot></slot>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhConfigProvider' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhConfigProvider } from './index'
import type { LhConfigProviderProps, LhThemeableComponent } from './types'
import type { LhLocaleType, LhSizes } from '@lh-ui/share/types'

/**
 * 2.7 compiler-sfc 的 type-only defineProps 不支持跨文件 interface（仅同文件字面类型），
 * 契约类型在 types.ts 的组件一律用运行时声明 + PropType 保持精确类型（本仓库标准写法）
 */
const props = defineProps({
  size: { type: String as PropType<LhSizes>, default: undefined },
  locale: { type: String as PropType<LhLocaleType>, default: undefined },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  patternComponents: { type: Array as PropType<LhThemeableComponent[]>, default: undefined },
  componentTheme: {
    type: Object as PropType<LhConfigProviderProps['componentTheme']>,
    default: undefined,
  },
})

const { cssVars } = useLhConfigProvider(props)
</script>
