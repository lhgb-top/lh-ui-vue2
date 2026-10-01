import { computed } from 'vue'
import { getDescriptionsClassNames, buildDescriptionRows } from '@lh-ui/share/core/descriptions'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhDescriptionsProps } from './types'

/**
 * Descriptions 组件 Composable（纯逻辑在 @lh-ui/share/core/descriptions）
 */
export function useLhDescriptions(props: LhDescriptionsProps) {
  // sx 快速布局属性：转内联样式作用于根元素
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const rows = computed(() => buildDescriptionRows(props.items, props.column ?? 3))

  const descriptionsClasses = computed(() =>
    getDescriptionsClassNames({
      column: props.column ?? 3,
      border: !!props.border,
    }),
  )

  // label 与 content 各占单元格宽度的一半
  function labelBasis(): number {
    return 100 / ((props.column ?? 3) * 2)
  }

  function contentBasis(span: number): number {
    return (span * 100) / (props.column ?? 3) - labelBasis()
  }

  return { sxStyle, rows, descriptionsClasses, labelBasis, contentBasis }
}
