import type { SxProps } from '@lh-ui/share/core/shared/sx'
import type { LhTagType } from '@lh-ui/share/core/tag'

export type { LhTagType }

export interface LhTagProps {
  type?: LhTagType
  size?: LhTagSize
  closable?: boolean
  disabled?: boolean
  round?: boolean
  hit?: boolean
  /** 关闭时的自定义处理 */
  onClose?: (e: Event) => void
  /** sx 快速布局属性 */
  sx?: SxProps
}

export type LhTagSize = 'small' | 'medium' | 'large'
