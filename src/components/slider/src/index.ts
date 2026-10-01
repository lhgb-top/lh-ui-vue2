import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  clampValue,
  snapToStep,
  getPositionFromValue,
  getSliderClassNames,
  buildMarksList,
} from '@lh-ui/share/core/slider'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'
import type { LhSliderProps } from './types'

export interface LhSliderEmits {
  /** v-model：modelValue prop / input 事件 */
  (e: 'input', value: number | [number, number]): void
  (e: 'change', value: number | [number, number]): void
}

/**
 * Slider 组件 Composable（纯逻辑在 @lh-ui/share/core/slider）
 */
export function useLhSlider(props: LhSliderProps, emit: LhSliderEmits) {
  // sx 快速布局属性：转内联样式作用于根元素
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const sliderRef = ref<HTMLElement>()
  const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)
  const dragging = ref(false)
  const dragIndex = ref(0)

  const localValue = ref<number | [number, number]>(
    props.modelValue !== null && props.modelValue !== undefined
      ? Array.isArray(props.modelValue)
        ? props.modelValue
        : [props.modelValue, props.modelValue]
      : props.range
        ? [props.min ?? 0, ((props.min ?? 0) + (props.max ?? 100)) / 2]
        : [props.min ?? 0, props.min ?? 0],
  )

  // Initialize local value on mount if modelValue is null
  onMounted(() => {
    if (props.modelValue === null || props.modelValue === undefined) {
      if (props.range) {
        localValue.value = [props.min ?? 0, ((props.min ?? 0) + (props.max ?? 100)) / 2]
      } else {
        localValue.value = [props.min ?? 0, props.min ?? 0]
      }
    }
  })

  const marksList = computed(() => buildMarksList(props.marks))

  // 元组视图：number | [number, number] 的联合无法直接下标访问，统一转成二元组
  const arr = computed<[number, number]>(() =>
    Array.isArray(localValue.value) ? localValue.value : [localValue.value, localValue.value],
  )

  const displayValue = computed(() => {
    if (props.range) return `[${arr.value[0]}, ${arr.value[1]}]`
    return String(arr.value[0])
  })

  const wrapperClasses = computed(() => {
    const state = {
      value: localValue.value,
      min: props.min ?? 0,
      max: props.max ?? 100,
      step: props.step ?? 1,
      disabled: !!props.disabled,
      range: !!props.range,
      showInput: !!props.showInput,
      size: props.size ?? 'medium',
      marks: props.marks,
    }
    return getSliderClassNames(state)
  })

  function getCurrentValue(): number | [number, number] {
    if (props.range) {
      return arr.value
    }
    return arr.value[0]
  }

  const barStyle = computed(() => {
    const left = getPositionFromValue(Math.min(arr.value[0], arr.value[1]), props.min ?? 0, props.max ?? 100) * 100
    const right =
      100 - getPositionFromValue(Math.max(arr.value[0], arr.value[1]), props.min ?? 0, props.max ?? 100) * 100
    return {
      left: left + '%',
      width: 100 - left - right + '%',
    }
  })

  const button1Style = computed(() => {
    const pct = getPositionFromValue(arr.value[0], props.min ?? 0, props.max ?? 100) * 100
    return { left: pct + '%' }
  })

  const button2Style = computed(() => {
    const pct = getPositionFromValue(arr.value[1], props.min ?? 0, props.max ?? 100) * 100
    return { left: pct + '%' }
  })

  function getMarkPosition(value: number): number {
    return getPositionFromValue(value, props.min ?? 0, props.max ?? 100) * 100
  }

  function emitValue(): void {
    const val = getCurrentValue()
    emit('input', val)
    emit('change', val)
  }

  function onDragStart(e: MouseEvent | TouchEvent, index: number): void {
    if (props.disabled) return
    dragging.value = true
    dragIndex.value = index

    const moveHandler = (ev: MouseEvent | TouchEvent) => onDragMove(ev)
    const upHandler = () => {
      dragging.value = false
      emitValue()
      document.removeEventListener('mousemove', moveHandler)
      document.removeEventListener('mouseup', upHandler)
      document.removeEventListener('touchmove', moveHandler)
      document.removeEventListener('touchend', upHandler)
    }
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('mouseup', upHandler)
    document.addEventListener('touchmove', moveHandler)
    document.addEventListener('touchend', upHandler)
  }

  function onDragMove(e: MouseEvent | TouchEvent): void {
    if (!dragging.value || !sliderRef.value) return
    const track = sliderRef.value.querySelector('.lh-slider__track') as HTMLElement
    if (!track) return

    const rect = track.getBoundingClientRect()
    let x: number
    if ('touches' in e) {
      x = e.touches[0].clientX
    } else {
      x = (e as MouseEvent).clientX
    }
    const min = props.min ?? 0
    const max = props.max ?? 100
    const step = props.step ?? 1
    const ratio = clampValue((x - rect.left) / rect.width, 0, 1)
    const newValue = clampValue(Math.round((ratio * (max - min)) / step) * step + min, min, max)
    const snapped = snapToStep(newValue, min, step)

    const current: [number, number] = Array.isArray(localValue.value)
      ? [...localValue.value]
      : [localValue.value, localValue.value]

    if (dragIndex.value === 0) {
      if (props.range && snapped > current[1]) {
        localValue.value = [current[1], current[0]]
      } else {
        current[0] = snapped
        localValue.value = current
      }
    } else {
      if (props.range && snapped < current[0]) {
        localValue.value = [current[1], current[0]]
      } else {
        current[1] = snapped
        localValue.value = current
      }
    }
  }

  onBeforeUnmount(() => {
    dragging.value = false
  })

  return {
    sxStyle,
    sliderRef,
    formItem,
    marksList,
    displayValue,
    wrapperClasses,
    barStyle,
    button1Style,
    button2Style,
    getMarkPosition,
    onDragStart,
  }
}
