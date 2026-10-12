import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { LH_SIZE_CONST } from '@lh-ui/share/constants'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export type LhRadioSize = typeof LH_SIZE_CONST[keyof typeof LH_SIZE_CONST]

export interface LhRadioProps {
  modelValue?: unknown
  /** 本单选框的取值（在 group 中用于匹配） */
  value?: unknown
  label?: string
  disabled?: boolean
  name?: string
  size?: LhRadioSize
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhRadioGroupProps {
  modelValue?: unknown
  disabled?: boolean
  name?: string
  size?: LhRadioSize
}

/**
 * 红线 #6：provide 的必须是 computed 引用而非 props 快照
 */
export interface LhRadioGroupContext {
  modelValue: Ref<unknown>
  disabled: ComputedRef<boolean>
  name: ComputedRef<string | undefined>
  size: ComputedRef<LhRadioSize>
  onChange: (value: unknown) => void
}

export const LH_RADIO_GROUP_KEY: InjectionKey<LhRadioGroupContext> = Symbol('LhRadioGroup')
