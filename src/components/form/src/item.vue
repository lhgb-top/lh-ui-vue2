<template>
  <div
    class="lh-form-item"
    :class="{
      'lh-form-item--error': errorMessage,
      'lh-form-item--top': form?.labelPosition === 'top',
    }"
    @focusout="handleFocusout"
  >
    <label
      v-if="props.label"
      class="lh-form-item__label"
      :style="labelStyle"
      @click.prevent="focusControl"
    >
      <span v-if="props.required" class="lh-form-item__required">*</span>
      {{ props.label }}
    </label>
    <div
      ref="contentRef"
      class="lh-form-item__content"
      :aria-describedby="errorMessage ? errorId : undefined"
    >
      <slot></slot>
      <span v-if="errorMessage" :id="errorId" class="lh-form-item__error" role="alert">{{
        errorMessage
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'LhFormItem' }
</script>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, onMounted, provide, reactive, ref } from 'vue'
import type { PropType } from 'vue'
import { getFormFieldValue, validateFormField } from '@lh-ui/share/core/form'
import type { LhFormRule } from '@lh-ui/share/core/form'
import { generateId } from '@lh-ui/share/utils'
import { t } from '../../../locale'
import { LH_FORM_CONTEXT_KEY, LH_FORM_ITEM_CONTEXT_KEY } from './types'

const props = defineProps({
  prop: { type: String, default: undefined },
  label: { type: String, default: undefined },
  required: { type: Boolean, default: false },
  rules: { type: Array as PropType<LhFormRule[]>, default: undefined },
})

const form = inject(LH_FORM_CONTEXT_KEY, null)
const errorMessage = ref('')
// 暴露给后代表单控件：reactive 解包 ref，控件侧读到的就是响应式字符串，
// 校验失败时控件可据此绑定 aria-invalid（provide 的是 ref 本体，非快照）
provide(LH_FORM_ITEM_CONTEXT_KEY, reactive({ errorMessage }))
// 校验失败时错误文案的锚点：role="alert" 自动播报，aria-describedby 关联到内容区
const errorId = `lh-form-item__error-${generateId()}`
let unregisterField: (() => void) | undefined

const rules = computed(() => {
  const formRules = props.prop ? form?.rules?.[props.prop] || [] : []
  if (props.rules) return props.required ? [{ required: true }, ...props.rules] : props.rules
  return props.required ? [{ required: true }, ...formRules] : formRules
})

const labelStyle = computed(() => {
  if (!form?.labelWidth || form.labelPosition === 'top') return undefined
  const width = typeof form.labelWidth === 'number' ? `${form.labelWidth}px` : form.labelWidth
  return { width }
})

async function validate() {
  if (!props.prop || !form) return true
  // 必填兜底文案走语言包（form.required），core 层不再含文案字面量
  const message = validateFormField(
    getFormFieldValue(form.model, props.prop),
    rules.value,
    form.model,
    t('form.required'),
  )
  errorMessage.value = message || ''
  return !message
}

onMounted(() => {
  if (props.prop && form) {
    unregisterField = form.registerField(props.prop, validate)
  }
})

onBeforeUnmount(() => {
  unregisterField?.()
})

const contentRef = ref<HTMLElement | null>(null)

/**
 * 点击标签聚焦控件：slot 里的控件 id 无法静态得知，退而求其次
 * 聚焦内容区第一个可聚焦元素（label 的 for 关联需要控件 id，此处不适用）
 */
function focusControl() {
  const target = contentRef.value?.querySelector<HTMLElement>(
    'input:not([type="hidden"]), textarea, select, button, [tabindex]:not([tabindex="-1"])'
  )
  target?.focus()
}

function handleFocusout(event: FocusEvent) {
  // 焦点在 item 内部移动（控件 ↔ 控件 / 标签）不触发校验，只有真正离开才校验，
  // 否则中途焦点切换会闪出错误态
  const next = event.relatedTarget as Node | null
  if (next && (event.currentTarget as HTMLElement).contains(next)) return
  void validate()
}

defineExpose({ validate, errorMessage })
</script>
