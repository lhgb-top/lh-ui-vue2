import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhAffixProps {
  /** 距视口顶部多少像素触发吸顶 */
  offsetTop?: number
  /** 距视口底部多少像素触发吸底（优先于 offsetTop） */
  offsetBottom?: number
  /** 滚动监听容器（选择器或元素，默认视口） */
  target?: string | HTMLElement
  /** sx 快速布局属性 */
  sx?: SxProps
}
