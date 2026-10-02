import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { LhPopconfirmProps } from './types'
import { useLhConfigContext } from '../../config-provider/src/index'
import { useLhComponentTheme, useLhZIndex } from '../../../composables'
import {
  useLhFocusTrap,
  useLhPopper,
  useLhTrigger,
  useLhClickOutside,
} from '../../../composables/overlay'
import { generateId } from '@lh-ui/share/utils'
import { t } from '../../../locale'
import {
  DEFAULT_POPCONFIRM_PLACEMENT,
  DEFAULT_POPCONFIRM_TYPE,
  getPopconfirmClass,
  getPopconfirmIconName,
  getDefaultDelay,
} from '@lh-ui/share/core/popconfirm'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'

export interface LhPopconfirmEmits {
  /** 双向绑定走 .sync 语义（事件名 update:visible） */
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'show'): void
  (e: 'hide'): void
}

/**
 * Popconfirm Composable
 */
export function useLhPopconfirm(props: LhPopconfirmProps, emit: LhPopconfirmEmits) {
  const configContext = useLhConfigContext()
  const { componentStyle } = useLhComponentTheme('popconfirm', props, configContext)
  const { zIndex } = useLhZIndex()

  const popconfirmId = generateId('lh-popconfirm')
  const titleId = generateId('lh-popconfirm-title')
  const triggerRef = ref<HTMLElement | null>(null)
  const popperRef = ref<HTMLElement | null>(null)
  // 2.7 无 Teleport：host 根元素在 mounted 时移到 teleportTarget，卸载时移除防泄漏
  const popperHostRef = ref<HTMLElement | null>(null)
  const isVisible = ref(props.visible ?? false)

  const isControlled = computed(() => props.trigger === 'manual' && props.visible !== undefined)
  const confirmType = computed(() => props.type ?? DEFAULT_POPCONFIRM_TYPE)

  const { popperStyle, actualPlacement, updatePosition } = useLhPopper({
    triggerRef,
    popperRef,
    visible: isVisible,
    placement: computed(() => props.placement ?? DEFAULT_POPCONFIRM_PLACEMENT),
    // 触发器滚出视口时必须收起：fixed 弹层不会随触发器离开，会悬浮在页面内容之上。
    // 受控模式同样收起，hide() 会抛出 update:visible 让外部状态保持同步。
    onScrollOut: () => {
      hide()
    },
  })

  const {
    show,
    hide,
    toggle,
    onTriggerMouseenter,
    onTriggerMouseleave,
    onTriggerClick,
    onTriggerFocusin,
    onTriggerFocusout,
  } = useLhTrigger({
    trigger: computed(() => props.trigger ?? 'click'),
    visible: isVisible,
    disabled: computed(() => props.disabled),
    isControlled,
    delay: computed(() => getDefaultDelay(props.showAfter, props.hideAfter)),
    onShow: () => {
      emit('show')
      emit('update:visible', true)
    },
    onHide: () => {
      emit('hide')
      emit('update:visible', false)
    },
  })

  function onPopperMouseenter() {
    if (props.trigger === 'hover') show()
  }

  function onPopperMouseleave() {
    if (props.trigger === 'hover') hide()
  }

  const { trap, release } = useLhFocusTrap()

  watch(isVisible, (visible) => {
    if (visible) {
      // 打开时焦点落「确定」，Tab 在两按钮间循环，关闭后归还
      // 2.7 模板不支持函数 ref：确定按钮按类名查询（actions 区第二个按钮）
      nextTick(() => {
        const confirmEl =
          popperRef.value?.querySelector<HTMLElement>('.lh-popconfirm__actions button:nth-child(2)') ??
          null
        trap(popperRef.value, confirmEl)
      })
    } else {
      release()
    }
  })

  useLhClickOutside(
    () => [triggerRef.value, popperRef.value],
    () => {
      if (isVisible.value && !isControlled.value) hide()
    },
  )

  function onKeydown(event: KeyboardEvent) {
    if (!isVisible.value || isControlled.value) return
    // Esc = 取消（对齐 APG alertdialog：Escape 关闭并视为否定）
    if (event.key === 'Escape') handleCancel()
  }

  function handleConfirm() {
    emit('confirm')
    hide()
  }

  function handleCancel() {
    emit('cancel')
    hide()
  }

  watch(
    () => props.visible,
    (val) => {
      if (val !== undefined && val !== isVisible.value) isVisible.value = val
    },
  )

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    // host 被移出 $el 子树，卸载时主动移除防泄漏
    if (popperHostRef.value && popperHostRef.value.parentElement !== document.body) {
      document.body.appendChild(popperHostRef.value)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    release()
    popperHostRef.value?.remove()
  })

  const popperClass = computed(() =>
    getPopconfirmClass({
      type: confirmType.value,
      placement: actualPlacement.value,
      popperClass: props.popperClass,
    }),
  )

  const mergedPopperStyle = computed(() => ({
    ...popperStyle.value,
    ...componentStyle.value,
    zIndex: zIndex.value,
  }))

  const triggerStyle = computed(() => sxToStyle(props.sx ?? {}))

  const iconName = computed(() => getPopconfirmIconName(confirmType.value))

  const confirmLabel = computed(() => props.confirmText || t('popconfirm.confirm', '确定'))
  const cancelLabel = computed(() => props.cancelText || t('popconfirm.cancel', '取消'))

  return {
    popconfirmId,
    titleId,
    triggerRef,
    popperRef,
    popperHostRef,
    isVisible,
    popperClass,
    mergedPopperStyle,
    triggerStyle,
    iconName,
    confirmLabel,
    cancelLabel,
    show,
    hide,
    toggle,
    handleConfirm,
    handleCancel,
    onTriggerMouseenter,
    onTriggerMouseleave,
    onTriggerClick,
    onTriggerFocusin,
    onTriggerFocusout,
    onPopperMouseenter,
    onPopperMouseleave,
    updatePosition,
  }
}
