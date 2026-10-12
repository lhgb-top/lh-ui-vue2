import type { LhTimePickerMode } from '@lh-ui/share/core/time-picker'
import type { LhComponentSize } from '@lh-ui/share/core/shared/types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhTimePickerProps {
  /** 当前选中（v-model） */
  value?: Date | null
  /** 模式（保留给未来 date-time 联动，当前按时间列渲染） */
  mode?: LhTimePickerMode
  /** 尺寸 */
  size?: LhComponentSize
  /** 禁用 */
  disabled?: boolean
  /** 可清空 */
  clearable?: boolean
  /** 占位文本 */
  placeholder?: string
  /** 展示格式（HH:mm:ss 等；不含 ss 时隐藏秒列） */
  format?: string
  /** 只读 */
  readonly?: boolean
  /** 箭头控制（列头上下按钮） */
  arrowControl?: boolean
  /** 小时步进 */
  stepHour?: number
  /** 分钟步进 */
  stepMinute?: number
  /** 秒步进 */
  stepSecond?: number
  /** 弹出层挂载目标（Vue2 无 Teleport；默认 body） */
  teleportTarget?: string | HTMLElement
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
