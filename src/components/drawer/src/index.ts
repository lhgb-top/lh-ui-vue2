import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { LhDrawerProps } from './types'
import { useLhConfigContext } from '../../config-provider/src/index'
import { useLhComponentTheme, useLhZIndex } from '../../../composables'
import { useLhFocusTrap } from '../../../composables/overlay'
import { generateId } from '@lh-ui/share/utils'
import { t } from '../../../locale'
import {
  DEFAULT_DRAWER_DIRECTION,
  DEFAULT_DRAWER_SIZE,
  getDrawerClass,
  getDrawerPanelStyle,
} from '@lh-ui/share/core/drawer'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'

export interface LhDrawerEmits {
  /** v-model：modelValue prop / input 事件 */
  (e: 'input', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}

/**
 * Drawer Composable
 */
export function useLhDrawer(props: LhDrawerProps, emit: LhDrawerEmits) {
  const configContext = useLhConfigContext()
  const { componentStyle } = useLhComponentTheme('drawer', props, configContext)
  const { zIndex } = useLhZIndex()

  const drawerId = generateId('lh-drawer')
  const titleId = generateId('lh-drawer-title')
  const panelRef = ref<HTMLElement | null>(null)
  const isVisible = ref(props.modelValue ?? false)

  const direction = computed(() => props.direction ?? DEFAULT_DRAWER_DIRECTION)

  const { trap, release } = useLhFocusTrap()

  let bodyOverflow = ''

  function lockScroll() {
    if (props.lockScroll === false) return
    if (typeof document === 'undefined') return
    bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  function unlockScroll() {
    if (props.lockScroll === false) return
    if (typeof document === 'undefined') return
    document.body.style.overflow = bodyOverflow || ''
  }

  /**
   * 打开
   */
  function open() {
    isVisible.value = true
    emit('input', true)
    emit('open')
    lockScroll()
    nextTick(() => trap(panelRef.value))
  }

  /**
   * 关闭
   */
  function close() {
    isVisible.value = false
    emit('input', false)
    emit('close')
    unlockScroll()
    release()
  }

  function handleMaskClick() {
    if (props.maskClosable !== false) close()
  }

  /**
   * Esc 关闭
   */
  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isVisible.value && props.closeOnEsc !== false) {
      close()
    }
  }

  // 同步外部 modelValue
  watch(
    () => props.modelValue,
    (val) => {
      if (val === undefined) return
      if (val && !isVisible.value) open()
      else if (!val && isVisible.value) close()
    },
  )

  onMounted(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', onKeydown)
    }
    if (isVisible.value) {
      // 初始即打开：补上滚动锁定与焦点圈
      lockScroll()
      nextTick(() => trap(panelRef.value))
    }
  })

  onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', onKeydown)
    }
    unlockScroll()
    release()
  })

  const drawerClass = computed(() => getDrawerClass({ direction: direction.value }))

  const panelStyle = computed(() => ({
    ...componentStyle.value,
    ...getDrawerPanelStyle(direction.value, props.size ?? DEFAULT_DRAWER_SIZE),
    ...sxToStyle(props.sx ?? {}),
  }))

  const rootStyle = computed(() => ({ zIndex: zIndex.value }))

  const closeLabel = computed(() => t('drawer.close', '关闭抽屉'))
  const defaultTitle = computed(() => t('drawer.title', '抽屉'))

  return {
    drawerId,
    titleId,
    panelRef,
    isVisible,
    drawerClass,
    panelStyle,
    rootStyle,
    closeLabel,
    defaultTitle,
    open,
    close,
    handleMaskClick,
  }
}
