import { computed, inject, onBeforeUnmount, onMounted, nextTick, ref, watch } from 'vue'
import type { Ref } from 'vue'
import {
  createDateTime,
  extractTime,
  formatTime,
  generateTimeColumn,
  getTimePickerColumnAria,
  getTimePickerPanelAria,
  getTimePickerTriggerAria,
  isValidTime,
} from '@lh-ui/share/core/time-picker'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import {
  LH_KEYS,
  isActivationKey,
  isEscapeKey,
} from '@lh-ui/share/core/shared/keyboard'
import { generateId } from '@lh-ui/share/utils'
import { resolveAriaAttrs } from '../../../utils/aria'
import { t } from '../../../locale'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'
import { useLhZIndex } from '../../../composables'
import type { LhTimePickerProps } from './types'

export interface LhTimePickerEmits {
  /** Vue2 默认 v-model：input 事件 */
  (e: 'input', value: Date | null): void
  (e: 'change', value: Date | null): void
}

type LhSelectingColumn = 'hour' | 'minute' | 'second'

/**
 * TimePicker 组件 Composable（纯逻辑在 @lh-ui/share/core/time-picker）
 *
 * Vue2 适配要点：
 * - v-model 走默认 value prop + input 事件
 * - 无 Teleport：面板 host 在 mounted 移到 teleportTarget（默认 body），卸载时移除
 */
export function useLhTimePicker(props: LhTimePickerProps, emit: LhTimePickerEmits) {
  const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)
  const { nextZIndex } = useLhZIndex()

  const pickerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  // 2.7 无 Teleport：host 根元素在 mounted 时移到 teleportTarget，卸载时移除防泄漏
  const panelHostRef = ref<HTMLElement | null>(null)
  const hourListRef = ref<HTMLElement | null>(null)
  const minuteListRef = ref<HTMLElement | null>(null)
  const secondListRef = ref<HTMLElement | null>(null)

  const internalVisible = ref(false)
  const hour = ref(0)
  const minute = ref(0)
  const second = ref(0)
  const selecting = ref<LhSelectingColumn | null>(null)
  const panelPosition = ref({ top: 0, left: 0 })
  const panelZIndex = ref(nextZIndex())

  const teleportTarget = computed<HTMLElement | null>(() => {
    if (typeof document === 'undefined') return null
    const target = props.teleportTarget ?? 'body'
    if (target === 'body') return document.body
    if (typeof target === 'string') return document.querySelector(target)
    return target
  })

  const showSecond = computed(() => (props.format ?? 'HH:mm:ss').includes('ss'))

  /** 列顺序：不含秒格式只有时/分两列，跨列跳焦用 */
  const columnOrder = computed<LhSelectingColumn[]>(() =>
    (props.format ?? 'HH:mm:ss').includes('ss') ? ['hour', 'minute', 'second'] : ['hour', 'minute'],
  )

  /** 列内激活项的 aria-activedescendant 目标 id（与模板项 :id 同构） */
  const hourActiveId = computed(() => `${panelId}-hour-${hour.value}`)
  const minuteActiveId = computed(() => `${panelId}-minute-${minute.value}`)
  const secondActiveId = computed(() => `${panelId}-second-${second.value}`)

  const displayPlaceholder = computed(
    () => props.placeholder || t('timepicker.placeholder', '请选择时间'),
  )

  const pickerClasses = computed(() => [
    'lh-time-picker',
    `lh-time-picker--${props.size}`,
    {
      'lh-time-picker--disabled': props.disabled,
      'lh-time-picker--visible': internalVisible.value,
    },
  ])

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const panelStyle = computed<Record<string, string>>(() => ({
    position: 'fixed',
    top: `${panelPosition.value.top}px`,
    left: `${panelPosition.value.left}px`,
    zIndex: String(panelZIndex.value),
  }))

  /** 面板 id：触发器 aria-controls 与面板 role="dialog" 共用 */
  const panelId = generateId('lh-time-picker-panel')

  /** 触发器无障碍属性包（aria-expanded / aria-controls / aria-haspopup=dialog） */
  const triggerAria = computed(() =>
    resolveAriaAttrs(getTimePickerTriggerAria(internalVisible.value, panelId)),
  )

  /** 面板容器无障碍属性包（role="dialog" + id + 语义文案） */
  const panelAria = computed(() =>
    resolveAriaAttrs({
      ...getTimePickerPanelAria(panelId),
      'aria-label': t('timepicker.panelLabel', '选择时间'),
    }),
  )

  /** 时间列无障碍属性包：每列是一个 listbox，aria-label 标注「时/分/秒」 */
  const hourColumnAria = computed(() =>
    resolveAriaAttrs(getTimePickerColumnAria(t('timepicker.hourLabel', '小时'))),
  )
  const minuteColumnAria = computed(() =>
    resolveAriaAttrs(getTimePickerColumnAria(t('timepicker.minuteLabel', '分钟'))),
  )
  const secondColumnAria = computed(() =>
    resolveAriaAttrs(getTimePickerColumnAria(t('timepicker.secondLabel', '秒'))),
  )

  const formatDisplay = computed(() => {
    if (!props.value) return ''
    return formatTime(hour.value, minute.value, second.value, props.format ?? 'HH:mm:ss')
  })

  const hoursOption = computed(() =>
    generateTimeColumn('hour', props.stepHour ?? 1).map((c) => ({
      ...c,
      isSelected: c.value === hour.value,
    })),
  )

  const minutesOption = computed(() =>
    generateTimeColumn('minute', props.stepMinute ?? 1).map((c) => ({
      ...c,
      isSelected: c.value === minute.value,
    })),
  )

  const secondsOption = computed(() =>
    generateTimeColumn('second', props.stepSecond ?? 1).map((c) => ({
      ...c,
      isSelected: c.value === second.value,
    })),
  )

  const hourTitle = computed(() => t('timepicker.hour', '时'))
  const minuteTitle = computed(() => t('timepicker.minute', '分'))
  const secondTitle = computed(() => t('timepicker.second', '秒'))
  const nowLabel = computed(() => t('timepicker.now', '此刻'))
  const confirmLabel = computed(() => t('timepicker.confirm', '确定'))
  const cancelLabel = computed(() => t('timepicker.cancel', '取消'))

  function open() {
    if (props.disabled || internalVisible.value) return
    internalVisible.value = true
    panelZIndex.value = nextZIndex()
    nextTick(() => updatePanelPosition())
  }

  function close() {
    internalVisible.value = false
  }

  function handleClear(e: Event) {
    e.stopPropagation()
    emit('input', null)
    emit('change', null)
    close()
  }

  function handleSelect(type: LhSelectingColumn, value: number): void {
    if (type === 'hour') hour.value = value
    else if (type === 'minute') minute.value = value
    else second.value = value
  }

  function selectNow(): void {
    const now = new Date()
    hour.value = now.getHours()
    minute.value = now.getMinutes()
    second.value = now.getSeconds()
  }

  function confirmSelection(): void {
    if (!isValidTime(hour.value, minute.value, second.value)) return
    const newDate = createDateTime(props.value ?? null, hour.value, minute.value, second.value)
    emit('input', newDate)
    emit('change', newDate)
    closePanel()
  }

  /** 把焦点移到指定列的 body（listbox 本体），供跨列跳焦与开面板后落焦用 */
  function focusColumn(type: LhSelectingColumn): void {
    const refs: Record<LhSelectingColumn, Ref<HTMLElement | null>> = {
      hour: hourListRef,
      minute: minuteListRef,
      second: secondListRef,
    }
    refs[type].value?.querySelector<HTMLElement>('.lh-time-picker-panel__column-body')?.focus()
  }

  /** 关闭面板并把焦点还给触发器（combobox 的 Escape / 确认约定） */
  function returnFocusToTrigger(): void {
    const trigger = pickerRef.value?.querySelector('.lh-time-picker__input') as HTMLElement | null
    trigger?.focus()
  }

  function closePanel(): void {
    internalVisible.value = false
    returnFocusToTrigger()
  }

  function updatePanelPosition(): void {
    if (!pickerRef.value) return
    const rect = pickerRef.value.getBoundingClientRect()
    panelPosition.value = { top: rect.bottom + 8, left: rect.left }
  }

  function onResizeOrScroll() {
    if (internalVisible.value) updatePanelPosition()
  }

  /** 滚轮 / 箭头：按步进循环移动并滚到激活项 */
  function moveColumn(type: LhSelectingColumn, direction: number): void {
    if (type === 'hour') {
      const step = props.stepHour ?? 1
      hour.value = (hour.value + direction * step + 24) % 24
      scrollToActive(hourListRef)
    } else if (type === 'minute') {
      const step = props.stepMinute ?? 1
      minute.value = (minute.value + direction * step + 60) % 60
      scrollToActive(minuteListRef)
    } else {
      const step = props.stepSecond ?? 1
      second.value = (second.value + direction * step + 60) % 60
      scrollToActive(secondListRef)
    }
  }

  function onWheel(e: WheelEvent, type: LhSelectingColumn): void {
    moveColumn(type, e.deltaY > 0 ? 1 : -1)
  }

  /**
   * 时间列键盘导航（listbox 模式，焦点落在列 body 上）
   *
   * - 上 / 下方向键按 step 移动选中项（复用 moveColumn 的循环步进与滚动）
   * - 左 / 右方向键在时/分/秒列之间跳焦
   * - Enter / Space 确认当前时刻并关闭面板
   * - Escape 关闭面板并把焦点还给触发器
   */
  function onColumnKeydown(e: KeyboardEvent, type: LhSelectingColumn): void {
    if (props.disabled) return
    if (e.key === LH_KEYS.ArrowUp) {
      e.preventDefault()
      moveColumn(type, -1)
      return
    }
    if (e.key === LH_KEYS.ArrowDown) {
      e.preventDefault()
      moveColumn(type, 1)
      return
    }
    if (e.key === LH_KEYS.ArrowRight || e.key === LH_KEYS.ArrowLeft) {
      const order = columnOrder.value
      const idx = order.indexOf(type)
      const nextIdx = e.key === LH_KEYS.ArrowRight ? idx + 1 : idx - 1
      if (nextIdx >= 0 && nextIdx < order.length) {
        e.preventDefault()
        focusColumn(order[nextIdx])
      }
      return
    }
    if (isActivationKey(e)) {
      e.preventDefault()
      confirmSelection()
      return
    }
    if (isEscapeKey(e)) {
      e.preventDefault()
      closePanel()
    }
  }

  /**
   * 触发器键盘行为（combobox 约定）
   *
   * - Escape 关闭面板（开着的时才拦截，避免吞掉别处的 Escape）
   * - Enter / Space / ArrowDown 打开面板并把焦点放进时列
   */
  function onTriggerKeydown(e: KeyboardEvent): void {
    if (props.disabled) return
    if (isEscapeKey(e)) {
      if (internalVisible.value) {
        e.preventDefault()
        closePanel()
      }
      return
    }
    if (isActivationKey(e) || e.key === LH_KEYS.ArrowDown) {
      if (!internalVisible.value) {
        e.preventDefault()
        open()
        nextTick(() => focusColumn('hour'))
      }
    }
  }

  function scrollToActive(containerRef: Ref<HTMLElement | null>) {
    const el = containerRef.value?.querySelector('.lh-time-picker-panel__column-item--active')
    // jsdom 未实现 scrollIntoView（非测试环境一定存在），缺方法时跳过即可
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'center' })
  }

  function handleClickOutside(e: MouseEvent): void {
    if (!internalVisible.value) return
    const target = e.target as HTMLElement
    if (panelRef.value && panelRef.value.contains(target)) return
    if (pickerRef.value && pickerRef.value.contains(target)) return
    close()
  }

  watch(
    () => props.value,
    (val) => {
      if (val instanceof Date && !isNaN(val.getTime())) {
        const time = extractTime(val)
        hour.value = time.hours
        minute.value = time.minutes
        second.value = time.seconds
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', onResizeOrScroll)
    window.addEventListener('scroll', onResizeOrScroll, true)
    // Vue2 无 Teleport：面板 host 移到 teleportTarget（默认 body）
    const host = panelHostRef.value
    const target = teleportTarget.value
    if (host && target && host.parentElement !== target) target.appendChild(host)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', onResizeOrScroll)
    window.removeEventListener('scroll', onResizeOrScroll, true)
    // host 被移出 $el 子树，卸载时主动移除防泄漏
    panelHostRef.value?.remove()
  })

  return {
    formItem,
    pickerRef,
    panelRef,
    panelHostRef,
    panelId,
    triggerAria,
    panelAria,
    hourColumnAria,
    minuteColumnAria,
    secondColumnAria,
    hourListRef,
    minuteListRef,
    secondListRef,
    internalVisible,
    selecting,
    hour,
    minute,
    second,
    showSecond,
    columnOrder,
    hourActiveId,
    minuteActiveId,
    secondActiveId,
    displayPlaceholder,
    pickerClasses,
    sxStyle,
    panelStyle,
    formatDisplay,
    hoursOption,
    minutesOption,
    secondsOption,
    hourTitle,
    minuteTitle,
    secondTitle,
    nowLabel,
    confirmLabel,
    cancelLabel,
    open,
    close,
    handleClear,
    handleSelect,
    selectNow,
    confirmSelection,
    onWheel,
    moveColumn,
    onColumnKeydown,
    onTriggerKeydown,
  }
}
