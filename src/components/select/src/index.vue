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
      ref="triggerRef"
      class="lh-select__trigger"
      role="combobox"
      tabindex="0"
      :name="props.name"
      :aria-label="props.ariaLabel"
      :aria-disabled="props.disabled ? 'true' : 'false'"
      :aria-expanded="isOpen ? 'true' : 'false'"
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
          :aria-label="t('select.clear', '清空')"
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
      <transition name="lh-select-fade">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="lh-select__dropdown"
          :class="{ 'lh-select__dropdown--teleported': shouldTeleport }"
          :style="mergedDropdownStyle"
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
            :aria-selected="isSelected(option) ? 'true' : 'false'"
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
      </transition>
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
import { LH_KEYS, isEscapeKey } from '@lh-ui/share/core/shared/keyboard'
import type { LhSelectOption } from './types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import { useLhPopper } from '../../../composables/overlay'
import { useLhZIndex } from '../../../composables'
import { LH_FORM_ITEM_CONTEXT_KEY } from '../../form/src/types'
import { isValidElementOrSelector } from '../../../utils/element-prop'

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
    validator: isValidElementOrSelector,
    default: 'body',
  } as PropType<'body' | HTMLElement | string>,
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const emit = defineEmits(['input', 'change', 'clear'])

// sx 快速布局属性：转内联样式作用于根元素
const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownHostRef = ref<HTMLElement | null>(null)
const formItem = inject(LH_FORM_ITEM_CONTEXT_KEY, null)
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const dropdownZIndex = ref<number | undefined>(undefined)
const { nextZIndex } = useLhZIndex()
// modelValue 未传时不能匹配 value 为 undefined 的选项：Object.is(undefined, undefined) 恒真，
// 会让「无 value 的选项」在未选任何项时误显示已选中
const selectedOption = computed(() =>
  props.modelValue === undefined ? undefined : findSelectOption(props.options, props.modelValue),
)

const shouldTeleport = computed(() => !!props.popperContainer)

const teleportTarget = computed<HTMLElement | null>(() => {
  if (typeof document === 'undefined' || !props.popperContainer) return null
  if (props.popperContainer === 'body') return document.body
  if (typeof props.popperContainer === 'string')
    return document.querySelector(props.popperContainer)
  return props.popperContainer
})

// 定位统一走 useLhPopper（flip/shift/滚动重定位与弹层族一致）；下拉宽度始终匹配触发器
const { popperStyle } = useLhPopper({
  triggerRef,
  popperRef: dropdownRef,
  visible: isOpen,
  placement: 'bottom-start',
  gap: 4,
})

const mergedDropdownStyle = computed<Record<string, string>>(() => {
  const trigger = triggerRef.value
  const width = trigger ? `${trigger.offsetWidth}px` : undefined
  return {
    ...popperStyle.value,
    ...(width ? { width } : {}),
    ...(dropdownZIndex.value != null ? { zIndex: String(dropdownZIndex.value) } : {}),
  }
})

function isSelected(option: LhSelectOption) {
  // 同上：未传值时对无 value 选项的误匹配必须挡住
  return props.modelValue !== undefined && Object.is(option.value, props.modelValue)
}

function open() {
  if (props.disabled) return
  // 每次打开领取一个新的层级（高于普通内容、低于后打开的弹层）
  dropdownZIndex.value = nextZIndex()
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
  if (event.key === LH_KEYS.ArrowDown || event.key === LH_KEYS.ArrowUp) {
    event.preventDefault()
    if (!isOpen.value) open()
    else
      highlightedIndex.value = getNextEnabledIndex(
        props.options,
        highlightedIndex.value,
        event.key === LH_KEYS.ArrowDown ? 1 : -1,
      )
    return
  }

  if (event.key === LH_KEYS.Enter && isOpen.value && highlightedIndex.value >= 0) {
    event.preventDefault()
    const option = props.options[highlightedIndex.value]
    if (option) selectOption(option)
  }

  if (isEscapeKey(event)) close()
}

// mousedown 在 click 处理器之前触发，点选项的 click 冒泡不会先收起面板（与弹层族约定一致）
function handleDocumentMousedown(event: MouseEvent) {
  const dropdown = dropdownRef.value
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    // teleported 的下拉同样视为内部（host 也在 root 外）
    if (!dropdown || !dropdown.contains(event.target as Node)) close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentMousedown)
  // Vue2 无 Teleport：dropdown host 移到 teleportTarget（默认 body）
  if (shouldTeleport.value) {
    const host = dropdownHostRef.value
    const target = teleportTarget.value
    if (host && target && host.parentElement !== target) {
      target.appendChild(host)
    }
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentMousedown)
  // host 被移出 $el 子树，卸载时主动移除防泄漏
  dropdownHostRef.value?.remove()
})

defineExpose({ open, close, toggle, clear, isOpen })
</script>
