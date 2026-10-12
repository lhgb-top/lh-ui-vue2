import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhSelectOption } from '@lh-ui/share/core/select'

export type LhSelectSize = 'small' | 'medium' | 'large'

export interface LhSelectProps {
  modelValue?: unknown
  options?: LhSelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: LhSelectSize
  name?: string
  ariaLabel?: string
  popperContainer?: 'body' | HTMLElement | string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhSelectOption }
