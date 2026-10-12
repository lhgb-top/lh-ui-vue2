import type { LhSpinnerSize } from '@lh-ui/share/core/spinner'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhSpinnerProps {
  /** 尺寸 */
  size?: LhSpinnerSize
  /** 旋转颜色（CSS color 值，未传时继承 currentColor） */
  color?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
