import { computed } from 'vue'
import {
  getSegmentedClassNames,
  moveSegmentedIndex,
  normalizeSegmentedOptions,
} from '@lh-ui/share/core/segmented'
import type { LhSegmentedNormalized } from '@lh-ui/share/core/segmented'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhSegmentedProps } from './types'

export interface LhSegmentedEmits {
  /** v-model：modelValue prop / input 事件 */
  (e: 'input', value: LhSegmentedProps['modelValue']): void
  (e: 'change', value: LhSegmentedProps['modelValue']): void
}

/**
 * Segmented 组件 Composable（纯逻辑在 @lh-ui/share/core/segmented）
 */
export function useLhSegmented(props: LhSegmentedProps, emit: LhSegmentedEmits) {
  const normalized = computed(() => normalizeSegmentedOptions(props.options))

  const value = computed(() => props.modelValue)

  /** roving tabindex：选中项（无选中时第一个启用项）持有焦点位 */
  const checkedIndex = computed(() => {
    const index = normalized.value.findIndex((option) => option.value === value.value)
    return index === -1 ? -1 : index
  })

  const firstEnabledIndex = computed(() => normalized.value.findIndex((option) => !option.disabled))

  const tabStops = computed(() => {
    const stops = normalized.value.map(() => false)
    if (stops.length === 0) return stops
    const active = checkedIndex.value === -1 ? firstEnabledIndex.value : checkedIndex.value
    if (active !== -1) stops[active] = true
    return stops
  })

  function select(option: LhSegmentedNormalized): void {
    if (props.disabled || option.disabled) return
    emit('input', option.value)
    emit('change', option.value)
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (props.disabled) return
    const directions: Record<string, 1 | -1> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    const current = checkedIndex.value === -1 ? firstEnabledIndex.value : checkedIndex.value
    const next = moveSegmentedIndex(normalized.value, current, direction)
    const option = normalized.value[next]
    if (option && !option.disabled) select(option)
  }

  const segmentedClasses = computed(() =>
    getSegmentedClassNames({ disabled: !!props.disabled, block: !!props.block }),
  )

  const segmentedStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    normalized,
    value,
    tabStops,
    select,
    handleKeydown,
    segmentedClasses,
    segmentedStyle,
  }
}
