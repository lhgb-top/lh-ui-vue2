import { computed, ref } from 'vue'
import { getAvatarClassNames, getAvatarText, isImageSource } from '@lh-ui/share/core/avatar'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhAvatarProps } from './types'

export interface LhAvatarEmits {
  (e: 'error', event: Event): void
}

/**
 * Avatar 组件 Composable（纯逻辑在 @lh-ui/share/core/avatar）
 */
export function useLhAvatar(props: LhAvatarProps, emit: LhAvatarEmits) {
  const loadError = ref(false)

  const avatarClasses = computed(() =>
    getAvatarClassNames({
      size: props.size ?? 'medium',
      shape: props.shape ?? 'circle',
    }),
  )

  const avatarText = computed(() => getAvatarText(props.text ?? ''))

  const avatarStyle = computed(() => sxToStyle(props.sx ?? {}))

  // 图片分支由 <img alt> 自身命名；图标/文字分支由 alt 提供无障碍名称
  const avatarRole = computed(() =>
    isImageSource(props.src) && !loadError.value ? undefined : 'img',
  )

  function handleError(e: Event) {
    loadError.value = true
    emit('error', e)
  }

  return { loadError, avatarClasses, avatarText, avatarStyle, avatarRole, handleError }
}
