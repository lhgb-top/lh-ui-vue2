import type { LhPlacement, LhPopoverTrigger } from '@lh-ui/share/core/popover'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export type { LhPlacement as LhPopoverPlacement, LhPopoverTrigger }

/**
 * Popover 组件 Props
 */
export interface LhPopoverProps {
  /** 展示位置 */
  placement?: LhPlacement
  /** 触发方式 */
  trigger?: LhPopoverTrigger
  /** 标题 */
  title?: string
  /** 手动控制的显示状态（:visible.sync） */
  visible?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示箭头 */
  arrow?: boolean
  /** 弹出层宽度 */
  width?: string | number
  /** 弹出层自定义类名 */
  popperClass?: string
  /** 弹出层挂载目标（选择器或元素，默认 body；2.7 无 Teleport，host 移动实现） */
  teleportTarget?: string | HTMLElement
  /** 延迟显示时间(ms) */
  showAfter?: number
  /** 延迟隐藏时间(ms) */
  hideAfter?: number
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性（作用于触发器根元素） */
  sx?: SxProps
}
