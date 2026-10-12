import type { LhComponentSize } from '@lh-ui/share/core/shared'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhSliderProps {
  modelValue?: number | [number, number] | null
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  range?: boolean
  showInput?: boolean
  size?: LhComponentSize
  marks?: Record<number, string>
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhSliderSize = LhComponentSize
