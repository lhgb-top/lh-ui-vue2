import type { SxProps } from '@lh-ui/share/core/shared/sx'
import type { LhComponentSize } from '@lh-ui/share/core/shared'

/**
 * Input 类型
 */
export const LH_INPUT_TYPE_CONST = {
  /** @alias 文本 */
  text: 'text',
  /** @alias 多行文本 */
  textarea: 'textarea',
  /** @alias 密码 */
  password: 'password',
  /** @alias 数字 */
  number: 'number',
  /** @alias 邮箱 */
  email: 'email',
  /** @alias 链接 */
  url: 'url',
  /** @alias 电话 */
  tel: 'tel',
  /** @alias 日期 */
  date: 'date',
  /** @alias 时间 */
  time: 'time',
} as const

export type LhInputType = typeof LH_INPUT_TYPE_CONST[keyof typeof LH_INPUT_TYPE_CONST]

/**
 * Input 尺寸
 */
export type LhInputSize = LhComponentSize

/**
 * Input 状态
 */
export const LH_INPUT_STATE_CONST = {
  /** @alias 错误 */
  error: 'error',
  /** @alias 成功 */
  success: 'success',
  /** @alias 警告 */
  warning: 'warning',
} as const

export type LhInputState = typeof LH_INPUT_STATE_CONST[keyof typeof LH_INPUT_STATE_CONST]

/**
 * Input Props 接口
 */
export interface LhInputProps {
  modelValue?: string
  type?: LhInputType
  size?: LhInputSize
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  maxlength?: number
  minlength?: number
  showWordLimit?: boolean
  clearable?: boolean
  prefixIcon?: string
  suffixIcon?: string
  autofocus?: boolean
  autocomplete?: string
  nativeType?: string
  autosize?: boolean | { minRows?: number; maxRows?: number }
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  name?: string
  rows?: number
  tabindex?: number | string
  form?: string
  inputStyle?: Record<string, string>
  label?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性 */
  sx?: SxProps
}
