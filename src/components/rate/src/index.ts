import { computed } from 'vue'
import {
  clampRate,
  getRateAriaText,
  getRateClassNames,
  getStarFill,
  stepRate,
} from '@lh-ui/share/core/rate'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_KEYS } from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
import type { LhRateProps } from './types'

export interface LhRateEmits {
  /** v-model：modelValue prop / input 事件 */
  (e: 'input', value: number): void
  (e: 'change', value: number): void
}

/**
 * Rate 组件 Composable（纯逻辑在 @lh-ui/share/core/rate；文案走 locale 适配层）
 */
export function useLhRate(props: LhRateProps, emit: LhRateEmits) {
  const value = computed(() => clampRate(props.modelValue, props.max ?? 5))

  const ariaText = computed(() => getRateAriaText(value.value, t('rate.stars', '{n} 星')))

  const starAria = (i: number) => getRateAriaText(i, t('rate.stars', '{n} 星'))

  const scoreText = computed(() =>
    getRateAriaText(value.value, props.scoreTemplate ?? t('rate.stars', '{n} 星')),
  )

  const fillOf = (i: number) => getStarFill(value.value, i, !!props.allowHalf)

  function commit(next: number): void {
    const clamped = clampRate(next, props.max ?? 5)
    if (clamped === value.value) return
    emit('input', clamped)
    emit('change', clamped)
  }

  /** 点击第 i 颗星：半星模式下命中左半区取 i - 0.5 */
  function select(i: number, event?: MouseEvent): void {
    if (props.disabled) return
    if (props.allowHalf && event) {
      const target = event.currentTarget as HTMLElement | null
      if (target && typeof event.offsetX === 'number' && event.offsetX < target.clientWidth / 2) {
        commit(i - 0.5)
        return
      }
    }
    commit(i)
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (props.disabled) return
    const max = props.max ?? 5
    const actions: Record<string, () => void> = {
      [LH_KEYS.ArrowRight]: () => commit(stepRate(value.value, 1, !!props.allowHalf, max)),
      [LH_KEYS.ArrowUp]: () => commit(stepRate(value.value, 1, !!props.allowHalf, max)),
      [LH_KEYS.ArrowLeft]: () => commit(stepRate(value.value, -1, !!props.allowHalf, max)),
      [LH_KEYS.ArrowDown]: () => commit(stepRate(value.value, -1, !!props.allowHalf, max)),
      [LH_KEYS.Home]: () => commit(0),
      [LH_KEYS.End]: () => commit(max),
    }
    const action = actions[event.key]
    if (action) {
      event.preventDefault()
      action()
    }
  }

  const rateClasses = computed(() =>
    getRateClassNames({
      max: props.max ?? 5,
      value: value.value,
      allowHalf: !!props.allowHalf,
      readonly: !!props.readonly,
      disabled: !!props.disabled,
    }),
  )

  const rateStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { value, ariaText, starAria, scoreText, fillOf, select, handleKeydown, rateClasses, rateStyle }
}
