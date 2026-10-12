import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  clampValue,
  snapToStep,
  getPositionFromValue,
  getSliderClassNames,
  buildMarksList,
} from '@lh-ui/share/core/slider'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { getNextRangeValue } from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
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

  // 受控回显：外部更新 modelValue（表单 reset / 程序赋值）后滑块必须跟随；
  // 拖拽中跳过，避免父级回流的值打断正在进行的拖拽
  watch(
    () => props.modelValue,
    (val) => {
      if (val === null || val === undefined || dragging.value) return
      localValue.value = Array.isArray(val) ? [...val] : val
    },
  )

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
    const min = props.min ?? 0
    const max = props.max ?? 100
    // 单值模式：bar 从轨道起点铺到当前值（[v, v] 双端相等的旧公式会把宽度算成 0）
    if (!props.range) {
      const width = getPositionFromValue(arr.value[0], min, max) * 100
      return { left: '0%', width: `${width}%` }
    }
    const left = getPositionFromValue(Math.min(arr.value[0], arr.value[1]), min, max) * 100
    const right = 100 - getPositionFromValue(Math.max(arr.value[0], arr.value[1]), min, max) * 100
    return {
      left: `${left}%`,
      width: `${100 - left - right}%`,
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

  /** thumb 的可达名称：range 模式区分起始/结束两端 */
  function thumbAriaLabel(index: number): string {
    if (props.range) {
      return index === 0
        ? t('slider.thumbStart', '起始滑块')
        : t('slider.thumbEnd', '结束滑块')
    }
    return t('slider.thumb', '滑块')
  }

  /** thumb 的当前数值（aria-valuenow） */
  function thumbValue(index: number): number {
    return arr.value[index]
  }

  /**
   * thumb 的键盘导航（WAI-ARIA slider 模式）
   *
   * 方向键按 step 增减、PageUp/Down 大步进、Home/End 直达极值。
   * range 模式下键盘**不交换两端**（与拖拽的交换语义不同），而是把本端
   * 钳在其活动范围内，保证「焦点所在的 thumb」与「被修改的值」始终一致——
   * 键盘用户连续按键时不会出现焦点与值错位。
   */
  function onButtonKeydown(event: KeyboardEvent, index: number): void {
    if (props.disabled) return

    const min = props.min ?? 0
    const max = props.max ?? 100
    const step = props.step ?? 1
    const current = arr.value[index]

    const next = getNextRangeValue(current, event.key, { min, max, step })
    // 非导航键（Tab 等）原样返回，不拦截默认行为
    if (next === current) return

    event.preventDefault()

    const pair: [number, number] = [arr.value[0], arr.value[1]]
    if (props.range) {
      // range：钳在本端活动范围内，不越过另一端
      pair[index] = index === 0 ? clampValue(next, min, pair[1]) : clampValue(next, pair[0], max)
    } else {
      pair[index] = next
    }
    localValue.value = pair
    emitValue()
  }

  // 拖拽监听句柄：成对记录，组件在拖拽中被卸载时由 onBeforeUnmount 兜底移除
  let dragMoveHandler: ((ev: MouseEvent | TouchEvent) => void) | null = null
  let dragUpHandler: (() => void) | null = null

  function detachDragListeners(): void {
    if (dragMoveHandler) {
      document.removeEventListener('mousemove', dragMoveHandler)
      document.removeEventListener('touchmove', dragMoveHandler)
      dragMoveHandler = null
    }
    if (dragUpHandler) {
      document.removeEventListener('mouseup', dragUpHandler)
      document.removeEventListener('touchend', dragUpHandler)
      dragUpHandler = null
    }
  }

  function onDragStart(e: MouseEvent | TouchEvent, index: number): void {
    if (props.disabled) return
    dragging.value = true
    dragIndex.value = index

    const moveHandler = (ev: MouseEvent | TouchEvent) => onDragMove(ev)
    const upHandler = () => {
      dragging.value = false
      emitValue()
      detachDragListeners()
    }
    dragMoveHandler = moveHandler
    dragUpHandler = upHandler
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
    detachDragListeners()
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
    thumbAriaLabel,
    thumbValue,
    onButtonKeydown,
  }
}
