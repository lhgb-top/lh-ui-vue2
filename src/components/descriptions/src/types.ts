import type { LhDescriptionsItem } from '@lh-ui/share/core/descriptions'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhDescriptionsProps {
  /** 描述列表标题 */
  title?: string
  /** 每行展示的条目列数 */
  column?: number
  /** 是否展示边框 */
  border?: boolean
  /** 条目列表；label/value/span 三元组 */
  items: LhDescriptionsItem[]
  /** sx 快速布局属性 */
  sx?: SxProps
}

export type { LhDescriptionsItem }
