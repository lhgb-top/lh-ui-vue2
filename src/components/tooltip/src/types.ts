import type { SxProps } from '@lh-ui/share/core/shared/sx'

/**
 * Tooltip 类型
 */
export type LhTooltipPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
export type LhTooltipTrigger = 'hover' | 'click' | 'focus'
export type LhTooltipEffect = 'dark' | 'light'
export type LhTooltipType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/**
 * Tooltip 组件 Props
 */
export interface LhTooltipProps {
  /** 提示文字内容 */
  content?: string
  /** 展示位置 */
  placement?: LhTooltipPlacement
  /** 触发方式 */
  trigger?: LhTooltipTrigger
  /** 是否禁用 */
  disabled?: boolean
  /** 是否手动控制显示 */
  manual?: boolean
  /** 手动控制的显示状态 */
  visible?: boolean
  /** 延迟显示时间(ms) */
  showAfter?: number
  /** 延迟隐藏时间(ms) */
  hideAfter?: number
  /** 是否默认插槽 */
  openDelay?: number
  /** 关闭延迟 */
  closeDelay?: number
  /** 主题 */
  effect?: LhTooltipEffect
  /** 内置主题色类型（会覆盖 effect 的背景色） */
  type?: LhTooltipType
  /** 自定义背景色（会覆盖 effect 和 type 的背景色） */
  bgColor?: string
  /** 最大宽度 */
  maxWidth?: string | number
  /** 弹层挂载目标（选择器或元素，默认 body；Vue2 通过 DOM 移动实现） */
  teleportTarget?: string | HTMLElement
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性（作用于触发器根元素） */
  sx?: SxProps
}
