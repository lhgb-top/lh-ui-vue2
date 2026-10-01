import { computed } from 'vue'
import { getTagClassNames } from '@lh-ui/share/core/tag'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import type { LhTagProps } from './types'

/**
 * Tag 组件 Composable（纯逻辑在 @lh-ui/share/core/tag）
 */
export function useLhTag(props: LhTagProps, emit: TagEmit) {
  // sx 快速布局属性：转内联样式作用于根元素
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const tagClasses = computed(() =>
    getTagClassNames({
      type: props.type ?? 'default',
      size: props.size ?? 'medium',
      closable: !!props.closable,
      disabled: !!props.disabled,
      round: !!props.round,
      hit: !!props.hit,
    }),
  )

  function handleClick(e: MouseEvent) {
    emit('click', e)
  }

  function handleClose(e: Event) {
    if (props.disabled) return
    props.onClose?.(e)
    emit('close', e)
  }

  return { sxStyle, tagClasses, handleClick, handleClose, t }
}

export interface TagEmit {
  (event: 'click', e: MouseEvent): void
  (event: 'close', e: Event): void
}
