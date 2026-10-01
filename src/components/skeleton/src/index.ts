import { computed } from 'vue'
import { getSkeletonClassNames, getSkeletonRowWidths } from '@lh-ui/share/core/skeleton'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhSkeletonItemProps, LhSkeletonProps } from './types'

/**
 * Skeleton 组件 Composable（纯逻辑在 @lh-ui/share/core/skeleton）
 */
export function useLhSkeleton(props: LhSkeletonProps) {
  const skeletonClasses = computed(() =>
    getSkeletonClassNames({
      animated: !!props.animated,
      avatar: !!props.avatar,
    }),
  )

  const rowWidths = computed(() => getSkeletonRowWidths(props.rows ?? 3))

  const skeletonStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { skeletonClasses, rowWidths, skeletonStyle }
}

/**
 * SkeletonItem 组件 Composable
 */
export function useLhSkeletonItem(props: LhSkeletonItemProps) {
  const itemStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { itemStyle }
}
