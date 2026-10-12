<template>
  <div
    :class="[
      'lh-input__wrapper',
      {
        'lh-input__wrapper--disabled': props.disabled,
        'lh-input__wrapper--focused': isFocused,
        'lh-input__wrapper--has-label': props.label,
        'lh-input__wrapper--has-value': inputValue,
      },
    ]"
    :style="componentStyle"
  >
    <!-- Label -->
    <label
      v-if="props.label"
      :class="['lh-input__label', { 'lh-input__label--float': isFocused || inputValue }]"
    >
      {{ props.label }}
    </label>

    <!-- Textarea -->
    <template v-if="isTextarea">
      <div
        :class="[
          'lh-input',
          'lh-input--textarea',
          `lh-input--${props.size}`,
          { 'lh-input--disabled': props.disabled },
        ]"
      >
        <textarea
          class="lh-input__inner"
          :value="inputValue"
          :disabled="props.disabled"
          :readonly="props.readonly"
          :aria-invalid="ariaInvalid"
          :placeholder="placeholderText"
          :maxlength="props.maxlength"
          :minlength="props.minlength"
          :data-autosize="props.autosize"
          :rows="props.rows"
          :name="props.name"
          :tabindex="props.tabindex"
          @input="onInput"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeyDown"
        ></textarea>
      </div>
      <span v-if="showsWordLimit" class="lh-input__count">{{ wordCount }}</span>
    </template>

    <!-- Input -->
    <template v-else>
      <div
        :class="[
          'lh-input',
          `lh-input--${props.size}`,
          {
            'lh-input--prefix': props.prefixIcon,
            'lh-input--suffix': props.suffixIcon || props.clearable,
            'lh-input--disabled': props.disabled,
          },
        ]"
      >
        <span v-if="props.prefixIcon" class="lh-input__prefix">
          <slot name="prefix">
            <LhIcon :name="props.prefixIcon" />
          </slot>
        </span>
        <input
          class="lh-input__inner"
          :type="props.type"
          :value="inputValue"
          :disabled="props.disabled"
          :readonly="props.readonly"
          :aria-invalid="ariaInvalid"
          :placeholder="placeholderText"
          :maxlength="props.maxlength"
          :minlength="props.minlength"
          :autofocus="props.autofocus"
          :autocomplete="props.autocomplete"
          :name="props.name"
          :tabindex="props.tabindex"
          @input="onInput"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeyDown"
        />
        <span v-if="props.suffixIcon || props.clearable" class="lh-input__suffix">
          <slot name="suffix">
            <LhIcon v-if="props.suffixIcon" :name="props.suffixIcon" />
            <svg
              v-if="props.clearable && inputValue"
              class="lh-input__suffix-icon lh-input__clear"
              viewBox="0 0 24 24"
              fill="currentColor"
              @click.stop="onClear"
            >
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </slot>
        </span>
      </div>
      <span v-if="showsWordLimit" class="lh-input__count">{{ wordCount }}</span>
    </template>
  </div>
</template>

<script lang="ts">
// 2.7 自定义 model：modelValue prop + input 事件（input 事件同时携带 change 的原生事件，
// v-model 处理器只取第一个参数赋值，与 element-ui 的 payload 约定一致）
export default { name: 'LhInput', model: { prop: 'modelValue', event: 'input' } }
</script>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import type { PropType } from 'vue'
import { useLhInput } from './index'
import type { LhInputProps, LhInputSize, LhInputType } from './types'
import LhIcon from '../../icon'
import { t } from '../../../locale'

const props = defineProps({
  modelValue: { type: String, default: undefined },
  type: { type: String as PropType<LhInputType>, default: 'text' },
  size: { type: String as PropType<LhInputSize>, default: 'medium' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  placeholder: { type: String, default: undefined },
  maxlength: { type: Number, default: undefined },
  minlength: { type: Number, default: undefined },
  showWordLimit: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  prefixIcon: { type: String, default: undefined },
  suffixIcon: { type: String, default: undefined },
  autofocus: { type: Boolean, default: false },
  autocomplete: { type: String, default: undefined },
  nativeType: { type: String, default: undefined },
  autosize: {
    type: [Boolean, Object] as PropType<boolean | { minRows?: number; maxRows?: number }>,
    default: false,
  },
  resize: {
    type: String as PropType<'none' | 'both' | 'horizontal' | 'vertical'>,
    default: 'vertical',
  },
  name: { type: String, default: undefined },
  rows: { type: Number, default: undefined },
  tabindex: { type: [Number, String] as PropType<number | string>, default: undefined },
  form: { type: String, default: undefined },
  inputStyle: { type: Object as PropType<Record<string, string>>, default: undefined },
  label: { type: String, default: undefined },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhInputProps['sx']>, default: undefined },
})

const emits = defineEmits(['input', 'change', 'focus', 'blur', 'clear', 'keydown'])

const {
  inputValue,
  componentStyle,
  isTextarea,
  isFocused,
  ariaInvalid,
  showsWordLimit,
  wordCount,
  handleInput,
  handleClear,
} = useLhInput(props)

// placeholder 未传时用语言包兜底；有 label 时占位与浮动标签冲突，保持空
const placeholderText = computed(() =>
  props.label ? '' : props.placeholder || t('input.placeholder', '请输入'),
)

// 同步外部 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val ?? ''
  },
)

const onInput = (e: Event) => {
  handleInput(e)
  emits('input', inputValue.value, e)
}

const onChange = (e: Event) => {
  emits('change', inputValue.value, e)
}

const onFocus = (e: FocusEvent) => {
  isFocused.value = true
  emits('focus', e)
}

const onBlur = (e: FocusEvent) => {
  isFocused.value = false
  emits('blur', e)
}

const onClear = (e: MouseEvent) => {
  handleClear(e)
  emits('input', '')
  emits('clear')
}

const onKeyDown = (e: KeyboardEvent) => {
  emits('keydown', e)
}
</script>
