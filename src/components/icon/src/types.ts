import type { LhIconName } from '@lh-ui/share/core/icon'

/**
 * Icon 组件 Props
 */
export interface LhIconProps {
  /** 图标名称 */
  name?: LhIconName
  /** 图标尺寸 */
  size?: string | number
  /** 图标颜色 */
  color?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
}

export type LhIconSize = string | number
