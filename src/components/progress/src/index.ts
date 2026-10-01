import { computed } from 'vue'
import {
  clampPercent,
  resolveStatus,
  getProgressClassNames,
  getProgressColor,
  formatPercentText,
} from '@lh-ui/share/core/progress'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhProgressProps } from './types'

/**
 * Progress 组件 Composable（纯逻辑在 @lh-ui/share/core/progress）
 */
export function useLhProgress(props: LhProgressProps) {
  // sx 快速布局属性：转内联样式作用于根元素
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const clamped = computed(() => clampPercent(props.percentage))

  const status = computed(() => resolveStatus(clamped.value, props.status ?? 'normal'))

  const trackColor = computed(() => getProgressColor(status.value, props.color, clamped.value))

  const text = computed(() =>
    props.format ? props.format(clamped.value) : formatPercentText(clamped.value),
  )

  const progressClasses = computed(() =>
    getProgressClassNames({
      type: props.type ?? 'line',
      status: status.value,
      showText: props.showText ?? true,
      strokeWidth: props.strokeWidth ?? 6,
      width: props.width ?? 126,
    }),
  )

  const barStyle = computed(() => ({
    width: `${clamped.value}%`,
    backgroundColor: trackColor.value,
  }))

  // SVG viewBox 为 100x100，描边宽度按画布等比缩放
  const relativeStroke = computed(() => {
    const ratio = (props.strokeWidth ?? 6) / (props.width ?? 126)
    return Number((ratio * 100).toFixed(2))
  })

  const circleRadius = computed(() => 50 - relativeStroke.value / 2)

  const dasharray = computed(() => {
    const circumference = 2 * Math.PI * circleRadius.value
    return `${(clamped.value / 100) * circumference} ${circumference}`
  })

  const circleTransform = computed(() => ({
    transform: 'rotate(-90deg)',
    transformOrigin: 'center',
  }))

  return {
    sxStyle,
    clamped,
    status,
    trackColor,
    text,
    progressClasses,
    barStyle,
    relativeStroke,
    circleRadius,
    dasharray,
    circleTransform,
  }
}
