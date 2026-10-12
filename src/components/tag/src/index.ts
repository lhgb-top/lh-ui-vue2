import { computed, getCurrentInstance } from 'vue'
import { getTagClassNames } from '@lh-ui/share/core/tag'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { isActivationKey } from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
import type { LhTagProps } from './types'

/**
 * Tag 组件 Composable（纯逻辑在 @lh-ui/share/core/tag）
 */
export function useLhTag(props: LhTagProps, emit: LhTagEmit) {
  const instance = getCurrentInstance()

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

  /**
   * 根元素是否承担 button 语义：仅当父组件绑定了 click 监听才可键盘激活，
   * 避免纯展示型 tag 进入 tab 序列（对齐 card 的 interactivity 判定思路）
   */
  const clickable = computed(() => {
    const proxy = instance?.proxy as { $listeners?: Record<string, unknown> } | undefined
    return !!proxy?.$listeners?.click && !props.disabled
  })

  function handleClick(e: MouseEvent) {
    emit('click', e)
  }

  /**
   * 键盘激活：Enter / Space 等效点击（仅 click 监听存在时生效）
   */
  function handleKeydown(e: KeyboardEvent) {
    if (!clickable.value || !isActivationKey(e)) return
    e.preventDefault()
    emit('click', e)
  }

  function handleClose(e: Event) {
    if (props.disabled) return
    props.onClose?.(e)
    emit('close', e)
  }

  return { sxStyle, tagClasses, clickable, handleClick, handleKeydown, handleClose, t }
}

export interface LhTagEmit {
  (event: 'click', e: Event): void
  (event: 'close', e: Event): void
}
