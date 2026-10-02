<template>
  <div
    :class="messageClasses"
    :style="messageStyle"
    :role="role"
    :aria-live="live"
  >
    <LhSpinner
      v-if="type === 'loading'"
      size="small"
      class="lh-message__icon"
    />
    <LhIcon
      v-else-if="iconName"
      :name="iconName"
      class="lh-message__icon"
    />
    <span class="lh-message__content">{{ content }}</span>
    <button
      v-if="showClose"
      type="button"
      class="lh-message__close"
      :aria-label="closeLabel || t('message.close', '关闭提示')"
      @click="emit('close')"
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
export default { name: 'LhMessageItem' }
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PropType } from 'vue'
import { getMessageClassNames, getMessageIconName, getMessageRole } from '@lh-ui/share/core/message'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { SxProps } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import LhIcon from '../../icon'
import LhSpinner from '../../spinner'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：本组件 Props 就地声明
 */
const props = defineProps({
  content: { type: String, required: true },
  type: { type: String as PropType<'info' | 'success' | 'warning' | 'danger' | 'loading'>, default: 'info' },
  showClose: { type: Boolean, default: false },
  closeLabel: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<SxProps>, default: undefined },
})

const emit = defineEmits(['close'])

const messageClasses = computed(() =>
  getMessageClassNames({ type: props.type, showClose: !!props.showClose }),
)

const messageStyle = computed(() => sxToStyle(props.sx ?? {}))

const role = computed(() => getMessageRole(props.type))

// role=status/alert 本身携带 live region 语义，aria-live 显式补齐提示行为
const live = computed(() => (role.value === 'alert' ? 'assertive' : 'polite'))

const iconName = computed(() => getMessageIconName(props.type))
</script>
