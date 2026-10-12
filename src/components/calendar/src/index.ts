import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  clampDateToRange,
  generateCalendarDays,
  getCalendarClassNames,
  isCalendarDateDisabled,
  isCalendarInSpan,
  normalizeCalendarSpan,
  shiftCalendarDate,
  shiftCalendarMonth,
  toggleCalendarDate,
} from '@lh-ui/share/core/calendar'
import { isSameDay } from '@lh-ui/share/core/date-picker'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_KEYS } from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
import type { LhCalendarProps, LhCalendarValue } from './types'

export interface LhCalendarEmits {
  /** Vue2 默认 v-model：input 事件 */
  (e: 'input', value: LhCalendarValue): void
  (e: 'change', value: LhCalendarValue): void
  (e: 'select', value: Date): void
}

/**
 * Calendar 组件 Composable（纯逻辑在 @lh-ui/share/core/calendar）
 *
 * Vue2 适配要点：
 * - v-model 走默认的 value prop + input 事件（无 v-model:xxx）
 * - 选中态受控/非受控双模：传 value 即受控，否则内部 ref 维护
 */
export function useLhCalendar(props: LhCalendarProps, emit: LhCalendarEmits) {
  const rootRef = ref<HTMLElement | null>(null)
  const panelOpen = ref(false)
  const isInputMode = computed(() => props.mode === 'input')

  const today = new Date()
  const cursor = ref({ year: today.getFullYear(), month: today.getMonth() })

  // ---------- 选中态（受控 / 内部双模） ----------

  const innerDates = ref<Date[]>([])
  /** range 模式的待完成起点（第一次点击后、第二次点击前） */
  const rangeAnchor = ref<Date | null>(null)

  const controlled = computed(() => props.value !== undefined)

  function toDates(value: LhCalendarValue | undefined): Date[] {
    if (value === undefined) return []
    if (Array.isArray(value)) return [...value]
    return [value]
  }

  const selectedDates = computed<Date[]>(() => {
    if (controlled.value) return toDates(props.value)
    return innerDates.value
  })

  const isSelected = (date: Date) => selectedDates.value.some((d) => isSameDay(d, date))

  /** 一段时间模式下完整起止之间的日期（不含两端，两端走 --selected） */
  const isWithinSpan = (date: Date): boolean => {
    if (props.selection !== 'range' || selectedDates.value.length !== 2) return false
    const [start, end] = selectedDates.value
    return isCalendarInSpan(date, start, end) && !isSameDay(date, start) && !isSameDate(date, end)
  }

  const isDisabled = (date: Date): boolean => isCalendarDateDisabled(date, props.range)

  // ---------- 交互 ----------

  function select(date: Date): void {
    if (isDisabled(date)) return
    focusDate.value = date
    let value: LhCalendarValue

    if (props.selection === 'range') {
      if (!rangeAnchor.value) {
        rangeAnchor.value = date
        innerDates.value = [date]
        value = [date, date]
      } else {
        const span = normalizeCalendarSpan(rangeAnchor.value, date)
        rangeAnchor.value = null
        innerDates.value = [...span]
        value = span
      }
    } else if (props.selection === 'multiple') {
      innerDates.value = toggleCalendarDate(innerDates.value, date)
      value = [...innerDates.value]
    } else {
      innerDates.value = [date]
      value = date
    }

    emit('select', date)
    emit('input', value)
    emit('change', value)
    if (shouldCloseOnSelect()) panelOpen.value = false
  }

  function shouldCloseOnSelect(): boolean {
    if (!isInputMode.value || props.closeOnSelect === false) return false
    if (props.selection === 'range') return rangeAnchor.value === null
    return props.selection === 'single'
  }

  function isSameDate(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  // ---------- 面板 ----------

  const weekLabels = computed(() => [
    { key: 'sun', label: t('datepicker.weeks.sun', '日') },
    { key: 'mon', label: t('datepicker.weeks.mon', '一') },
    { key: 'tue', label: t('datepicker.weeks.tue', '二') },
    { key: 'wed', label: t('datepicker.weeks.wed', '三') },
    { key: 'thu', label: t('datepicker.weeks.thu', '四') },
    { key: 'fri', label: t('datepicker.weeks.fri', '五') },
    { key: 'sat', label: t('datepicker.weeks.sat', '六') },
  ])

  const panelCount = computed(() => Math.max(1, Math.floor(props.panels ?? 1)))

  const panelMonths = computed(() =>
    Array.from({ length: panelCount.value }, (_, i) => {
      const shifted = shiftCalendarMonth(cursor.value.year, cursor.value.month, i)
      const days = generateCalendarDays(
        shifted.year,
        shifted.month,
        selectedDates.value[0] ?? null,
        null,
        null,
        today,
      )
      const rows: typeof days[] = []
      for (let r = 0; r < days.length; r += 7) rows.push(days.slice(r, r + 7))
      return { ...shifted, rows }
    }),
  )

  // 年/月文案取 label 而非 monthN 键：locale 的 month10 已含「月」后缀，
  // 直接拼会得到「2026 月 10月」（与 date-picker 的 formatDisplay 同一写法）
  const panelTitle = (panel: { year: number; month: number }) =>
    `${panel.year}${t('datepicker.year', '年')} ${panel.month + 1}${t('datepicker.month', '月')}`

  /** 焦点目标：受控的单个日期（未传或数组形态时以今天兜底）；键盘导航以此为基准移动 */
  const focusDate = ref<Date>(props.value instanceof Date ? props.value : today)
  const isFocusTarget = (date: Date) => isSameDate(date, focusDate.value)

  // 受控值变化时同步焦点基准（非受控时内部 select 已同步）
  watch(
    () => props.value,
    (val) => {
      if (val instanceof Date) focusDate.value = val
    },
  )

  function shiftMonth(delta: number): void {
    cursor.value = shiftCalendarMonth(cursor.value.year, cursor.value.month, delta)
  }

  function moveFocus(days: number): void {
    const next = clampDateToRange(shiftCalendarDate(focusDate.value, days), props.range)
    focusDate.value = next
    const inPanels = panelMonths.value.some(
      (p) => p.year === next.getFullYear() && p.month === next.getMonth(),
    )
    if (!inPanels) cursor.value = { year: next.getFullYear(), month: next.getMonth() }
  }

  function handleKeydown(event: KeyboardEvent): void {
    const moves: Record<string, () => void> = {
      [LH_KEYS.ArrowRight]: () => moveFocus(1),
      [LH_KEYS.ArrowLeft]: () => moveFocus(-1),
      [LH_KEYS.ArrowDown]: () => moveFocus(7),
      [LH_KEYS.ArrowUp]: () => moveFocus(-7),
      [LH_KEYS.Home]: () => moveFocus(-6),
      [LH_KEYS.End]: () => moveFocus(6),
      [LH_KEYS.PageUp]: () => shiftMonth(-1),
      [LH_KEYS.PageDown]: () => shiftMonth(1),
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    move()
    const target = clampDateToRange(focusDate.value, props.range)
    if (!isDisabled(target)) select(target)
  }

  const cellAria = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  const inputText = computed(() => {
    const dates = selectedDates.value
    if (dates.length === 0) return ''
    if (props.selection === 'range' && dates.length === 2) {
      return `${formatDate(dates[0])} ~ ${formatDate(dates[1])}`
    }
    return formatDate(dates[0])
  })

  const calendarClasses = computed(() => {
    const classes = getCalendarClassNames()
    if (isInputMode.value) classes.push('lh-calendar--input')
    if (panelOpen.value) classes.push('lh-calendar--open')
    return classes
  })

  const calendarStyle = computed(() => sxToStyle(props.sx ?? {}))

  const placeholderText = computed(
    () => props.placeholder || t('select.placeholder', '请选择'),
  )

  const prevMonthLabel = computed(() => t('datepicker.prevMonth', '上一月'))
  const nextMonthLabel = computed(() => t('datepicker.nextMonth', '下一月'))

  // input 模式：点击组件外部收起面板
  function onDocMousedown(event: MouseEvent): void {
    if (!panelOpen.value) return
    if (rootRef.value && !rootRef.value.contains(event.target as Node)) panelOpen.value = false
  }

  onMounted(() => {
    if (isInputMode.value) document.addEventListener('mousedown', onDocMousedown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onDocMousedown)
  })

  return {
    rootRef,
    panelOpen,
    isInputMode,
    weekLabels,
    panelMonths,
    panelTitle,
    isSelected,
    isWithinSpan,
    isDisabled,
    isFocusTarget,
    select,
    shiftMonth,
    handleKeydown,
    cellAria,
    inputText,
    calendarClasses,
    calendarStyle,
    placeholderText,
    prevMonthLabel,
    nextMonthLabel,
  }
}
