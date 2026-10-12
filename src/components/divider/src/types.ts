import type { LhDividerDirection, LhDividerLabelPosition } from '@lh-ui/share/core/divider'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhDividerProps {
  /** 分割线方向 */
  direction?: LhDividerDirection
  /** 是否虚线 */
  dashed?: boolean
  /** 带文案时的对齐位置 */
  labelPosition?: LhDividerLabelPosition
  /** 边框样式（如 'solid' / 'dashed' / 'dotted'），优先于 dashed */
  borderStyle?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
