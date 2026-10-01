import { computed } from 'vue'
import { formatStatisticValue } from '@lh-ui/share/core/statistic'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhStatisticProps } from './types'

/**
 * Statistic 组件 Composable（纯逻辑在 @lh-ui/share/core/statistic）
 */
export function useLhStatistic(props: LhStatisticProps) {
  // sx 快速布局属性：转内联样式作用于根元素
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const displayValue = computed(() =>
    formatStatisticValue(props.value, {
      precision: props.precision ?? 0,
      separator: props.separator ?? ',',
    }),
  )

  return { sxStyle, displayValue }
}
