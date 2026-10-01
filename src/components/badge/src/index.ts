import { computed } from 'vue'
import { getBadgeClassNames } from '@lh-ui/share/core/badge'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhBadgeProps } from './types'

/**
 * Badge 组件 Composable（纯逻辑在 @lh-ui/share/core/badge）
 */
export function useLhBadge(props: LhBadgeProps) {
  // sx 快速布局属性：转内联样式作用于根元素
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const shouldShow = computed(() => {
    if (props.hidden) return false
    if (props.isDot) return true
    const val = props.value
    if (val === undefined || val === '') return false
    if (val === 0) return props.showZero
    return true
  })

  const displayValue = computed(() => {
    if (props.content) return props.content
    const val = props.value
    if (val === undefined || val === '') return ''
    const num = Number(val)
    if (Number.isNaN(num)) return String(val)
    const max = props.max ?? 99
    return num > max ? `${max}+` : String(num)
  })

  /**
   * 修饰类挂在根元素上，样式通过 `.lh-badge--x .lh-badge__content` 生效，
   * 因此数量元素固定使用 lh-badge__content，不能复用这些修饰类。
   */
  const badgeClasses = computed(() =>
    getBadgeClassNames({
      type: props.type ?? 'danger',
      size: props.size ?? 'medium',
      isHidden: !shouldShow.value,
      isDot: !!props.isDot,
      isZero: props.value === 0,
    }).filter((name) => name !== 'lh-badge'),
  )

  const badgeStyle = computed(() => {
    if (!props.offset) return {}
    return {
      marginLeft: `${-props.offset[0]}px`,
      marginTop: `${-props.offset[1]}px`,
    }
  })

  return { sxStyle, shouldShow, displayValue, badgeClasses, badgeStyle }
}
