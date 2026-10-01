import { computed, inject } from 'vue'
import {
  clampValue,
  incrementValue,
  decrementValue,
  shouldDisableIncrement,
  shouldDisableDecrement,
} from '@lh-ui/share/core/input-number'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'
import type { LhInputNumberProps } from './types'

export interface LhInputNumberEmits {
  /** v-model：modelValue prop / input 事件 */
  (e: 'input', value: number | null): void
  (e: 'change', value: number | null): void
}

/**
 * InputNumber 组件 Composable（纯逻辑在 @lh-ui/share/core/input-number）
 */
export function useLhInputNumber(props: LhInputNumberProps, emit: LhInputNumberEmits) {
  // sx 快速布局属性：转内联样式作用于根元素
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)

  const state = computed(() => {
    // 运行时 default 不收窄 undefined（2.7）：核心 state 统一落定具体值
    const min = props.stepStrictly
      ? clampValue(props.min ?? -Infinity, 0, (props.step ?? 1) * 1000)
      : (props.min ?? -Infinity)
    return {
      value: props.modelValue ?? null,
      min,
      max: Math.max(min, props.max ?? Infinity),
      step: Math.abs(props.step ?? 1),
      disabled: !!props.disabled,
      size: props.size ?? 'medium',
      controls: props.controls ?? true,
      precision: props.precision,
      placeholder: props.placeholder ?? '',
    }
  })

  const wrapperClasses = computed(() => [
    'lh-input-number',
    `lh-input-number--${props.size}`,
    { 'lh-input-number--disabled': props.disabled },
  ])

  const isDecreaseDisabled = computed(() => shouldDisableDecrement(state.value))
  const isIncreaseDisabled = computed(() => shouldDisableIncrement(state.value))

  const displayValue = computed(() => (props.modelValue !== null ? String(props.modelValue) : ''))

  function handleIncrement() {
    if (isIncreaseDisabled.value || props.disabled) return
    const newVal = incrementValue(
      props.modelValue ?? null,
      props.step ?? 1,
      state.value.min,
      state.value.max,
      props.precision,
    )
    emit('input', newVal)
    emit('change', newVal)
  }

  function handleDecrement() {
    if (isDecreaseDisabled.value || props.disabled) return
    const newVal = decrementValue(
      props.modelValue ?? null,
      props.step ?? 1,
      state.value.min,
      state.value.max,
      props.precision,
    )
    emit('input', newVal)
    emit('change', newVal)
  }

  function handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement
    const raw = target.value.trim()
    if (raw === '') {
      emit('input', null)
      emit('change', null)
      return
    }
    let num = Number(raw)
    if (Number.isNaN(num)) return
    if (props.precision !== undefined) {
      num = Number(num.toFixed(props.precision))
    }
    num = clampValue(num, state.value.min, state.value.max)
    if (props.stepStrictly) {
      const step = props.step ?? 1
      const mod = (num - state.value.min) % step
      if (mod !== 0) {
        num += mod >= step / 2 ? step - mod : -mod
        num = clampValue(num, state.value.min, state.value.max)
      }
    }
    emit('input', num)
    emit('change', num)
  }

  return {
    sxStyle,
    formItem,
    wrapperClasses,
    isDecreaseDisabled,
    isIncreaseDisabled,
    displayValue,
    handleIncrement,
    handleDecrement,
    handleInputChange,
  }
}
