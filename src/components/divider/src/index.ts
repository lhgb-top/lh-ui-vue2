import { computed, useSlots } from 'vue'
import { getDividerClassNames, getDividerRole, needsAriaOrientation } from '@lh-ui/share/core/divider'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhDividerProps } from './types'

/**
 * Divider 组件 Composable（纯逻辑在 @lh-ui/share/core/divider）
 */
export function useLhDivider(props: LhDividerProps) {
  const slots = useSlots()

  // 有子节点即带文案：横向左右排布，竖向上下排布（竖向布局由 share 的纵向 flex 承载）
  const hasContent = computed(() => !!slots.default)

  const dividerClasses = computed(() =>
    getDividerClassNames({
      direction: props.direction ?? 'horizontal',
      dashed: !!props.dashed,
      hasContent: hasContent.value,
      labelPosition: props.labelPosition ?? 'center',
    }),
  )

  const role = computed(() => getDividerRole(hasContent.value))

  const ariaOrientation = computed(() =>
    needsAriaOrientation(props.direction ?? 'horizontal', hasContent.value) ? 'vertical' : undefined,
  )

  const dividerStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { hasContent, dividerClasses, role, ariaOrientation, dividerStyle }
}
