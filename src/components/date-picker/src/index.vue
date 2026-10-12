<script lang="ts">
export default { name: 'LhDatePicker' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import LhIcon from '../../icon'
import LhButton from '../../button'
import { useLhDatePicker } from './index'
import type { LhDatePickerMode, LhDatePickerProps } from './types'
import type { LhComponentSize } from '@lh-ui/share/core/shared/types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import { isValidElementOrSelector } from '../../../utils/element-prop'

const props = defineProps({
  value: { type: [Date, Array] as PropType<LhDatePickerProps['value']>, default: undefined },
  mode: {
    type: String as PropType<LhDatePickerMode>,
    default: 'date',
    validator: (v: string) => ['date', 'month', 'year', 'datetime', 'range'].includes(v),
  },
  size: {
    type: String as PropType<LhComponentSize>,
    default: 'medium',
    validator: (v: string) => ['small', 'medium', 'large'].includes(v),
  },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  placeholder: { type: String, default: '' },
  // 默认格式在 composable 里按 mode 兜底（datetime 带时刻），此处保持 undefined 才能走到兜底
  format: { type: String, default: undefined },
  readonly: { type: Boolean, default: true },
  rangeSeparator: { type: String, default: '~' },
  cellClassName: {
    type: Function as PropType<LhDatePickerProps['cellClassName']>,
    default: undefined,
  },
  popperClass: { type: String, default: undefined },
  teleportTarget: {
    validator: isValidElementOrSelector,
    default: 'body',
  } as PropType<LhDatePickerProps['teleportTarget']>,
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const emit = defineEmits(['input', 'change'])

const {
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
  monthRows,
  yearRows,
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
} = useLhDatePicker(props, emit)

// cellClassName / popperClass 直接取 prop：composable 不消费它们，模板自行消费
const { cellClassName, popperClass } = props
</script>

<template>
  <div
    ref="pickerRef"
    class="lh-date-picker"
    :class="pickerClasses"
    :aria-invalid="!!formItem?.errorMessage || undefined"
    :style="sxStyle"
  >
    <div
      class="lh-date-picker__input"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      v-bind="triggerAria"
      @click="open"
      @keydown="onTriggerKeydown"
    >
      <template v-if="value">
        <span
          v-if="Array.isArray(value)"
          class="lh-date-picker__value"
        >
          {{ formatDisplay(value[0]) }}
          <span class="lh-date-picker__separator">{{ rangeSeparator }}</span>
          {{ formatDisplay(value[1]) }}
        </span>
        <span
          v-else
          class="lh-date-picker__value"
        >
          {{ formatDisplay(value) }}
        </span>
      </template>
      <input
        v-else
        :placeholder="displayPlaceholder"
        :readonly="true"
        :disabled="disabled"
        class="lh-date-picker__input-inner"
      >
      <LhIcon
        v-if="clearable && value"
        name="close"
        size="small"
        class="lh-date-picker__clear"
        v-on="{ click: handleClear }"
      />
      <LhIcon
        name="date"
        size="small"
        class="lh-date-picker__icon"
        aria-hidden="true"
      />
    </div>

    <!--
      Vue2 无 Teleport（红线 #4）：面板 host 在 mounted 被移到 teleportTarget，
      卸载时若被移走则主动 remove 防泄漏
    -->
    <div ref="panelHostRef" class="lh-date-picker__panel-host">
      <Transition name="lh-fade-in">
        <div
          v-if="internalVisible"
          ref="panelRef"
          class="lh-date-picker__panel"
          :class="popperClass"
          :style="panelStyle"
          v-bind="panelAria"
        >
          <div class="lh-date-picker-panel">
            <!-- 工具栏 -->
            <div class="lh-date-picker-panel__header">
              <div class="lh-date-picker-panel__title">
                <button
                  :disabled="disabled"
                  class="lh-date-picker-panel__btn"
                  type="button"
                  :aria-label="prevLabel"
                  @click="prevUnit"
                >
                  <LhIcon
                    name="arrow-left"
                    size="small"
                  />
                </button>
                <button
                  :id="`${panelId}-title`"
                  class="lh-date-picker-panel__title-text"
                  type="button"
                  @click="toggleView"
                >
                  <template v-if="viewMode === 'date'">
                    {{ currentYear }}{{ yearLabel }} {{ currentMonth + 1 }}{{ monthLabel }}
                  </template>
                  <template v-else-if="viewMode === 'month'">
                    {{ currentYear }}{{ yearLabel }}
                  </template>
                  <template v-else>
                    {{ decadeLabel }}
                  </template>
                </button>
                <button
                  :disabled="disabled"
                  class="lh-date-picker-panel__btn"
                  type="button"
                  :aria-label="nextLabel"
                  @click="nextUnit"
                >
                  <LhIcon
                    name="arrow-right"
                    size="small"
                  />
                </button>
              </div>
            </div>

            <!-- 日历视图（表头 + 主体） -->
            <template v-if="viewMode === 'date'">
              <div
                class="lh-date-picker-panel__weekdays"
                role="row"
                v-bind="weekdaysAriaHidden"
              >
                <span
                  v-for="(day, index) in weekDays"
                  :key="index"
                  class="lh-date-picker-panel__weekday"
                  role="columnheader"
                >
                  {{ day }}
                </span>
              </div>

              <div class="lh-date-picker-panel__body">
                <div
                  class="lh-date-picker-panel__days"
                  role="grid"
                  data-day-grid
                  :aria-labelledby="`${panelId}-title`"
                >
                  <template v-for="(row, rowIndex) in calendarRows">
                    <div
                      :key="`row-${rowIndex}`"
                      role="row"
                      style="display: contents"
                    >
                      <div
                        v-for="(day, colIndex) in row"
                        :key="day.date.getTime()"
                        class="lh-date-picker-panel__day"
                        role="gridcell"
                        :tabindex="dayTabIndex(rowIndex * 7 + colIndex)"
                        :aria-label="dayAriaLabel(day)"
                        :aria-selected="isSelected(day.date) ? 'true' : 'false'"
                        :aria-current="day.isToday ? 'date' : undefined"
                        :aria-disabled="isDayDisabled(day.date) ? 'true' : 'false'"
                        :class="[
                          {
                            'lh-date-picker-panel--disabled': isDayDisabled(day.date),
                            'lh-date-picker-panel--other': !day.isCurrentMonth,
                            'lh-date-picker-panel--today': day.isToday,
                            'lh-date-picker-panel--selected': isSelected(day.date),
                            'lh-date-picker-panel--in-range': day.isInRange,
                            'lh-date-picker-panel--start': day.isStart,
                            'lh-date-picker-panel--end': day.isEnd,
                          },
                          cellClassName ? cellClassName(day.date) : undefined,
                        ]"
                        @click="handleDayClick(day)"
                        @keydown="onDayKeydown($event, rowIndex * 7 + colIndex)"
                      >
                        {{ day.day }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <!-- datetime 时间列（复用 time-picker 的列交互） -->
              <div
                v-if="mode === 'datetime'"
                class="lh-date-picker-panel__time"
              >
                <div
                  ref="hourListRef"
                  class="lh-date-picker-panel__time-column"
                >
                  <div class="lh-date-picker-panel__time-title">{{ hourTitle }}</div>
                  <div
                    class="lh-date-picker-panel__time-body"
                    role="listbox"
                    :aria-label="hourTitle"
                    tabindex="0"
                    :aria-activedescendant="hourActiveId"
                    @wheel.prevent="onTimeWheel($event, 'hour')"
                    @keydown="onTimeKeydown($event, 'hour')"
                  >
                    <div
                      v-for="opt in hoursOption"
                      :id="`${panelId}-hour-${opt.value}`"
                      :key="opt.value"
                      class="lh-date-picker-panel__time-item"
                      role="option"
                      :aria-selected="opt.isSelected ? 'true' : 'false'"
                      :class="{ 'lh-date-picker-panel__time-item--active': opt.isSelected }"
                      @click="handleTimeSelect('hour', opt.value)"
                    >
                      {{ opt.text }}
                    </div>
                  </div>
                </div>
                <div
                  ref="minuteListRef"
                  class="lh-date-picker-panel__time-column"
                >
                  <div class="lh-date-picker-panel__time-title">{{ minuteTitle }}</div>
                  <div
                    class="lh-date-picker-panel__time-body"
                    role="listbox"
                    :aria-label="minuteTitle"
                    tabindex="0"
                    :aria-activedescendant="minuteActiveId"
                    @wheel.prevent="onTimeWheel($event, 'minute')"
                    @keydown="onTimeKeydown($event, 'minute')"
                  >
                    <div
                      v-for="opt in minutesOption"
                      :id="`${panelId}-minute-${opt.value}`"
                      :key="opt.value"
                      class="lh-date-picker-panel__time-item"
                      role="option"
                      :aria-selected="opt.isSelected ? 'true' : 'false'"
                      :class="{ 'lh-date-picker-panel__time-item--active': opt.isSelected }"
                      @click="handleTimeSelect('minute', opt.value)"
                    >
                      {{ opt.text }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="showSecond"
                  ref="secondListRef"
                  class="lh-date-picker-panel__time-column"
                >
                  <div class="lh-date-picker-panel__time-title">{{ secondTitle }}</div>
                  <div
                    class="lh-date-picker-panel__time-body"
                    role="listbox"
                    :aria-label="secondTitle"
                    tabindex="0"
                    :aria-activedescendant="secondActiveId"
                    @wheel.prevent="onTimeWheel($event, 'second')"
                    @keydown="onTimeKeydown($event, 'second')"
                  >
                    <div
                      v-for="opt in secondsOption"
                      :id="`${panelId}-second-${opt.value}`"
                      :key="opt.value"
                      class="lh-date-picker-panel__time-item"
                      role="option"
                      :aria-selected="opt.isSelected ? 'true' : 'false'"
                      :class="{ 'lh-date-picker-panel__time-item--active': opt.isSelected }"
                      @click="handleTimeSelect('second', opt.value)"
                    >
                      {{ opt.text }}
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 月份视图 -->
            <div
              v-else-if="viewMode === 'month'"
              class="lh-date-picker-panel__body"
            >
              <div
                class="lh-date-picker-panel__month-grid"
                role="grid"
                :aria-labelledby="`${panelId}-title`"
              >
                <template v-for="(row, rowIndex) in monthRows">
                  <div
                    :key="`mrow-${rowIndex}`"
                    role="row"
                    style="display: contents"
                  >
                    <div
                      v-for="(m, colIndex) in row"
                      :key="m.month"
                      class="lh-date-picker-panel__month-cell"
                      role="gridcell"
                      :tabindex="monthTabIndex(rowIndex * 3 + colIndex)"
                      :aria-selected="m.isSelected ? 'true' : 'false'"
                      :class="{ 'lh-date-picker-panel--selected': m.isSelected }"
                      @click="handleMonthClick(m)"
                      @keydown="onMonthKeydown($event, rowIndex * 3 + colIndex)"
                    >
                      {{ monthName(m.month) }}
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- 年份视图 -->
            <div
              v-else
              class="lh-date-picker-panel__body"
            >
              <div
                class="lh-date-picker-panel__year-grid"
                role="grid"
                :aria-labelledby="`${panelId}-title`"
              >
                <template v-for="(row, rowIndex) in yearRows">
                  <div
                    :key="`yrow-${rowIndex}`"
                    role="row"
                    style="display: contents"
                  >
                    <div
                      v-for="(y, colIndex) in row"
                      :key="y.year"
                      class="lh-date-picker-panel__year-cell"
                      role="gridcell"
                      :tabindex="yearTabIndex(rowIndex * 4 + colIndex)"
                      :aria-selected="y.isSelected ? 'true' : 'false'"
                      :class="{ 'lh-date-picker-panel--selected': y.isSelected }"
                      @click="handleYearClick(y)"
                      @keydown="onYearKeydown($event, rowIndex * 4 + colIndex)"
                    >
                      {{ y.year }}
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- 底部快捷操作（日期/日期时间/日期段模式需要确认按钮；月份/年份模式下点击即选中） -->
            <div
              v-if="mode === 'date' || mode === 'datetime' || mode === 'range'"
              class="lh-date-picker-panel__footer"
            >
              <LhButton
                size="small"
                @click="selectToday"
              >
                {{ todayLabel }}
              </LhButton>
              <LhButton
                size="small"
                type="primary"
                @click="confirmSelection"
              >
                {{ confirmLabel }}
              </LhButton>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
