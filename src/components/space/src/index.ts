import { computed } from 'vue'
import { getSpaceClassNames, resolveSpaceGaps } from '@lh-ui/share/core/space'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhSpaceProps } from './types'

/**
 * Space 组件 Composable（纯逻辑在 @lh-ui/share/core/space）
 */
export function useLhSpace(props: LhSpaceProps) {
  const spaceClasses = computed(() =>
    getSpaceClassNames({
      direction: props.direction ?? 'horizontal',
      wrap: props.direction === 'horizontal' && (props.wrap ?? true),
      size: typeof props.size === 'string' ? props.size : 'custom',
    }),
  )

  // 间距交给原生 CSS gap（flex/grid 原生能力），无 JS 测量；
  // sx 展开在最后，消费者可覆盖对齐与间距
  const spaceStyle = computed(() => {
    const { columnGap, rowGap } = resolveSpaceGaps(props.size ?? 'medium')
    return {
      columnGap,
      rowGap,
      alignItems: props.alignment,
      ...sxToStyle(props.sx ?? {}),
    }
  })

  return { spaceClasses, spaceStyle }
}
