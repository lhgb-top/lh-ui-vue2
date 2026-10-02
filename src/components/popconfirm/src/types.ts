import type { LhPlacement, LhPopconfirmType, LhPopconfirmTrigger } from '@lh-ui/share/core/popconfirm'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export type { LhPlacement as LhPopconfirmPlacement, LhPopconfirmType, LhPopconfirmTrigger }

/**
 * Popconfirm 组件 Props
 */
export interface LhPopconfirmProps {
  /** 确认语气 */
  type?: LhPopconfirmType
  /** 展示位置 */
  placement?: LhPlacement
  /** 触发方式 */
  trigger?: LhPopconfirmTrigger
  /** 确认内容（也可用 content 插槽） */
  title?: string
  /** 确认按钮文案（未传时取语言包 popconfirm.confirm） */
  confirmText?: string
  /** 取消按钮文案（未传时取语言包 popconfirm.cancel） */
  cancelText?: string
  /** 确认按钮类型 */
  confirmButtonType?: 'default' | 'primary'
  /** 手动控制的显示状态（:visible.sync） */
  visible?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示语气图标 */
  showIcon?: boolean
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
