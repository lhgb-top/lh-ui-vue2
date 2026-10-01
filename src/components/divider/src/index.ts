import { computed, useSlots } from 'vue'
import { getDividerClassNames, getDividerRole, needsAriaOrientation } from '@lh-ui/share/core/divider'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhDividerProps } from './types'

/**
 * Divider 组件 Composable（纯逻辑在 @lh-ui/share/core/divider）
 */
export function useLhDivider(props: LhDividerProps) {
  const slots = useSlots()

  // 垂直方向不支持文案（各开源库通行约定）
  const hasContent = computed(() => props.direction === 'horizontal' && !!slots.default)

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
