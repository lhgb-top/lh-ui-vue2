import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhAnchorItem } from '@lh-ui/share/core/anchor'

export interface LhAnchorProps {
  /** 锚点数据（支持子级） */
  items: LhAnchorItem[]
  /** 滚动容器（选择器或元素，默认 window） */
  target?: string | HTMLElement
  /** 锚点区域相对滚动容器顶部的偏移（用于联动判定） */
  offset?: number
  /** 排列方向 */
  direction?: 'vertical' | 'horizontal'
  /** 平滑滚动 */
  smooth?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhAnchorItem, LhFlatAnchorItem } from '@lh-ui/share/core/anchor'
