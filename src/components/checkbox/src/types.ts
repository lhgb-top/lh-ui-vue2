import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export type LhCheckboxSize = 'small' | 'medium' | 'large'

export interface LhCheckboxProps {
  /** 双绑选中状态（Vue2 model：prop=modelValue, event=input） */
  modelValue?: boolean
  /** 在 LhCheckboxGroup 中使用时的成员值 */
  value?: unknown
  label?: string
  disabled?: boolean
  indeterminate?: boolean
  name?: string
  size?: LhCheckboxSize
  /** sx 快速布局属性 */
  sx?: SxProps
}

export interface LhCheckboxGroupProps {
  modelValue?: unknown[]
  disabled?: boolean
  name?: string
  size?: LhCheckboxSize
}

/**
 * 红线 #6：provide 的必须是 computed 引用而非 props 快照，
 * group 的 disabled/name/size 变化才能传导给子 checkbox
 */
export interface LhCheckboxGroupContext {
  values: Ref<unknown[]>
  disabled: ComputedRef<boolean>
  name: ComputedRef<string | undefined>
  size: ComputedRef<LhCheckboxSize>
  toggle: (value: unknown, checked: boolean) => void
}

export const LH_CHECKBOX_GROUP_KEY: InjectionKey<LhCheckboxGroupContext> =
  Symbol('LhCheckboxGroup')
