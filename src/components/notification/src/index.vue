<template>
  <div
    :class="notificationClasses"
    :style="notificationStyle"
    :role="onClick ? 'button' : undefined"
    :tabindex="onClick ? 0 : undefined"
    @click="handleClick"
    @keydown.enter.prevent="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <LhIcon
      :name="iconName"
      class="lh-notification__icon"
    />
    <div class="lh-notification__body">
      <span class="lh-notification__title">{{ title }}</span>
      <p
        v-if="content"
        class="lh-notification__content"
      >
        {{ content }}
      </p>
    </div>
    <button
      v-if="showClose"
      type="button"
      class="lh-notification__close"
      :aria-label="closeLabel || t('notification.close', '关闭通知')"
      @click.stop="emit('close')"
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名
export default { name: 'LhNotificationItem' }
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PropType } from 'vue'
import { getNotificationClassNames, getNotificationIconName } from '@lh-ui/share/core/notification'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { SxProps } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import LhIcon from '../../icon'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：本组件 Props 就地声明
 */
const props = defineProps({
  type: {
    type: String as PropType<'info' | 'success' | 'warning' | 'danger'>,
    default: 'info',
  },
  title: { type: String, required: true },
  content: { type: String, default: undefined },
  showClose: { type: Boolean, default: true },
  closeLabel: { type: String, default: undefined },
  onClick: { type: Function as PropType<() => void>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<SxProps>, default: undefined },
})

const emit = defineEmits(['close'])

const notificationClasses = computed(() =>
  getNotificationClassNames({
    type: props.type,
    showClose: !!props.showClose,
    clickable: !!props.onClick,
  }),
)

const notificationStyle = computed(() => sxToStyle(props.sx ?? {}))

const iconName = computed(() => getNotificationIconName(props.type))

function handleClick(): void {
  props.onClick?.()
}
</script>
