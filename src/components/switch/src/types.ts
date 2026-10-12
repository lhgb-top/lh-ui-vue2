import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhSwitchProps {
  modelValue?: boolean
  disabled?: boolean
  loading?: boolean
  name?: string
  size?: LhSwitchSize
  activeText?: string
  inactiveText?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhSwitchSize = 'small' | 'medium' | 'large'
