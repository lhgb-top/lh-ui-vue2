import type { InjectionKey } from 'vue'
import type { LhFormRule } from '@lh-ui/share/core/form'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export type LhFormLabelPosition = 'left' | 'right' | 'top'

export interface LhFormProps {
  model: Record<string, unknown>
  rules?: Record<string, LhFormRule[]>
  labelPosition?: LhFormLabelPosition
  labelWidth?: string | number
  inline?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}

export interface LhFormItemProps {
  prop?: string
  label?: string
  required?: boolean
  rules?: LhFormRule[]
}

export interface LhFormContext {
  model: Record<string, unknown>
  rules?: Record<string, LhFormRule[]>
  labelPosition: LhFormLabelPosition
  labelWidth: string | number | undefined
  registerField: (prop: string, validate: () => Promise<boolean>) => () => void
  validateField: (prop: string) => Promise<boolean>
  resetField: (prop: string) => void
}

export interface LhFormItemContext {
  /** 校验错误文案，非空即该校验失败 */
  errorMessage: string
}

export const LH_FORM_CONTEXT_KEY: InjectionKey<LhFormContext> = Symbol('LhFormContext')
export const LH_FORM_ITEM_CONTEXT_KEY: InjectionKey<LhFormItemContext> = Symbol('LhFormItemContext')

export type { LhFormRule }
