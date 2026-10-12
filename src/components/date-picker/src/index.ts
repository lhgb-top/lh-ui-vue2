import { computed, inject, onBeforeUnmount, onMounted, nextTick, ref, watch } from 'vue'
import type { Ref } from 'vue'
import {
  formatDate,
  generateCalendarDays,
  generateMonths,
  generateYears,
  isDateDisabled,
  isSameDay,
} from '@lh-ui/share/core/date-picker'
import type {
  LhDatePickerDayData,
  LhDatePickerMonthData,
  LhDatePickerYearData,
} from '@lh-ui/share/core/date-picker'
import {
  createDateTime,
  extractTime,
  generateTimeColumn,
  isValidTime,
} from '@lh-ui/share/core/time-picker'
import { normalizeCalendarSpan } from '@lh-ui/share/core/calendar'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import {
  getDatePickerPanelAria,
  getDatePickerTriggerAria,
} from '@lh-ui/share/core/date-picker'
import { getDecorativeAria } from '@lh-ui/share/core/shared/a11y'
import {
  LH_KEYS,
  getNextGridCell,
  isActivationKey,
  isArrowKey,
  isEscapeKey,
  isHomeOrEndKey,
} from '@lh-ui/share/core/shared/keyboard'
import { generateId } from '@lh-ui/share/utils'
import { resolveAriaAttrs } from '../../../utils/aria'
import { t } from '../../../locale'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'
import { useLhZIndex } from '../../../composables'
import type { LhDatePickerProps } from './types'

export interface LhDatePickerEmits {
  /** Vue2 默认 v-model：input 事件 */
  (e: 'input', value: Date | [Date, Date] | null): void
  (e: 'change', value: Date | [Date, Date] | null): void
}

type LhPanelView = 'date' | 'month' | 'year'

/**
 * DatePicker 组件 Composable（纯逻辑在 @lh-ui/share/core/date-picker）
 *
 * Vue2 适配要点：
 * - v-model 走默认 value prop + input 事件
 * - 无 Teleport：面板 host 在 mounted 移到 teleportTarget（默认 body），卸载时移除
 */
export function useLhDatePicker(props: LhDatePickerProps, emit: LhDatePickerEmits) {
  const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)
  const { nextZIndex } = useLhZIndex()

  const pickerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  // 2.7 无 Teleport：host 根元素在 mounted 时移到 teleportTarget，卸载时移除防泄漏
  const panelHostRef = ref<HTMLElement | null>(null)

  const internalVisible = ref(false)
  const currentYear = ref(new Date().getFullYear())
  const currentMonth = ref(new Date().getMonth())
  const today = ref(new Date())
  const tempSelection = ref<Date | null>(null)
  const viewMode = ref<LhPanelView>('date')
  const panelPosition = ref({ top: 0, left: 0 })
  const panelZIndex = ref(nextZIndex())

  /** datetime 模式的时刻（与日期正交，确认时合并） */
  const hour = ref(0)
  const minute = ref(0)
  const second = ref(0)
  const hourListRef = ref<HTMLElement | null>(null)
  const minuteListRef = ref<HTMLElement | null>(null)
  const secondListRef = ref<HTMLElement | null>(null)

  /** range 模式的两段式状态：rangeTemp 为已落定的区间，rangeAnchor 为待完成的起点 */
  const rangeTemp = ref<[Date, Date] | null>(null)
  const rangeAnchor = ref<Date | null>(null)

  const isRange = computed(() => props.mode === 'range')

  /** datetime 默认带时刻，其余模式默认仅日期；format 未传时按模式兜底 */
  const resolvedFormat = computed(() =>
    props.format ?? (props.mode === 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'),
  )
  const showSecond = computed(() => resolvedFormat.value.includes('ss'))

  const teleportTarget = computed<HTMLElement | null>(() => {
    if (typeof document === 'undefined') return null
    const target = props.teleportTarget ?? 'body'
    if (target === 'body') return document.body
    if (typeof target === 'string') return document.querySelector(target)
    return target
  })

  const weekDays = computed(() => [
    t('datepicker.weeks.sun', '日'),
    t('datepicker.weeks.mon', '一'),
    t('datepicker.weeks.tue', '二'),
    t('datepicker.weeks.wed', '三'),
    t('datepicker.weeks.thu', '四'),
    t('datepicker.weeks.fri', '五'),
    t('datepicker.weeks.sat', '六'),
  ])

  const yearLabel = computed(() => t('datepicker.year', '年'))
  const monthLabel = computed(() => t('datepicker.month', '月'))

  const monthName = (month: number) => t(`datepicker.month${month + 1}`, `${month + 1}月`)

  const monthCells = computed(() =>
    generateMonths(currentYear.value, props.mode === 'month' ? tempSelection.value : null),
  )

  const decadeStart = computed(() => Math.floor(currentYear.value / 12) * 12)
  const decadeLabel = computed(() => `${decadeStart.value} - ${decadeStart.value + 11}`)
  const yearCells = computed(() =>
    generateYears(decadeStart.value, props.mode === 'year' ? tempSelection.value : null),
  )

  const displayPlaceholder = computed(
    () => props.placeholder || t('datepicker.placeholder', '请选择日期'),
  )

  const pickerClasses = computed(() => [
    `lh-date-picker--${props.size}`,
    {
      'lh-date-picker--disabled': props.disabled,
      'lh-date-picker--visible': internalVisible.value,
    },
  ])

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const panelStyle = computed<Record<string, string>>(() => ({
    position: 'fixed',
    top: `${panelPosition.value.top}px`,
    left: `${panelPosition.value.left}px`,
    zIndex: String(panelZIndex.value),
  }))

  /**
   * 面板 id：触发器的 aria-controls 与面板的 role="dialog" 用同一个 id 对齐
   *
   * 每个组件实例一个，避免同页多个 date-picker 的面板 id 冲突
   */
  const panelId = generateId('lh-date-picker-panel')

  /** 触发器无障碍属性包（aria-expanded / aria-controls / aria-haspopup=dialog） */
  const triggerAria = computed(() =>
    resolveAriaAttrs(getDatePickerTriggerAria(internalVisible.value, panelId)),
  )

  /** 面板容器无障碍属性包（role="dialog" + id + 语义文案） */
  const panelAria = computed(() =>
    resolveAriaAttrs({
      ...getDatePickerPanelAria(panelId),
      'aria-label': t('datepicker.panelLabel', '选择日期'),
    }),
  )

  const calendarDays = computed(() =>
    generateCalendarDays(
      currentYear.value,
      currentMonth.value,
      // range 模式没有单一选中日，区间高亮走 rangeStart/rangeEnd（share 已算 isStart/isEnd/isInRange）
      isRange.value ? null : tempSelection.value,
      isRange.value ? (rangeTemp.value?.[0] ?? null) : null,
      isRange.value ? (rangeTemp.value?.[1] ?? null) : null,
      today.value,
    ),
  )

  /**
   * 日期网格按 7 列分行：role="row" 包 7 个 gridcell，
   * 行容器 display: contents 不破坏 share 的 7 列 grid 布局
   */
  const calendarRows = computed(() => {
    const rows: LhDatePickerDayData[][] = []
    for (let i = 0; i < calendarDays.value.length; i += 7) {
      rows.push(calendarDays.value.slice(i, i + 7))
    }
    return rows
  })

  /**
   * 网格焦点锚点：面板打开 / 翻月后，roving tabindex 落在哪个格
   *
   * 优先选中日 → 今日 → 首格，保证「Tab 进入网格」总有可达落点
   */
  const anchorDayIndex = computed(() => {
    const days = calendarDays.value
    const selected = days.findIndex((d) => (d.isSelected || d.isStart) && !isDayDisabled(d.date))
    if (selected >= 0) return selected
    const todayIdx = days.findIndex((d) => d.isToday && !isDayDisabled(d.date))
    if (todayIdx >= 0) return todayIdx
    return 0
  })

  /** roving tabindex 的当前聚焦格下标（-1 时回退到锚点） */
  const focusDayIndex = ref(-1)
  const focusMonthIndex = ref(-1)
  const focusYearIndex = ref(-1)

  /** 翻月后由 watcher 兑现的「进入侧落点」描述（读新网格的 total） */
  let pendingGridFocus: null | ((total: number) => number) = null

  /** 网格实际落点：显式聚焦优先，否则回退锚点 */
  const gridFocusIndex = computed(() =>
    focusDayIndex.value === -1 ? anchorDayIndex.value : focusDayIndex.value,
  )

  /** 月份网格落点：选中月优先，否则首格 */
  const monthFocusIndex = computed(() => {
    if (focusMonthIndex.value !== -1) return focusMonthIndex.value
    const idx = monthCells.value.findIndex((m) => m.isSelected)
    return idx >= 0 ? idx : 0
  })

  /** 年份网格落点：选中年优先，否则首格 */
  const yearFocusIndex = computed(() => {
    if (focusYearIndex.value !== -1) return focusYearIndex.value
    const idx = yearCells.value.findIndex((y) => y.isSelected)
    return idx >= 0 ? idx : 0
  })

  function monthTabIndex(index: number): number {
    return index === monthFocusIndex.value ? 0 : -1
  }

  function yearTabIndex(index: number): number {
    return index === yearFocusIndex.value ? 0 : -1
  }

  /** 月份网格按 3 列分行（share 样式为 repeat(3, 1fr)） */
  const monthRows = computed(() => {
    const rows: LhDatePickerMonthData[][] = []
    for (let i = 0; i < monthCells.value.length; i += 3) {
      rows.push(monthCells.value.slice(i, i + 3))
    }
    return rows
  })

  /** 年份网格按 4 列分行（share 样式为 repeat(4, 1fr)） */
  const yearRows = computed(() => {
    const rows: LhDatePickerYearData[][] = []
    for (let i = 0; i < yearCells.value.length; i += 4) {
      rows.push(yearCells.value.slice(i, i + 4))
    }
    return rows
  })

  /** 焦点落点不可达（被禁用）时向下一格找最近的可聚焦格 */
  function resolveGridFocus(total: number): number {
    const raw = pendingGridFocus ? pendingGridFocus(total) : gridFocusIndex.value
    pendingGridFocus = null
    if (raw < 0 || raw >= total) return 0
    if (!isDayDisabled(calendarDays.value[raw].date)) return raw
    const next = calendarDays.value.findIndex((d, i) => i >= raw && !isDayDisabled(d.date))
    return next >= 0 ? next : 0
  }

  /** 日期格的 tabindex：仅聚焦格为 0，其余 -1（roving tabindex） */
  function dayTabIndex(index: number): number {
    return index === gridFocusIndex.value ? 0 : -1
  }

  /** 日期格的语义文案：读屏播报完整日期（含星期），表格头另有列头 */
  function dayAriaLabel(day: { date: Date; day: number }): string {
    const date = day.date
    const week = t(`datepicker.weeks.${['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()]}`, '')
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    return `${y}年${m}月${day.day}日${week ? ` ${week}` : ''}`
  }

  /** 日期网格列头行的 aria 隐藏：格本身已带完整语义文案，表头仅视觉用 */
  const weekdaysAriaHidden = resolveAriaAttrs(getDecorativeAria(true))

  const rangeSeparator = computed(() => props.rangeSeparator ?? '~')

  const hoursOption = computed(() =>
    generateTimeColumn('hour', 1).map((c) => ({ ...c, isSelected: c.value === hour.value })),
  )
  const minutesOption = computed(() =>
    generateTimeColumn('minute', 1).map((c) => ({ ...c, isSelected: c.value === minute.value })),
  )
  const secondsOption = computed(() =>
    generateTimeColumn('second', 1).map((c) => ({ ...c, isSelected: c.value === second.value })),
  )
  const hourTitle = computed(() => t('timepicker.hour', '时'))
  const minuteTitle = computed(() => t('timepicker.minute', '分'))
  const secondTitle = computed(() => t('timepicker.second', '秒'))

  const prevLabel = computed(() => t('datepicker.prevMonth', '上一月'))
  const nextLabel = computed(() => t('datepicker.nextMonth', '下一月'))
  const todayLabel = computed(() => t('datepicker.today', '今天'))
  const confirmLabel = computed(() => t('datepicker.confirm', '确定'))

  function formatDisplay(date: Date): string {
    if (props.mode === 'month')
      return `${date.getFullYear()}${yearLabel.value} ${date.getMonth() + 1}${monthLabel.value}`
    if (props.mode === 'year') return `${date.getFullYear()}${yearLabel.value}`
    // datetime 默认带时刻，否则 format prop 的默认值会丢掉时间
    return formatDate(date, resolvedFormat.value)
  }

  function isSelected(date: Date): boolean {
    if (!tempSelection.value) return false
    return isSameDay(date, tempSelection.value)
  }

  function isDayDisabled(date: Date): boolean {
    return isDateDisabled(date, null, null, null)
  }

  function updatePanelPosition() {
    if (!pickerRef.value) return
    const rect = pickerRef.value.getBoundingClientRect()
    panelPosition.value = { top: rect.bottom + 8, left: rect.left }
  }

  function open() {
    if (props.disabled || internalVisible.value) return
    internalVisible.value = true
    panelZIndex.value = nextZIndex()
    const value = props.value
    if (isRange.value) {
      // 已有区间直接回显，并定位到起点所在月
      if (Array.isArray(value) && value.length === 2) {
        tempSelection.value = value[0]
        rangeTemp.value = [value[0], value[1]]
        currentYear.value = value[0].getFullYear()
        currentMonth.value = value[0].getMonth()
      } else {
        tempSelection.value = null
        rangeTemp.value = null
      }
      rangeAnchor.value = null
    } else if (value instanceof Date) {
      tempSelection.value = value
      const time = extractTime(value)
      hour.value = time.hours
      minute.value = time.minutes
      second.value = time.seconds
    } else {
      tempSelection.value = null
    }
    viewMode.value = props.mode === 'month' ? 'month' : props.mode === 'year' ? 'year' : 'date'
    focusGridOnOpen()
    nextTick(() => {
      updatePanelPosition()
      // datetime 打开时把激活时刻滚进可视区
      if (props.mode === 'datetime') {
        scrollToActive(hourListRef)
        scrollToActive(minuteListRef)
        if (showSecond.value) scrollToActive(secondListRef)
      }
    })
  }

  function close() {
    internalVisible.value = false
  }

  function handleClear(e: Event) {
    e.stopPropagation()
    emit('input', null)
    emit('change', null)
    tempSelection.value = null
    rangeTemp.value = null
    rangeAnchor.value = null
    close()
  }

  function handleDayClick(day: { date: Date }) {
    if (isDayDisabled(day.date)) return
    // datetime 保留已选时刻：日历单元格是本地 00:00，直接采用会清掉时间
    const date =
      props.mode === 'datetime'
        ? createDateTime(day.date, hour.value, minute.value, second.value)
        : day.date

    if (isRange.value) {
      // 两段式点击：第一次落锚点并高亮起点，第二次归一化为有序区间
      if (!rangeAnchor.value) {
        rangeAnchor.value = date
        rangeTemp.value = [date, date]
        tempSelection.value = date
      } else {
        const [start, end] = normalizeCalendarSpan(rangeAnchor.value, date)
        rangeAnchor.value = null
        rangeTemp.value = [start, end]
        tempSelection.value = start
      }
      return
    }
    tempSelection.value = date
  }

  function selectToday() {
    const now = new Date()
    if (isRange.value) {
      rangeAnchor.value = null
      rangeTemp.value = [now, now]
      tempSelection.value = now
      return
    }
    if (props.mode === 'datetime') {
      const time = extractTime(now)
      hour.value = time.hours
      minute.value = time.minutes
      second.value = time.seconds
    }
    tempSelection.value = now
  }

  function confirmSelection() {
    if (isRange.value) {
      // 空选保护：未完成两段选择时只关闭面板，不吞掉已有值
      if (!rangeTemp.value) {
        closePanel()
        return
      }
      const value: [Date, Date] = [rangeTemp.value[0], rangeTemp.value[1]]
      emit('input', value)
      emit('change', value)
      closePanel()
      return
    }
    // 空选保护：未选日期时只关闭，不清空已有值
    if (!tempSelection.value) {
      closePanel()
      return
    }
    if (props.mode === 'datetime' && !isValidTime(hour.value, minute.value, second.value)) return
    // datetime 在确认时重新合并时刻：用户可能在选完日期后改了时间列
    const value =
      props.mode === 'datetime'
        ? createDateTime(tempSelection.value, hour.value, minute.value, second.value)
        : tempSelection.value
    emit('input', value)
    emit('change', value)
    closePanel()
  }

  /** 时间列：点击直接选中 */
  function handleTimeSelect(type: 'hour' | 'minute' | 'second', value: number) {
    if (type === 'hour') hour.value = value
    else if (type === 'minute') minute.value = value
    else second.value = value
  }

  /** 时间列：滚轮循环步进并滚到激活项 */
  function moveTimeColumn(type: 'hour' | 'minute' | 'second', direction: number) {
    if (type === 'hour') {
      hour.value = (hour.value + direction + 24) % 24
      scrollToActive(hourListRef)
    } else if (type === 'minute') {
      minute.value = (minute.value + direction + 60) % 60
      scrollToActive(minuteListRef)
    } else {
      second.value = (second.value + direction + 60) % 60
      scrollToActive(secondListRef)
    }
  }

  function onTimeWheel(e: WheelEvent, type: 'hour' | 'minute' | 'second') {
    moveTimeColumn(type, e.deltaY > 0 ? 1 : -1)
  }

  /** 时间列顺序：不含秒格式只有时/分两列，跨列跳焦用 */
  const timeColumnOrder = computed<Array<'hour' | 'minute' | 'second'>>(() =>
    showSecond.value ? ['hour', 'minute', 'second'] : ['hour', 'minute'],
  )

  /** 列内激活项的 aria-activedescendant 目标 id（与模板项 :id 同构） */
  const hourActiveId = computed(() => `${panelId}-hour-${hour.value}`)
  const minuteActiveId = computed(() => `${panelId}-minute-${minute.value}`)
  const secondActiveId = computed(() => `${panelId}-second-${second.value}`)

  /** 聚焦某列的滚动容器（listbox 语义落在 body 上） */
  function focusTimeColumn(type: 'hour' | 'minute' | 'second'): void {
    const refs: Record<'hour' | 'minute' | 'second', Ref<HTMLElement | null>> = {
      hour: hourListRef,
      minute: minuteListRef,
      second: secondListRef,
    }
    refs[type].value?.querySelector<HTMLElement>('.lh-date-picker-panel__time-body')?.focus()
  }

  /** 关闭面板并把焦点还给触发器（弹层关闭的焦点归还） */
  function closePanel(): void {
    close()
    pickerRef.value?.querySelector<HTMLElement>('.lh-date-picker__input')?.focus()
  }

  /** 时间列键盘：上下步进、左右跨列、Enter 确认、Escape 关闭归还焦点 */
  function onTimeKeydown(event: KeyboardEvent, type: 'hour' | 'minute' | 'second'): void {
    if (props.disabled) return
    const key = event.key
    if (key === LH_KEYS.ArrowUp) {
      event.preventDefault()
      moveTimeColumn(type, -1)
    } else if (key === LH_KEYS.ArrowDown) {
      event.preventDefault()
      moveTimeColumn(type, 1)
    } else if (key === LH_KEYS.ArrowRight || key === LH_KEYS.ArrowLeft) {
      // 跨列跳焦：越界时留在原列
      const idx = timeColumnOrder.value.indexOf(type)
      const nextIdx = idx + (key === LH_KEYS.ArrowRight ? 1 : -1)
      if (nextIdx >= 0 && nextIdx < timeColumnOrder.value.length) {
        event.preventDefault()
        focusTimeColumn(timeColumnOrder.value[nextIdx])
      }
    } else if (isActivationKey(event)) {
      event.preventDefault()
      confirmSelection()
    } else if (isEscapeKey(event)) {
      event.preventDefault()
      closePanel()
    }
  }

  function scrollToActive(containerRef: Ref<HTMLElement | null>) {
    const el = containerRef.value?.querySelector('.lh-date-picker-panel__time-item--active')
    // jsdom 未实现 scrollIntoView（非测试环境一定存在），缺方法时跳过即可
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'center' })
  }

  function prevUnit() {
    if (viewMode.value === 'year') {
      currentYear.value -= 12
    } else if (viewMode.value === 'month') {
      currentYear.value--
    } else {
      currentMonth.value--
      if (currentMonth.value < 0) {
        currentMonth.value = 11
        currentYear.value--
      }
    }
  }

  function nextUnit() {
    if (viewMode.value === 'year') {
      currentYear.value += 12
    } else if (viewMode.value === 'month') {
      currentYear.value++
    } else {
      currentMonth.value++
      if (currentMonth.value > 11) {
        currentMonth.value = 0
        currentYear.value++
      }
    }
  }

  function toggleView() {
    if (viewMode.value === 'date') viewMode.value = 'month'
    else if (viewMode.value === 'month') viewMode.value = 'year'
    else viewMode.value = 'month'
  }

  /**
   * 日期网格键盘导航（APG grid 模式）
   *
   * - 方向键在网格内移动；横向越过整网格尽头时翻月，落点按进入侧计算
   *   （右溢出 → 下月行首，左溢出 → 上月行末；纵向溢出不翻月，交由 roving tabindex 兜底）
   * - Home / End 走行内语义；PageUp / PageDown 翻月
   * - Enter / Space 选中当日；Escape 关闭面板
   *
   * @param index 当前格在 calendarDays 中的下标
   */
  function onDayKeydown(event: KeyboardEvent, index: number): void {
    if (props.disabled) return
    const key = event.key
    const days = calendarDays.value

    if (isEscapeKey(event)) {
      event.preventDefault()
      close()
      return
    }
    if (isActivationKey(event)) {
      event.preventDefault()
      handleDayClick(days[index])
      return
    }
    if (key === LH_KEYS.PageUp || key === LH_KEYS.PageDown) {
      event.preventDefault()
      pendingGridFocus = () => Math.min(index % 7, days.length - 1)
      if (key === LH_KEYS.PageUp) prevUnit()
      else nextUnit()
      return
    }
    if (!isArrowKey(event) && !isHomeOrEndKey(event)) return

    const total = days.length
    const next = getNextGridCell(index, key, { cols: 7, total })
    if (next !== null) {
      event.preventDefault()
      focusDayIndex.value = next
      focusGridCell()
      return
    }
    // 只处理横向溢出翻月（纵向越过最后一行时，聚焦锚点会自然落到末行）
    if (key === LH_KEYS.ArrowRight) {
      event.preventDefault()
      pendingGridFocus = () => 0
      nextUnit()
    } else if (key === LH_KEYS.ArrowLeft) {
      event.preventDefault()
      pendingGridFocus = (t2) => t2 - 1
      prevUnit()
    }
    focusGridCell()
  }

  /** 把焦点移到日期网格当前的 tabindex=0 格（翻月 / 移动后调用） */
  function focusGridCell(): void {
    nextTick(() => {
      panelRef.value
        ?.querySelector<HTMLElement>('[data-day-grid] [tabindex="0"]')
        ?.focus()
    })
  }

  /** 月份 / 年份网格键盘导航：方向键移动 + Enter / Space 选中 + Escape 关闭 */
  function onCellKeydown(
    event: KeyboardEvent,
    index: number,
    total: number,
    cols: number,
    onActivate: () => void,
  ): void {
    if (props.disabled) return
    const key = event.key

    if (isEscapeKey(event)) {
      event.preventDefault()
      close()
      return
    }
    if (isActivationKey(event)) {
      event.preventDefault()
      onActivate()
      return
    }
    if (!isArrowKey(event) && !isHomeOrEndKey(event)) return

    const next = getNextGridCell(index, key, { cols, total, loop: true })
    if (next !== null) {
      event.preventDefault()
      if (viewMode.value === 'month') focusMonthIndex.value = next
      else focusYearIndex.value = next
    }
  }

  function onMonthKeydown(event: KeyboardEvent, index: number): void {
    onCellKeydown(event, index, monthCells.value.length, 3, () =>
      handleMonthClick(monthCells.value[index]),
    )
  }

  function onYearKeydown(event: KeyboardEvent, index: number): void {
    onCellKeydown(event, index, yearCells.value.length, 4, () =>
      handleYearClick(yearCells.value[index]),
    )
  }

  /**
   * 触发器键盘行为：Enter / Space / 方向键打开面板，Escape 关闭
   *
   * 触发器本身是可聚焦的容器（tabindex=0），不走原生 button 是因为内部还要放输入框
   */
  function onTriggerKeydown(event: KeyboardEvent): void {
    if (props.disabled) return
    if (isEscapeKey(event)) {
      if (internalVisible.value) event.preventDefault()
      close()
      return
    }
    if (isActivationKey(event) || isArrowKey(event) || isHomeOrEndKey(event)) {
      event.preventDefault()
      open()
    }
  }

  /** 面板打开时把焦点送进日期网格（WAI-ARIA 弹层模式：弹层内应有一个初始焦点） */
  function focusGridOnOpen(): void {
    if (viewMode.value !== 'date') return
    focusGridCell()
  }

  function handleMonthClick(m: { month: number }) {
    if (props.disabled) return
    if (props.mode === 'month') {
      const val = new Date(currentYear.value, m.month, 1)
      tempSelection.value = val
      emit('input', val)
      emit('change', val)
      close()
      return
    }
    currentMonth.value = m.month
    viewMode.value = 'date'
  }

  function handleYearClick(y: { year: number }) {
    if (props.disabled) return
    if (props.mode === 'year') {
      const val = new Date(y.year, 0, 1)
      tempSelection.value = val
      emit('input', val)
      emit('change', val)
      close()
      return
    }
    currentYear.value = y.year
    viewMode.value = 'month'
  }

  function handleClickOutside(e: MouseEvent) {
    if (!internalVisible.value) return
    const target = e.target as HTMLElement
    if (panelRef.value && panelRef.value.contains(target)) return
    if (pickerRef.value && pickerRef.value.contains(target)) return
    close()
  }

  function onResizeOrScroll() {
    if (internalVisible.value) updatePanelPosition()
  }

  watch(
    () => props.value,
    (val) => {
      // 段式值取起点定位面板；单值直接用
      const anchor = Array.isArray(val) ? val[0] : val
      if (anchor instanceof Date) {
        currentYear.value = anchor.getFullYear()
        currentMonth.value = anchor.getMonth()
      }
    },
    { immediate: true },
  )

  /**
   * 翻月 / 值变化后重算日期网格的 roving tabindex 落点
   *
   * pendingGridFocus 描述「进入侧」（翻月前的相对位置），在新网格的 total 上兑现；
   * 没有待兑现落点时回退锚点（选中日 → 今日 → 首格）
   */
  watch(
    [calendarDays, internalVisible],
    () => {
      if (!internalVisible.value || viewMode.value !== 'date') return
      focusDayIndex.value = resolveGridFocus(calendarDays.value.length)
    },
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
    internalVisible,
    viewMode,
    currentYear,
    currentMonth,
    weekDays,
    weekdaysAriaHidden,
    yearLabel,
    monthLabel,
    decadeLabel,
    monthCells,
    yearCells,
    monthRows,
    yearRows,
    calendarDays,
    calendarRows,
    dayTabIndex,
    dayAriaLabel,
    monthTabIndex,
    yearTabIndex,
    displayPlaceholder,
    pickerClasses,
    sxStyle,
    panelStyle,
    rangeSeparator,
    formatDisplay,
    isSelected,
    isDayDisabled,
    open,
    handleClear,
    handleDayClick,
    selectToday,
    confirmSelection,
    prevUnit,
    nextUnit,
    toggleView,
    handleMonthClick,
    handleYearClick,
    onDayKeydown,
    onMonthKeydown,
    onYearKeydown,
    onTriggerKeydown,
    monthName,
    prevLabel,
    nextLabel,
    todayLabel,
    confirmLabel,
    // datetime 时间列
    showSecond,
    hoursOption,
    minutesOption,
    secondsOption,
    hourTitle,
    minuteTitle,
    secondTitle,
    hourListRef,
    minuteListRef,
    secondListRef,
    handleTimeSelect,
    onTimeWheel,
    onTimeKeydown,
    hourActiveId,
    minuteActiveId,
    secondActiveId,
  }
}
