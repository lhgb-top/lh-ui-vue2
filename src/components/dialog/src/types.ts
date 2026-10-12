import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

/**
 * Dialog 组件 Props
 */
export interface LhDialogProps {
  /** 是否显示 */
  modelValue?: boolean
  /** 标题 */
  title?: string
  /** 宽度 */
  width?: string | number
  /** 是否全屏 */
  fullscreen?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
  /** 按 ESC 是否关闭 */
  closeOnPressEscape?: boolean
  /** 是否可拖拽 */
  draggable?: boolean
  /** 是否居中显示（兼容旧版，建议使用 position） */
  center?: boolean
  /** 弹窗位置：top / center / bottom */
  position?: 'top' | 'center' | 'bottom'
  /** 是否锁定滚动 */
  lockScroll?: boolean
  /** 关闭前回调 */
  beforeClose?: (done: () => void) => void
  /** 顶部距离(px) */
  top?: string
  /** z-index */
  zIndex?: number
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhDialogEmits {
  (event: 'input', value: boolean): void
  (event: 'open'): void
  (event: 'close'): void
  (event: 'opened'): void
  (event: 'closed'): void
}
