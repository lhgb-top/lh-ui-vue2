import type { LhAlertType } from '@lh-ui/share/core/alert'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhAlertProps {
  /** 语义类型 */
  type?: LhAlertType
  /** 标题（也可用 title 插槽） */
  title?: string
  /** 是否可关闭 */
  closable?: boolean
  /** 是否显示语义图标 */
  showIcon?: boolean
  /** 是否浅色朴素样式 */
  plain?: boolean
  /** 关闭按钮的无障碍名称（未传时取语言包 alert.close） */
  closeLabel?: string
  /** sx 快速布局属性 */
  sx?: SxProps
}
