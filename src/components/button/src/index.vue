<template>
  <button
    v-if="!props.href"
    :type="props.nativeType || 'button'"
    :class="[
      'lh-button',
      `lh-button--${props.type}`,
      `lh-button--${effectiveSize}`,
      {
        'lh-button--plain': props.plain,
        'lh-button--block': props.block,
        'lh-button--round': props.round,
        'lh-button--circle': props.circle,
        'lh-button--loading': props.loading,
        'lh-button--disabled': props.disabled,
      },
    ]"
    :disabled="props.disabled || props.loading"
    :style="buttonStyle"
    @click="handleClick"
  >
    <span v-if="props.loading" class="lh-button__loading">
      <svg class="lh-button__spinner" viewBox="0 0 100 100">
        <circle class="lh-button__path" cx="50" cy="50" r="20" fill="none" stroke-width="16" />
      </svg>
    </span>
    <span v-if="props.icon" class="lh-button__icon">
      <slot name="icon">
        <i :class="props.icon"></i>
      </slot>
    </span>
    <span v-if="$slots.default" class="lh-button__text">
      <slot></slot>
    </span>
  </button>

  <a
    v-else
    :href="props.href"
    :target="props.target"
    :class="[
      'lh-button',
      `lh-button--${props.type}`,
      `lh-button--${effectiveSize}`,
      {
        'lh-button--plain': props.plain,
        'lh-button--block': props.block,
        'lh-button--round': props.round,
        'lh-button--circle': props.circle,
        'lh-button--disabled': props.disabled,
      },
    ]"
    :style="buttonStyle"
  >
    <span v-if="props.icon" class="lh-button__icon">
      <slot name="icon">
        <i :class="props.icon"></i>
      </slot>
    </span>
    <span v-if="$slots.default" class="lh-button__text">
      <slot></slot>
    </span>
  </a>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhButton' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhButton } from './index'
import type { LhButtonProps, LhButtonType, LhButtonSize } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  type: { type: String as PropType<LhButtonType>, default: 'default' },
  size: { type: String as PropType<LhButtonSize>, default: undefined },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  circle: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  nativeType: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
  href: { type: String, default: '' },
  target: { type: String, default: '_self' },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhButtonProps['sx']>, default: undefined },
})

const emit = defineEmits(['click'])

const { handleClick, buttonStyle, effectiveSize } = useLhButton(props, emit)
</script>
