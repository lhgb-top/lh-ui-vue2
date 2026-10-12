import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { findTreeNode, isTreeNodeLeaf } from '@lh-ui/share/core/tree'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { isActivationKey, isEscapeKey } from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
import { useLhZIndex } from '../../../composables'
import { useLhClickOutside, useLhPopper } from '../../../composables/overlay'
import type { LhTreeSelectProps } from './types'

export interface LhTreeSelectEmits {
  /** Vue2 默认 v-model：input 事件 */
  (e: 'input', value: string | string[] | undefined): void
  (e: 'change', value: string | string[] | undefined): void
}

/**
 * TreeSelect 组件 Composable（复用 LhTree；纯逻辑在 @lh-ui/share/core/tree）
 *
 * Vue2 适配要点：
 * - v-model 走默认 value prop + input 事件
 * - 无 Teleport：面板 host 在 mounted 移到 body（teleported 时），卸载时移除
 */
export function useLhTreeSelect(props: LhTreeSelectProps, emit: LhTreeSelectEmits) {
  const rootRef = ref<HTMLElement | null>(null)
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  // 2.7 无 Teleport：host 根元素在 mounted 时移到 body，卸载时移除防泄漏
  const panelHostRef = ref<HTMLElement | null>(null)
  const isOpen = ref(false)
  const expandedKeys = ref<string[]>([])

  const { nextZIndex } = useLhZIndex()
  const zIndex = ref(nextZIndex())

  const { popperStyle, updatePosition } = useLhPopper({
    triggerRef,
    popperRef: panelRef,
    visible: isOpen,
    placement: 'bottom-start',
  })

  const selectedKeys = computed<string[]>(() => {
    // 多选模式的高亮完全由 checkedKeys 承担：此处再传同名数组会让节点同时挂上
    // --selected 与 --checked 两重复态
    if (props.multiple) return []
    if (props.value == null) return []
    return Array.isArray(props.value) ? props.value : [props.value]
  })

  const checkedKeys = computed<string[]>(() =>
    props.multiple && Array.isArray(props.value) ? props.value : [],
  )

  const displayText = computed(() => {
    // 多选模式的值在 checkedKeys 上（selectedKeys 已置空避免双重复态）
    const keys = props.multiple ? checkedKeys.value : selectedKeys.value
    if (keys.length === 0) return ''
    const labels = keys
      .map((key) => findTreeNode(props.data, key)?.label)
      .filter((label): label is string => !!label)
    return labels.join('、')
  })

  const placeholderText = computed(
    () => props.placeholder || t('select.placeholder', '请选择'),
  )

  const triggerLabel = computed(() => t('treeSelect.triggerLabel', '树选择'))

  const rootStyle = computed(() => sxToStyle(props.sx ?? {}))

  const panelStyle = computed(() => ({
    ...popperStyle.value,
    zIndex: String(zIndex.value),
  }))

  function toggleOpen(): void {
    if (props.disabled) return
    isOpen.value = !isOpen.value
    if (isOpen.value) zIndex.value = nextZIndex()
  }

  function close(): void {
    isOpen.value = false
  }

  function onSelectedChange(keys: string[]): void {
    if (props.multiple) return
    const value = keys.length > 0 ? keys[keys.length - 1] : undefined
    // 非叶子节点的首次点击只承担「展开/懒加载」职责：不选中、不关闭面板，
    // 否则点父节点即关闭面板，深层节点永远无法一次点达（已展开的父节点再次点击才选中）
    if (value != null) {
      const node = findTreeNode(props.data, value)
      if (node && !isTreeNodeLeaf(node) && !prevExpandedKeys.includes(value)) return
    }
    emit('input', value)
    emit('change', value)
    close()
  }

  function onCheckedChange(keys: string[]): void {
    if (!props.multiple) return
    emit('input', keys)
    emit('change', keys)
  }

  // 上一轮的展开键：树的 handleNodeClick 先 toggleExpand（同步 emit）再 toggleSelect，
  // onSelectedChange 据此区分本次点击是「展开手势」还是「选中手势」
  let prevExpandedKeys: string[] = []

  function onExpandedChange(keys: string[]): void {
    prevExpandedKeys = expandedKeys.value
    expandedKeys.value = keys
  }

  function handleTriggerKeydown(event: KeyboardEvent): void {
    if (isEscapeKey(event) && isOpen.value) {
      event.preventDefault()
      close()
    }
    if (isActivationKey(event)) {
      event.preventDefault()
      toggleOpen()
    }
  }

  function focusTrigger(): void {
    triggerRef.value?.focus()
  }

  useLhClickOutside(
    () => [rootRef.value, panelRef.value],
    () => {
      if (isOpen.value) close()
    },
  )

  watch(isOpen, (value) => {
    if (value) updatePosition()
    else focusTrigger()
  })

  function onDocumentKeydown(event: KeyboardEvent): void {
    if (isEscapeKey(event) && isOpen.value) close()
  }

  onMounted(() => {
    document.addEventListener('keydown', onDocumentKeydown)
    // Vue2 无 Teleport：teleported 时面板 host 移到 body
    if (props.teleported !== false) {
      const host = panelHostRef.value
      if (host && host.parentElement !== document.body) document.body.appendChild(host)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onDocumentKeydown)
    // host 被移出 $el 子树，卸载时主动移除防泄漏
    panelHostRef.value?.remove()
  })

  return {
    rootRef,
    triggerRef,
    panelRef,
    panelHostRef,
    isOpen,
    expandedKeys,
    selectedKeys,
    checkedKeys,
    displayText,
    placeholderText,
    triggerLabel,
    rootStyle,
    panelStyle,
    toggleOpen,
    close,
    onSelectedChange,
    onCheckedChange,
    onExpandedChange,
    handleTriggerKeydown,
  }
}
