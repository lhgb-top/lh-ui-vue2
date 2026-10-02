import { computed } from 'vue'
import { getGridColClassNames, getGridRowClassNames, getColStyle, resolveResponsiveSize } from '@lh-ui/share/core/grid'
import type { LhColSize } from '@lh-ui/share/core/grid'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { useLhBreakpoint } from '../../../composables'
import type { LhColProps, LhRowProps } from './types'

/**
 * Row 组件 Composable（栅格纯逻辑在 @lh-ui/share/core/grid）
 */
export function useLhRow(props: LhRowProps) {
  const rowClasses = computed(() =>
    getGridRowClassNames({ justify: props.justify, align: props.align, wrap: !!props.wrap }),
  )

  const rowStyle = computed(() => {
    const style: Record<string, string> = { ...sxToStyle(props.sx ?? {}) }
    // gutter 用负外边距抵消子列内边距（横向）/ 行间距（纵向）
    const gutter = props.gutter
    if (gutter) {
      const horizontal = typeof gutter === 'number' ? gutter : gutter[0]
      style.marginInline = `-${horizontal / 2}px`
    }
    return style
  })

  return { rowClasses, rowStyle }
}

/**
 * Col 组件 Composable
 * 当前断点下生效的尺寸：无任何响应式声明时回退到 span/offset/push/pull
 */
export function useLhCol(props: LhColProps) {
  const { breakpoint } = useLhBreakpoint()

  const size = computed<LhColSize>(() => {
    const responsive = resolveResponsiveSize(
      {
        xs: props.xs,
        sm: props.sm,
        md: props.md,
        lg: props.lg,
        xl: props.xl,
        ...props.sizes,
      },
      breakpoint.value,
    )
    if (responsive != null) return responsive
    return {
      span: typeof props.span === 'number' ? props.span : undefined,
      offset: props.offset,
      push: props.push,
      pull: props.pull,
    }
  })

  const colClasses = computed(() => getGridColClassNames(size.value))

  const colStyle = computed(() => ({ ...getColStyle(size.value), ...sxToStyle(props.sx ?? {}) }))

  return { colClasses, colStyle }
}
