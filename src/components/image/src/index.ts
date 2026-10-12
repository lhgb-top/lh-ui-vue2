import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  getImageClassNames,
  getViewerImageStyle,
  normalizePreviewList,
  stepRotate,
  stepViewerIndex,
  stepZoom,
} from '@lh-ui/share/core/image'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { isActivationKey, LH_KEYS } from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
import { useLhFocusTrap } from '../../../composables/overlay'
import type { LhImageProps, LhImageViewerProps } from './types'

export interface LhImageEmits {
  (e: 'load', event: Event): void
  (e: 'error', event: Event): void
}

export interface LhImageViewerEmits {
  (e: 'close'): void
  (e: 'switch', index: number): void
}

/**
 * Image 组件 Composable（类名/预览列表纯逻辑在 @lh-ui/share/core/image；文案走 locale 适配层）
 */
export function useLhImage(props: LhImageProps, emit: LhImageEmits) {
  const error = ref(false)
  const viewerVisible = ref(false)

  const previewList = computed(() => normalizePreviewList(props.src, props.previewSrcList))

  function handleLoad(event: Event): void {
    error.value = false
    emit('load', event)
  }

  function handleError(event: Event): void {
    error.value = true
    emit('error', event)
  }

  function openViewer(): void {
    if (props.preview) viewerVisible.value = true
  }

  /**
   * 预览入口的键盘语义：img 本身不可聚焦，preview 开启时承担 button 语义
   * （role/tabindex/aria-label 在模板侧按 preview 条件渲染），Enter/Space 等效点击
   */
  function onImageKeydown(event: KeyboardEvent): void {
    if (!props.preview || !isActivationKey(event)) return
    event.preventDefault()
    openViewer()
  }

  const previewLabel = computed(() => t('image.preview', '预览图片'))

  const imageClasses = computed(() =>
    getImageClassNames({
      fit: props.fit ?? 'cover',
      error: error.value,
      loaded: !error.value,
      preview: !!props.preview,
    }),
  )

  const imageStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    error,
    viewerVisible,
    previewList,
    previewLabel,
    handleLoad,
    handleError,
    openViewer,
    onImageKeydown,
    imageClasses,
    imageStyle,
  }
}

/**
 * ImageViewer 组件 Composable（缩放/旋转/切图纯逻辑在 @lh-ui/share/core/image）
 */
export function useLhImageViewer(props: LhImageViewerProps, emit: LhImageViewerEmits) {
  const rootRef = ref<HTMLElement | null>(null)
  const viewerRef = ref<HTMLElement | null>(null)
  const zoomLevel = ref(1)
  const rotateDeg = ref(0)
  const index = ref(props.initialIndex ?? 0)

  const { trap, release } = useLhFocusTrap()

  /**
   * Vue2 无 Teleport（红线 #4）：host 根元素在 mounted 时挂到 body，
   * 组件保持完整的响应式连接；销毁时主动移除防泄漏
   */
  onMounted(() => {
    const host = rootRef.value
    if (host && host.parentElement !== document.body) {
      document.body.appendChild(host)
    }
    viewerRef.value?.focus({ preventScroll: true })
    trap(viewerRef.value)
  })

  onBeforeUnmount(() => {
    release()
    rootRef.value?.remove()
  })

  const imageStyle = computed(() => ({
    ...getViewerImageStyle({
      zoom: zoomLevel.value,
      rotate: rotateDeg.value,
      index: index.value,
      total: props.images.length,
    }),
    ...sxToStyle(props.sx ?? {}),
  }))

  function zoom(direction: 1 | -1): void {
    zoomLevel.value = stepZoom(zoomLevel.value, direction)
  }

  function rotate(): void {
    rotateDeg.value = stepRotate(rotateDeg.value)
  }

  function go(delta: number): void {
    index.value = stepViewerIndex(index.value, props.images.length, delta)
    emit('switch', index.value)
  }

  function handleKeydown(event: KeyboardEvent): void {
    const actions: Record<string, () => void> = {
      [LH_KEYS.Escape]: () => emit('close'),
      [LH_KEYS.ArrowRight]: () => go(1),
      [LH_KEYS.ArrowLeft]: () => go(-1),
    }
    const action = actions[event.key]
    if (action) {
      event.preventDefault()
      action()
    }
  }

  return { rootRef, viewerRef, index, imageStyle, zoom, rotate, go, handleKeydown }
}
