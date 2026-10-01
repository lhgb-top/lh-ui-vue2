<template>
  <span
    :class="avatarClasses"
    :style="avatarStyle"
    :role="avatarRole"
    :aria-label="avatarRole ? props.alt : undefined"
  >
    <img
      v-if="isImageSource(props.src) && !loadError"
      :src="props.src"
      :alt="props.alt || props.text || 'avatar'"
      :style="{ objectFit: props.fit }"
      class="lh-avatar__img"
      @error="handleError"
    />
    <i
      v-else-if="props.icon"
      :class="props.icon"
      class="lh-avatar__icon"
      aria-hidden="true"
    ></i>
    <span
      v-else-if="avatarText"
      class="lh-avatar__text"
    >
      {{ avatarText }}
    </span>
    <slot v-else></slot>
  </span>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhAvatar' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { isImageSource } from '@lh-ui/share/core/avatar'
import { useLhAvatar } from './index'
import type { LhAvatarProps, LhAvatarShape, LhAvatarSize } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  icon: { type: String, default: '' },
  text: { type: String, default: '' },
  shape: { type: String as PropType<LhAvatarShape>, default: 'circle' },
  size: { type: String as PropType<LhAvatarSize>, default: 'medium' },
  fit: { type: String as PropType<LhAvatarProps['fit']>, default: 'cover' },
  sx: { type: [Object, Array, String] as PropType<LhAvatarProps['sx']>, default: undefined },
})

const emit = defineEmits(['error'])

const { loadError, avatarClasses, avatarText, avatarStyle, avatarRole, handleError } = useLhAvatar(
  props,
  emit,
)
</script>
