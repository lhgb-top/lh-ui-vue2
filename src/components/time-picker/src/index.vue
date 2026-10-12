<script lang="ts">
export default { name: 'LhTimePicker' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import LhIcon from '../../icon'
import LhButton from '../../button'
import { useLhTimePicker } from './index'
import type { LhTimePickerMode, LhTimePickerProps } from './types'
import type { LhComponentSize } from '@lh-ui/share/core/shared/types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import { isValidElementOrSelector } from '../../../utils/element-prop'

const props = defineProps({
  value: { type: Date as PropType<Date | null>, default: undefined },
  mode: {
    type: String as PropType<LhTimePickerMode>,
    default: 'time',
    validator: (v: string) => ['time', 'date-time'].includes(v),
  },
  size: {
    type: String as PropType<LhComponentSize>,
    default: 'medium',
    validator: (v: string) => ['small', 'medium', 'large'].includes(v),
  },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  placeholder: { type: String, default: '' },
  format: { type: String, default: 'HH:mm:ss' },
  readonly: { type: Boolean, default: true },
  arrowControl: { type: Boolean, default: false },
  stepHour: { type: Number, default: 1 },
  stepMinute: { type: Number, default: 1 },
  stepSecond: { type: Number, default: 1 },
  teleportTarget: {
    validator: isValidElementOrSelector,
    default: 'body',
  } as PropType<LhTimePickerProps['teleportTarget']>,
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
  hourColumnAria,
  minuteColumnAria,
  secondColumnAria,
  hourActiveId,
  minuteActiveId,
  secondActiveId,
  hourListRef,
  minuteListRef,
  secondListRef,
  internalVisible,
  selecting,
  showSecond,
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
} = useLhTimePicker(props, emit)
</script>

<template>
  <div
    ref="pickerRef"
    :class="pickerClasses"
    :aria-invalid="!!formItem?.errorMessage || undefined"
    :style="sxStyle"
  >
    <div
      class="lh-time-picker__input"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      v-bind="triggerAria"
      @click="open"
      @keydown="onTriggerKeydown"
    >
      <template v-if="value">
        <span class="lh-time-picker__value">
          {{ formatDisplay }}
        </span>
      </template>
      <input
        v-else
        :placeholder="displayPlaceholder"
        :readonly="true"
        :disabled="disabled"
        class="lh-time-picker__input-inner"
      >
      <LhIcon
        v-if="clearable && value"
        name="close"
        size="small"
        class="lh-time-picker__clear"
        v-on="{ click: handleClear }"
      />
      <LhIcon
        name="date"
        size="small"
        class="lh-time-picker__icon"
        aria-hidden="true"
      />
    </div>

    <!--
      Vue2 无 Teleport（红线 #4）：面板 host 在 mounted 被移到 teleportTarget，
      卸载时若被移走则主动 remove 防泄漏
    -->
    <div ref="panelHostRef" class="lh-time-picker__panel-host">
      <Transition name="lh-fade-in">
        <div
          v-if="internalVisible"
          ref="panelRef"
          class="lh-time-picker__panel"
          :style="panelStyle"
          v-bind="panelAria"
        >
          <div class="lh-time-picker-panel">
            <!-- 时间选择列 -->
            <div class="lh-time-picker-panel__columns">
              <!-- 小时列 -->
              <div
                ref="hourListRef"
                :class="[
                  'lh-time-picker-panel__column',
                  { 'lh-time-picker-panel__column--selecting': selecting === 'hour' },
                ]"
                @mouseenter="selecting = 'hour'"
                @mouseleave="selecting = null"
              >
                <div class="lh-time-picker-panel__column-header">
                  <span class="lh-time-picker-panel__column-title">{{ hourTitle }}</span>
                  <template v-if="arrowControl">
                    <button
                      class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--up"
                      type="button"
                      @click="moveColumn('hour', -1)"
                    >
                      <LhIcon
                        name="arrow-up"
                        size="small"
                      />
                    </button>
                    <button
                      class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--down"
                      type="button"
                      @click="moveColumn('hour', 1)"
                    >
                      <LhIcon
                        name="arrow-down"
                        size="small"
                      />
                    </button>
                  </template>
                </div>
                <div
                  class="lh-time-picker-panel__column-body"
                  v-bind="hourColumnAria"
                  tabindex="0"
                  :aria-activedescendant="hourActiveId"
                  @wheel.prevent="onWheel($event, 'hour')"
                  @keydown="onColumnKeydown($event, 'hour')"
                >
                  <div
                    v-for="opt in hoursOption"
                    :id="`${panelId}-hour-${opt.value}`"
                    :key="opt.value"
                    class="lh-time-picker-panel__column-item"
                    :class="{
                      'lh-time-picker-panel__column-item--active': opt.isSelected,
                      'lh-time-picker-panel__column-item--disabled': opt.isDisabled,
                    }"
                    role="option"
                    :aria-selected="opt.isSelected ? 'true' : 'false'"
                    @click="handleSelect('hour', opt.value)"
                  >
                    {{ opt.text }}
                  </div>
                </div>
              </div>

              <!-- 分钟列 -->
              <div
                ref="minuteListRef"
                :class="[
                  'lh-time-picker-panel__column',
                  { 'lh-time-picker-panel__column--selecting': selecting === 'minute' },
                ]"
                @mouseenter="selecting = 'minute'"
                @mouseleave="selecting = null"
              >
                <div class="lh-time-picker-panel__column-header">
                  <span class="lh-time-picker-panel__column-title">{{ minuteTitle }}</span>
                  <template v-if="arrowControl">
                    <button
                      class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--up"
                      type="button"
                      @click="moveColumn('minute', -1)"
                    >
                      <LhIcon
                        name="arrow-up"
                        size="small"
                      />
                    </button>
                    <button
                      class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--down"
                      type="button"
                      @click="moveColumn('minute', 1)"
                    >
                      <LhIcon
                        name="arrow-down"
                        size="small"
                      />
                    </button>
                  </template>
                </div>
                <div
                  class="lh-time-picker-panel__column-body"
                  v-bind="minuteColumnAria"
                  tabindex="0"
                  :aria-activedescendant="minuteActiveId"
                  @wheel.prevent="onWheel($event, 'minute')"
                  @keydown="onColumnKeydown($event, 'minute')"
                >
                  <div
                    v-for="opt in minutesOption"
                    :id="`${panelId}-minute-${opt.value}`"
                    :key="opt.value"
                    class="lh-time-picker-panel__column-item"
                    :class="{
                      'lh-time-picker-panel__column-item--active': opt.isSelected,
                      'lh-time-picker-panel__column-item--disabled': opt.isDisabled,
                    }"
                    role="option"
                    :aria-selected="opt.isSelected ? 'true' : 'false'"
                    @click="handleSelect('minute', opt.value)"
                  >
                    {{ opt.text }}
                  </div>
                </div>
              </div>

              <!-- 秒列 -->
              <div
                v-if="showSecond"
                ref="secondListRef"
                :class="[
                  'lh-time-picker-panel__column',
                  { 'lh-time-picker-panel__column--selecting': selecting === 'second' },
                ]"
                @mouseenter="selecting = 'second'"
                @mouseleave="selecting = null"
              >
                <div class="lh-time-picker-panel__column-header">
                  <span class="lh-time-picker-panel__column-title">{{ secondTitle }}</span>
                  <template v-if="arrowControl">
                    <button
                      class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--up"
                      type="button"
                      @click="moveColumn('second', -1)"
                    >
                      <LhIcon
                        name="arrow-up"
                        size="small"
                      />
                    </button>
                    <button
                      class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--down"
                      type="button"
                      @click="moveColumn('second', 1)"
                    >
                      <LhIcon
                        name="arrow-down"
                        size="small"
                      />
                    </button>
                  </template>
                </div>
                <div
                  class="lh-time-picker-panel__column-body"
                  v-bind="secondColumnAria"
                  tabindex="0"
                  :aria-activedescendant="secondActiveId"
                  @wheel.prevent="onWheel($event, 'second')"
                  @keydown="onColumnKeydown($event, 'second')"
                >
                  <div
                    v-for="opt in secondsOption"
                    :id="`${panelId}-second-${opt.value}`"
                    :key="opt.value"
                    class="lh-time-picker-panel__column-item"
                    :class="{
                      'lh-time-picker-panel__column-item--active': opt.isSelected,
                      'lh-time-picker-panel__column-item--disabled': opt.isDisabled,
                    }"
                    role="option"
                    :aria-selected="opt.isSelected ? 'true' : 'false'"
                    @click="handleSelect('second', opt.value)"
                  >
                    {{ opt.text }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部快捷操作 -->
            <div class="lh-time-picker-panel__footer">
              <LhButton
                size="small"
                @click="selectNow"
              >
                {{ nowLabel }}
              </LhButton>
              <LhButton
                size="small"
                @click="close"
              >
                {{ cancelLabel }}
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
