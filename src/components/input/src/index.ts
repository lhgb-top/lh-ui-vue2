import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'
import type { LhInputProps } from './types'
import { useLhConfigContext } from '../../config-provider/src'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'
import { useLhComponentTheme } from '../../../composables'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { getInputStyle, shouldShowWordLimit, getWordCount, clampString } from '@lh-ui/share/core/input'

export const useLhInput = (props: LhInputProps) => {
  const configContext = useLhConfigContext()
  // 祖先 LhFormItem 的校验状态：校验失败时原生控件标记 aria-invalid
  const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)
  const ariaInvalid = computed(() => !!formItem?.errorMessage || undefined)
  const inputValue: Ref<string> = ref(props.modelValue ?? '')

  const inputStyle = computed(() => getInputStyle(props.size || 'medium'))
  const { componentStyle: _componentStyle } = useLhComponentTheme('input', props, configContext)
  const componentStyle = computed(() => ({
    ..._componentStyle.value,
    ...sxToStyle(props.sx ?? {}),
  }))

  const isDisabled = computed(() => props.disabled)
  const isTextarea = computed(() => props.type === 'textarea')
  const isFocused: Ref<boolean> = ref(false)

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    let val = target.value
    val = clampString(val, props.maxlength)
    inputValue.value = val
  }

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation()
    inputValue.value = ''
  }

  const showsWordLimit = computed(() => {
    return !!props.showWordLimit && shouldShowWordLimit({ maxlength: props.maxlength, minlength: props.minlength })
  })

  const wordCount = computed(() => {
    return getWordCount({ value: inputValue.value, maxlength: props.maxlength })
  })

  return {
    inputValue,
    inputStyle,
    componentStyle,
    isDisabled,
    isTextarea,
    isFocused,
    ariaInvalid,
    showsWordLimit,
    wordCount,
    handleInput,
    handleClear,
  }
}
