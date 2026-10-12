<template>
  <form class="lh-form" :class="{ 'lh-form--inline': props.inline }" :style="sxStyle" @submit.prevent>
    <slot></slot>
  </form>
</template>

<script lang="ts">
export default { name: 'LhForm' }
</script>

<script lang="ts" setup>
import { computed, provide, watch } from 'vue'
import type { PropType } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
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
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

// sx 快速布局属性：转内联样式作用于根元素
const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

const initialValues = new Map<string, unknown>()
const fieldValidators = new Map<string, () => Promise<boolean>>()

function getRules(prop: string) {
  return props.rules?.[prop] || []
}

function validateField(prop: string): Promise<boolean> {
  const message = validateFormField(
    getFormFieldValue(props.model, prop),
    getRules(prop),
    props.model,
    t('form.required'),
  )
  return Promise.resolve(!message)
}

function resetField(prop: string) {
  if (!initialValues.has(prop)) return
  const keys = prop.split('.')
  const lastKey = keys.pop()
  if (!lastKey) return

  let target: Record<string, unknown> = props.model
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

// 初始值快照：rules 在 setup 后才到达（异步加载）的字段也要能 reset，
// 因此随 rules 变化增量补拍（immediate 覆盖 setup 期已声明的 rules）
watch(
  () => props.rules,
  (rules) => {
    for (const prop of Object.keys(rules || {})) {
      if (!initialValues.has(prop)) {
        initialValues.set(prop, getFormFieldValue(props.model, prop))
      }
    }
  },
  { immediate: true },
)

// provide 的上下文必须保持响应式（红线 #6「provide computed 本体，不得快照」）。
// Vue2.7 的 reactive() 会把 getter 摊平成一次性取值（defineProperty walk 语义），
// 因此这里 provide **plain getter 对象**：getter 读取 props（2.7 的 defineProps
// 返回响应式代理），消费方在 computed/render 里访问时正常建立依赖，
// 运行时改 rules / labelPosition / labelWidth 即时传导给 FormItem
provide(LH_FORM_CONTEXT_KEY, {
  get model() {
    return props.model
  },
  get rules() {
    return props.rules
  },
  get labelPosition() {
    return props.labelPosition
  },
  get labelWidth() {
    return props.labelWidth
  },
  registerField,
  validateField,
  resetField,
})

defineExpose({ validate, resetFields, validateField, resetField })
</script>
