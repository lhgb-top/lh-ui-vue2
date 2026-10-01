import type { SxProps } from '@lh-ui/share/core/shared/sx'
import type { LhSegmentedInput, LhSegmentedValue } from '@lh-ui/share/core/segmented'

export interface LhSegmentedProps {
  /** 当前值（受控 v-model） */
  modelValue?: LhSegmentedValue
  /** 选项（字符串快捷写法或对象） */
  options: LhSegmentedInput[]
  disabled?: boolean
  /** 撑满容器 */
  block?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}

export type { LhSegmentedInput, LhSegmentedValue }
