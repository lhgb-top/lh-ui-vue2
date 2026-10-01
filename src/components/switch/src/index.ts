import { computed, inject } from 'vue'
import { getSwitchClassNames, getSwitchLabel } from '@lh-ui/share/core/switch'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhSwitchProps } from './types'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'

export interface SwitchEmit {
  (event: 'input', value: boolean): void
  (event: 'change', value: boolean): void
}

/**
 * Switch 组件 Composable（纯逻辑在 @lh-ui/share/core/switch）
 */
export function useLhSwitch(props: LhSwitchProps, emit: SwitchEmit) {
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const state = computed(() => ({
    checked: !!props.modelValue,
    disabled: !!props.disabled,
    loading: !!props.loading,
    name: props.name ?? '',
    size: props.size ?? 'medium',
    activeText: props.activeText ?? '',
    inactiveText: props.inactiveText ?? '',
  }))

  const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)

  const switchClasses = computed(() => getSwitchClassNames(state.value))
  const switchLabel = computed(() => getSwitchLabel(state.value))

  function toggle() {
    if (props.disabled || props.loading) return
    const newValue = !props.modelValue
    // Vue2 v-model：input 事件 + change 语义事件
    emit('input', newValue)
    emit('change', newValue)
  }

  function handleKeyup(e: KeyboardEvent) {
    e.preventDefault()
    toggle()
  }

  return { sxStyle, formItem, state, switchClasses, switchLabel, toggle, handleKeyup }
}
