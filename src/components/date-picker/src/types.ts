import type { LhDatePickerMode } from '@lh-ui/share/core/date-picker'
import type { LhComponentSize } from '@lh-ui/share/core/shared/types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhDatePickerProps {
  /** 当前选中（v-model；支持单日期与日期段时间） */
  value?: Date | [Date, Date] | null
  /** 模式：日期（默认）/ 月份 / 年份 / 日期时间 */
  mode?: LhDatePickerMode
  /** 尺寸 */
  size?: LhComponentSize
  /** 禁用 */
  disabled?: boolean
  /** 可清空 */
  clearable?: boolean
  /** 占位文本 */
  placeholder?: string
  /** 展示格式（yyyy-MM-dd 等） */
  format?: string
  /** 只读（输入框始终不接收手动输入） */
  readonly?: boolean
  /** 日期段模式的分隔符文案 */
  rangeSeparator?: string
  /** 自定义单元格类名 */
  cellClassName?: (date: Date) => string
  /** 弹出层附加类名 */
  popperClass?: string
  /** 弹出层挂载目标（Vue2 无 Teleport；默认 body） */
  teleportTarget?: string | HTMLElement
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
