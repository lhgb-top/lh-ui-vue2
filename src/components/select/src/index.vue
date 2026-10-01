<template>
  <div
    ref="rootRef"
    class="lh-select"
    :class="[
      `lh-select--${props.size}`,
      {
        'lh-select--open': isOpen,
        'lh-select--disabled': props.disabled,
      },
    ]"
    :style="sxStyle"
  >
    <div
      class="lh-select__trigger"
      role="combobox"
      tabindex="0"
      :name="props.name"
      :aria-label="props.ariaLabel"
      :aria-disabled="props.disabled"
      :aria-expanded="isOpen"
      :aria-invalid="!!formItem?.errorMessage || undefined"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span class="lh-select__value" :class="{ 'lh-select__value--placeholder': !selectedOption }">
        {{ selectedOption?.label || props.placeholder || t('select.placeholder', '请选择') }}
      </span>
      <span class="lh-select__actions">
        <button
          v-if="props.clearable && selectedOption"
          class="lh-select__clear"
          type="button"
          aria-label="Clear selection"
          @click.stop="clear"
        >
          ×
        </button>
        <span class="lh-select__arrow" aria-hidden="true">⌄</span>
      </span>
    </div>

    <!--
      Vue2 无 Teleport（红线 #4）：shouldTeleport 时 dropdown host 在 mounted 被移到
      teleportTarget，否则留在原地；卸载时若被移走则主动 remove 防泄漏
    -->
    <div ref="dropdownHostRef" class="lh-select__dropdown-host">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="lh-select__dropdown"
        :class="{ 'lh-select__dropdown--teleported': shouldTeleport }"
        :style="dropdownStyle"
        role="listbox"
      >
        <button
          v-for="(option, index) in props.options"
          :key="index"
          class="lh-select__option"
          :class="{
            'lh-select__option--selected': isSelected(option),
            'lh-select__option--highlighted': highlightedIndex === index,
            'lh-select__option--disabled': option.disabled,
          }"
          type="button"
          role="option"
          :aria-selected="isSelected(option)"
          :disabled="option.disabled"
          @mouseenter="highlightedIndex = index"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </button>
        <span v-if="!props.options?.length" class="lh-select__empty">
          <slot name="empty">{{ t('select.noData', '暂无数据') }}</slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 自定义 model：modelValue prop + input 事件
export default { name: 'LhSelect', model: { prop: 'modelValue', event: 'input' } }
</script>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { findSelectOption, getNextEnabledIndex } from '@lh-ui/share/core/select'
import type { LhSelectOption } from './types'
import type { SxProps } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'

const props = defineProps({
  modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
  options: { type: Array as PropType<LhSelectOption[]>, default: () => [] },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  size: { type: String as PropType<'small' | 'medium' | 'large'>, default: 'medium' },
  name: { type: String, default: undefined },
  ariaLabel: { type: String, default: undefined },
  popperContainer: {
    type: [String, Object] as PropType<'body' | HTMLElement | string>,
    default: 'body',
  },
  sx: { type: [Object, Array, String] as PropType<SxProps>, default: undefined },
})

const emit = defineEmits(['input', 'change', 'clear'])

// sx 快速布局属性：转内联样式作用于根元素
const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

const rootRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownHostRef = ref<HTMLElement | null>(null)
const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const selectedOption = computed(() => findSelectOption(props.options, props.modelValue))

const shouldTeleport = computed(() => !!props.popperContainer)

const teleportTarget = computed<HTMLElement | null>(() => {
  if (typeof document === 'undefined' || !props.popperContainer) return null
  if (props.popperContainer === 'body') return document.body
  if (typeof props.popperContainer === 'string')
    return document.querySelector(props.popperContainer)
  return props.popperContainer
})

const dropdownStyle = computed<Record<string, string>>(() => {
  if (!shouldTeleport.value || !rootRef.value) return {}
  const rect = rootRef.value.getBoundingClientRect()
  return {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: 2000,
  }
})

function updatePosition() {
  const forceRect = rootRef.value?.getBoundingClientRect()
  if (forceRect && dropdownRef.value && shouldTeleport.value) {
    dropdownRef.value.style.top = `${forceRect.bottom + 4}px`
    dropdownRef.value.style.left = `${forceRect.left}px`
    dropdownRef.value.style.width = `${forceRect.width}px`
  }
}

function isSelected(option: LhSelectOption) {
  return Object.is(option.value, props.modelValue)
}

function open() {
  if (props.disabled) return
  isOpen.value = true
  const selectedIndex = props.options.findIndex(isSelected)
  highlightedIndex.value =
    selectedIndex >= 0 ? selectedIndex : getNextEnabledIndex(props.options, -1, 1)
}

function close() {
  isOpen.value = false
}

function toggle() {
  if (isOpen.value) close()
  else open()
}

function selectOption(option: LhSelectOption) {
  if (option.disabled) return
  emit('input', option.value)
  emit('change', option.value, option)
  close()
}

function clear() {
  emit('input', undefined)
  emit('change', undefined, undefined)
  emit('clear')
  close()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) open()
    else
      highlightedIndex.value = getNextEnabledIndex(
        props.options,
        highlightedIndex.value,
        event.key === 'ArrowDown' ? 1 : -1,
      )
    return
  }

  if (event.key === 'Enter' && isOpen.value && highlightedIndex.value >= 0) {
    event.preventDefault()
    const option = props.options[highlightedIndex.value]
    if (option) selectOption(option)
  }

  if (event.key === 'Escape') close()
}

function handleDocumentClick(event: MouseEvent) {
  const dropdown = dropdownRef.value
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    // teleported 的下拉同样视为内部（host 也在 root 外）
    if (!dropdown || !dropdown.contains(event.target as Node)) close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  if (shouldTeleport.value) {
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    // Vue2 无 Teleport：dropdown host 移到 teleportTarget（默认 body）
    const host = dropdownHostRef.value
    const target = teleportTarget.value
    if (host && target && host.parentElement !== target) {
      target.appendChild(host)
    }
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  // host 被移出 $el 子树，卸载时主动移除防泄漏
  dropdownHostRef.value?.remove()
})

defineExpose({ open, close, toggle, clear, isOpen })
</script>
