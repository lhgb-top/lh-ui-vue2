import type { LhSpaceAlignment, LhSpaceSizeInput } from '@lh-ui/share/core/space'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhSpaceProps {
  /** 排列方向 */
  direction?: 'horizontal' | 'vertical'
  /** 间距：预设档位 / 像素数字 / [水平, 垂直] */
  size?: LhSpaceSizeInput
  /** 是否允许换行（仅水平方向） */
  wrap?: boolean
  /** 对齐方式 */
  alignment?: LhSpaceAlignment
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
