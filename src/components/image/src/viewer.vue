<template>
  <!--
    Vue2 无 Teleport（红线 #4）：host 根元素在 mounted 时移到 body（见 viewer.ts），
    内层才是真正的预览器面板
  -->
  <div
    ref="rootRef"
    class="lh-image-viewer__host"
  >
    <div
      ref="viewerRef"
      class="lh-image-viewer"
      role="dialog"
      aria-modal="true"
      :aria-label="t('image.preview', '预览图片')"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <div class="lh-image-viewer__canvas">
        <img
          :src="images[index]"
          class="lh-image-viewer__img"
          :alt="images[index]"
          :style="imageStyle"
        />
      </div>
      <div class="lh-image-viewer__toolbar">
        <button
          type="button"
          class="lh-image-viewer__tool"
          :aria-label="t('image.zoomOut', '缩小')"
          @click="zoom(-1)"
        >−</button>
        <button
          type="button"
          class="lh-image-viewer__tool"
          :aria-label="t('image.zoomIn', '放大')"
          @click="zoom(1)"
        >＋</button>
        <button
          type="button"
          class="lh-image-viewer__tool"
          :aria-label="t('image.rotate', '旋转')"
          @click="rotate"
        >⟳</button>
      </div>
      <button
        v-if="images.length > 1"
        type="button"
        class="lh-image-viewer__nav lh-image-viewer__nav--prev"
        :aria-label="t('image.prev', '上一张')"
        @click="go(-1)"
      >‹</button>
      <button
        v-if="images.length > 1"
        type="button"
        class="lh-image-viewer__nav lh-image-viewer__nav--next"
        :aria-label="t('image.next', '下一张')"
        @click="go(1)"
      >›</button>
      <button
        type="button"
        class="lh-image-viewer__close"
        :aria-label="t('image.close', '关闭图片预览')"
        @click="emit('close')"
      >✕</button>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhImageViewer' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhImageViewer } from './index'
import { t } from '../../../locale'
import type { LhImageViewerProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  images: { type: Array as PropType<string[]>, required: true },
  initialIndex: { type: Number, default: 0 },
  sx: { type: [Object, Array, String] as PropType<LhImageViewerProps['sx']>, default: undefined },
})

const emit = defineEmits(['close', 'switch'])

const { rootRef, viewerRef, index, imageStyle, zoom, rotate, go, handleKeydown } =
  useLhImageViewer(props, emit)
</script>
