import type { LhProgressStatus, LhProgressType } from '@lh-ui/share/core/progress'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhProgressProps {
  /** 进度百分比 0-100（超出会自动钳制） */
  percentage: number
  type?: LhProgressType
  status?: LhProgressStatus
  /** 进度条颜色：字符串或按百分比返回颜色的函数 */
  color?: string | ((percentage: number) => string)
  /** 线条宽度 px（line 为高度，circle 为描边宽度） */
  strokeWidth?: number
  /** 圆形模式画布宽度 px */
  width?: number
  showText?: boolean
  /** 自定义文字格式化 */
  format?: (percentage: number) => string
  /** sx 快速布局属性 */
  sx?: SxProps
}

export type { LhProgressStatus, LhProgressType }
