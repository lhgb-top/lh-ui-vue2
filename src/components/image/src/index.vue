<template>
  <span
    :class="imageClasses"
    :style="imageStyle"
  >
    <img
      v-if="!error"
      :src="props.src"
      :alt="props.alt"
      class="lh-image__inner"
      :class="`lh-image__inner--${props.fit ?? 'cover'}`"
      :loading="props.lazy ? 'lazy' : undefined"
      decoding="async"
      @load="handleLoad"
      @error="handleError"
      @click="openViewer"
    />
    <span
      v-else
      class="lh-image__error"
    >
      <slot name="error">{{ t('image.error', '加载失败') }}</slot>
    </span>
    <!-- 预览器自身是 host-to-body 组件（挂载后移到 body），此处内联挂载即可 -->
    <LhImageViewer
      v-if="viewerVisible"
      :images="previewList"
      :initial-index="0"
      @close="viewerVisible = false"
    />
  </span>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhImage' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import LhImageViewer from './viewer.vue'
import { useLhImage } from './index'
import { t } from '../../../locale'
import type { LhImageFit } from '@lh-ui/share/core/image'
import type { LhImageProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  fit: { type: String as PropType<LhImageFit>, default: 'cover' },
  preview: { type: Boolean, default: false },
  previewSrcList: { type: Array as PropType<string[]>, default: undefined },
  lazy: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhImageProps['sx']>, default: undefined },
})

const emit = defineEmits(['load', 'error'])

const {
  error,
  viewerVisible,
  previewList,
  handleLoad,
  handleError,
  openViewer,
  imageClasses,
  imageStyle,
} = useLhImage(props, emit)
</script>
