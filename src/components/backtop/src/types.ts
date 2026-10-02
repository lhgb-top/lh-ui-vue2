import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhBackTopProps {
  /** 滚动容器（选择器或元素，默认视口） */
  target?: string | HTMLElement
  /** 滚动多少像素后出现 */
  visibilityHeight?: number
  /** 距右侧偏移 px */
  right?: number
  /** 距底部偏移 px */
  bottom?: number
  /** 是否平滑滚动 */
  smooth?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}
