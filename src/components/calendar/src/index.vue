<script lang="ts">
export default { name: 'LhCalendar' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhCalendar } from './index'
import type { LhCalendarMode, LhCalendarRange, LhCalendarSelection, LhCalendarValue } from './types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

const props = defineProps({
  value: { type: [Date, Array] as PropType<LhCalendarValue>, default: undefined },
  selection: {
    type: String as PropType<LhCalendarSelection>,
    default: 'single',
    validator: (v: string) => ['single', 'range', 'multiple'].includes(v),
  },
  range: { type: Array as PropType<LhCalendarRange>, default: undefined },
  mode: {
    type: String as PropType<LhCalendarMode>,
    default: 'panel',
    validator: (v: string) => ['panel', 'input'].includes(v),
  },
  panels: { type: Number, default: 1 },
  placeholder: { type: String, default: undefined },
  closeOnSelect: { type: Boolean, default: true },
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const emit = defineEmits(['input', 'change', 'select'])

const {
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
} = useLhCalendar(props, emit)
</script>

<template>
  <div
    ref="rootRef"
    :class="calendarClasses"
    :style="calendarStyle"
  >
    <!-- input 模式：点击输入框展开 / 收起面板 -->
    <input
      v-if="isInputMode"
      type="text"
      readonly
      class="lh-calendar__input"
      :value="inputText"
      :placeholder="placeholderText"
      role="combobox"
      :aria-expanded="panelOpen ? 'true' : 'false'"
      aria-haspopup="grid"
      @click="panelOpen = !panelOpen"
    >

    <div
      v-show="!isInputMode || panelOpen"
      class="lh-calendar__panels"
    >
      <span class="lh-calendar__nav-row">
        <button
          type="button"
          class="lh-calendar__nav"
          :aria-label="prevMonthLabel"
          @click="shiftMonth(-1)"
        >‹</button>
        <button
          type="button"
          class="lh-calendar__nav"
          :aria-label="nextMonthLabel"
          @click="shiftMonth(1)"
        >›</button>
      </span>

      <div
        v-for="panel in panelMonths"
        :key="`${panel.year}-${panel.month}`"
        class="lh-calendar__panel"
      >
        <div class="lh-calendar__header">
          <slot
            name="header"
            :year="panel.year"
            :month="panel.month"
          >
            <span class="lh-calendar__title">{{ panelTitle(panel) }}</span>
          </slot>
        </div>
        <div
          class="lh-calendar__grid"
          role="grid"
          @keydown="handleKeydown"
        >
          <div
            class="lh-calendar__row"
            role="row"
          >
            <span
              v-for="week in weekLabels"
              :key="week.key"
              role="columnheader"
              class="lh-calendar__weekday"
            >{{ week.label }}</span>
          </div>
          <div
            v-for="(row, rowIndex) in panel.rows"
            :key="rowIndex"
            class="lh-calendar__row"
            role="row"
          >
            <button
              v-for="day in row"
              :key="day.date.getTime()"
              type="button"
              class="lh-calendar__cell"
              :class="{
                'lh-calendar__cell--outside': !day.isCurrentMonth,
                'lh-calendar__cell--today': day.isToday,
                'lh-calendar__cell--selected': isSelected(day.date),
                'lh-calendar__cell--in-range': isWithinSpan(day.date),
              }"
              role="gridcell"
              :aria-current="day.isToday ? 'date' : undefined"
              :aria-selected="isSelected(day.date) ? 'true' : 'false'"
              :aria-label="cellAria(day.date)"
              :disabled="isDisabled(day.date) || undefined"
              :tabindex="isFocusTarget(day.date) ? 0 : -1"
              @click="select(day.date)"
            >
              <slot
                name="cell"
                :date="day.date"
              >{{ day.day }}</slot>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
