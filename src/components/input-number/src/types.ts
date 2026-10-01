import type { LhComponentSize } from '@lh-ui/share/core/shared'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhInputNumberProps {
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  stepStrictly?: boolean
  precision?: number
  disabled?: boolean
  size?: LhComponentSize
  controls?: boolean
  placeholder?: string
  name?: string
  /** sx 快速布局属性 */
  sx?: SxProps
}

export type LhInputNumberSize = LhComponentSize
