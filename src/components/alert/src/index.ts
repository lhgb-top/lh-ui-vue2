import { computed, ref, useSlots } from 'vue'
import { getAlertClassNames, getAlertRole, getAlertIconName } from '@lh-ui/share/core/alert'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhAlertProps } from './types'

export interface LhAlertEmits {
  (e: 'close'): void
}

/**
 * Alert 组件 Composable（纯逻辑在 @lh-ui/share/core/alert；文案走 locale 适配层）
 */
export function useLhAlert(props: LhAlertProps, emit: LhAlertEmits) {
  const slots = useSlots()

  const visible = ref(true)

  const hasTitle = computed(() => !!props.title || !!slots.title)

  const alertClasses = computed(() =>
    getAlertClassNames({
      type: props.type ?? 'info',
      closable: !!props.closable,
      showIcon: !!props.showIcon,
      plain: !!props.plain,
      withTitle: hasTitle.value,
    }),
  )

  // warning/danger 立即播报（role=alert），info/success 温和播报（role=status）
  const alertRole = computed(() => getAlertRole(props.type ?? 'info'))

  const iconName = computed(() => getAlertIconName(props.type ?? 'info'))

  const alertStyle = computed(() => sxToStyle(props.sx ?? {}))

  function handleClose() {
    visible.value = false
    emit('close')
  }

  return { visible, alertClasses, alertRole, iconName, alertStyle, handleClose }
}
