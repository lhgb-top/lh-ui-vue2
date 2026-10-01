import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhEmptyProps {
  /** 空状态描述文案（未传时取语言包 empty.description） */
  description?: string
  /** 自定义图片 URL（替代默认内联插画） */
  image?: string
  /** sx 快速布局属性 */
  sx?: SxProps
}
