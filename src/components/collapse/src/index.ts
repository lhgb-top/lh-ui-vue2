import { computed, provide, ref } from 'vue'
import { normalizeActiveKeys, toggleCollapseKey } from '@lh-ui/share/core/collapse'
import type { LhCollapseKey } from '@lh-ui/share/core/collapse'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_COLLAPSE_CONTEXT_KEY } from './types'
import type { LhCollapseProps } from './types'

export interface LhCollapseEmits {
  /** v-model：modelValue prop / input 事件（受控时始终抛数组） */
  (e: 'input', value: LhCollapseKey[]): void
  /** 非受控切换：手风琴抛单值（可能 undefined），普通模式抛数组快照 */
  (e: 'change', value: LhCollapseKey | LhCollapseKey[] | undefined): void
}

/**
 * Collapse 组件 Composable（纯逻辑在 @lh-ui/share/core/collapse）
 */
export function useLhCollapse(props: LhCollapseProps, emit: LhCollapseEmits) {
  const activeKeys = ref<LhCollapseKey[]>(normalizeActiveKeys(props.modelValue))

  function toggle(key: LhCollapseKey): void {
    if (props.modelValue !== undefined) {
      // 受控：仅抛出，内部不落值
      emit('input', toggleCollapseKey(normalizeActiveKeys(props.modelValue), key, !!props.accordion))
      return
    }
    activeKeys.value = toggleCollapseKey(activeKeys.value, key, !!props.accordion)
    emit('change', props.accordion ? activeKeys.value[0] : [...activeKeys.value])
  }

  // 红线 #6：provide 的是 ref 本体，Item 侧读 .value 保持响应式
  provide(LH_COLLAPSE_CONTEXT_KEY, {
    activeKeys,
    accordion: props.accordion,
    toggle,
  })

  const collapseClasses = computed(() => {
    const classes = ['lh-collapse']
    if (props.accordion) classes.push('lh-collapse--accordion')
    return classes
  })

  const collapseStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { activeKeys, collapseClasses, collapseStyle }
}
