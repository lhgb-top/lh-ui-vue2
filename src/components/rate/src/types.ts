import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhRateProps {
  /** 当前评分（受控 v-model） */
  modelValue?: number
  /** 星数上限 */
  max?: number
  /** 允许半星 */
  allowHalf?: boolean
  /** 只读（输出星级文本供屏读） */
  readonly?: boolean
  disabled?: boolean
  /** 自定义字符（默认 ★） */
  character?: string
  /** 显示分数文本 */
  showScore?: boolean
  /** 分数模板（{n} 占位） */
  scoreTemplate?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
