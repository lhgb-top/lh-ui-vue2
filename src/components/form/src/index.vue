<template>
  <form class="lh-form" :class="{ 'lh-form--inline': props.inline }" :style="sxStyle" @submit.prevent>
    <slot></slot>
  </form>
</template>

<script lang="ts">
export default { name: 'LhForm' }
</script>

<script lang="ts" setup>
import { computed, provide, reactive } from 'vue'
import type { PropType } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { SxProps } from '@lh-ui/share/core/shared/sx'
import { getFormFieldValue, validateFormField } from '@lh-ui/share/core/form'
import type { LhFormRule } from '@lh-ui/share/core/form'
import { t } from '../../../locale'
import type { LhFormLabelPosition } from './types'
import { LH_FORM_CONTEXT_KEY } from './types'

const props = defineProps({
  model: { type: Object as PropType<Record<string, unknown>>, required: true },
  rules: { type: Object as PropType<Record<string, LhFormRule[]>>, default: undefined },
  labelPosition: { type: String as PropType<LhFormLabelPosition>, default: 'right' },
  labelWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
  inline: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<SxProps>, default: undefined },
})

// sx 快速布局属性：转内联样式作用于根元素
const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

const initialValues = new Map<string, unknown>()
const fieldValidators = new Map<string, () => Promise<boolean>>()
const model = props.model

function getRules(prop: string) {
  return props.rules?.[prop] || []
}

function validateField(prop: string): Promise<boolean> {
  const message = validateFormField(
    getFormFieldValue(model, prop),
    getRules(prop),
    model,
    t('form.required'),
  )
  return Promise.resolve(!message)
}

function resetField(prop: string) {
  if (!initialValues.has(prop)) return
  const keys = prop.split('.')
  const lastKey = keys.pop()
  if (!lastKey) return

  let target: Record<string, unknown> = model
  for (const key of keys) {
    const value = target[key]
    if (!value || typeof value !== 'object') return
    target = value as Record<string, unknown>
  }
  target[lastKey] = initialValues.get(prop)
}

function validate(): Promise<boolean> {
  const validators = new Set<() => Promise<boolean>>()
  fieldValidators.forEach((validator) => validators.add(validator))
  Object.keys(props.rules || {}).forEach((prop) => validators.add(() => validateField(prop)))
  return Promise.all([...validators].map((validator) => validator())).then((results) =>
    results.every(Boolean),
  )
}

function resetFields() {
  Object.keys(props.rules || {}).forEach(resetField)
}

function registerField(prop: string, validator: () => Promise<boolean>) {
  fieldValidators.set(prop, validator)
  return () => fieldValidators.delete(prop)
}

for (const prop of Object.keys(props.rules || {})) {
  initialValues.set(prop, getFormFieldValue(model, prop))
}

provide(
  LH_FORM_CONTEXT_KEY,
  reactive({
    model,
    rules: props.rules,
    labelPosition: props.labelPosition,
    labelWidth: props.labelWidth,
    registerField,
    validateField,
    resetField,
  }),
)

defineExpose({ validate, resetFields, validateField, resetField })
</script>
