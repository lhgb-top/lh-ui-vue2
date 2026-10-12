import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import { LH_SIZE_CONST, LH_TYPES_CONST } from '@lh-ui/share/constants'

export interface LhButtonProps {
  type?: LhButtonType
  /** 尺寸，可选。若不传则从 ConfigProvider 继承 */
  size?: LhButtonSize
  loading?: boolean
  disabled?: boolean
  plain?: boolean
  block?: boolean
  round?: boolean
  circle?: boolean
  icon?: string
  nativeType?: 'button' | 'submit' | 'reset'
  href?: string
  target?: string
  /** 组件级主题变量，覆盖 ConfigProvider 的全局 themeVars 和 componentTheme */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置（不受 patternComponents 白名单限制） */
  bgPattern?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export const LH_BUTTON_TYPE_CONST = {
  ...LH_TYPES_CONST,
  /** @alias 默认 */
  default: 'default',
  /** @alias 主要 */
  primary: 'primary',
} as const

export const LH_BUTTON_SIZE_CONST = {
  ...LH_SIZE_CONST,
} as const

export type LhButtonType = (typeof LH_BUTTON_TYPE_CONST)[keyof typeof LH_BUTTON_TYPE_CONST]
export type LhButtonSize = (typeof LH_BUTTON_SIZE_CONST)[keyof typeof LH_BUTTON_SIZE_CONST]
