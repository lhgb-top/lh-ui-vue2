import type { LhDrawerDirection } from '@lh-ui/share/core/drawer'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export type { LhDrawerDirection }

/**
 * Drawer 组件 Props
 */
export interface LhDrawerProps {
  /** 是否显示（v-model） */
  modelValue?: boolean
  /** 标题 */
  title?: string
  /** 方向 */
  direction?: LhDrawerDirection
  /** 尺寸：数字为 px，字符串支持百分比 */
  size?: string | number
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 弹出层挂载目标（选择器或元素，默认 body；2.7 无 Teleport，host 移动实现） */
  teleportTarget?: string | HTMLElement
  /** 是否锁定页面滚动 */
  lockScroll?: boolean
  /** 是否响应 Esc 关闭 */
  closeOnEsc?: boolean
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性（作用于面板） */
  sx?: LhSxProps
}
