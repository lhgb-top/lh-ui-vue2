import type { LhBadgeType } from '@lh-ui/share/core/badge'
import type { LhComponentSize } from '@lh-ui/share/core/shared'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhBadgeProps {
  type?: LhBadgeType
  value?: string | number
  size?: LhBadgeSize
  max?: number
  isDot?: boolean
  hidden?: boolean
  offset?: LhBadgeOffset
  showZero?: boolean
  content?: string
  /** sx 快速布局属性 */
  sx?: SxProps
}

export type LhBadgeSize = LhComponentSize
export type LhBadgeOffset = [number, number]
