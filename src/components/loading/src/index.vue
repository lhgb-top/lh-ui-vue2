<template>
  <div
    :class="loadingClasses"
    :style="maskStyle"
    role="status"
    aria-busy="true"
    :aria-label="maskText"
  >
    <LhSpinner
      v-if="spinner"
      size="medium"
      class="lh-loading__spinner"
    />
    <span
      v-if="maskText"
      class="lh-loading__text"
    >{{ maskText }}</span>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名
export default { name: 'LhLoadingMask' }
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PropType } from 'vue'
import { getLoadingClassNames } from '@lh-ui/share/core/loading'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import LhSpinner from '../../spinner'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：本组件 Props 就地声明
 */
const props = defineProps({
  fullscreen: { type: Boolean, default: false },
  text: { type: String, default: undefined },
  background: { type: String, default: undefined },
  zIndex: { type: Number, default: undefined },
  spinner: { type: Boolean, default: true },
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const loadingClasses = computed(() =>
  getLoadingClassNames({
    fullscreen: !!props.fullscreen,
    withText: !!maskText.value,
  }),
)

const maskText = computed(() => props.text ?? t('loading.text', '加载中…'))

const maskStyle = computed(() => ({
  background: props.background,
  zIndex: props.zIndex,
  ...sxToStyle(props.sx ?? {}),
}))
</script>
