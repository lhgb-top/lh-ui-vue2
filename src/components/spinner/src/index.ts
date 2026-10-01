import { computed } from 'vue'
import { getSpinnerClassNames, LH_SPINNER_SIZE_PX } from '@lh-ui/share/core/spinner'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhSpinnerProps } from './types'

/**
 * Spinner 组件 Composable（纯逻辑在 @lh-ui/share/core/spinner）
 */
export function useLhSpinner(props: LhSpinnerProps) {
  const spinnerClasses = computed(() => getSpinnerClassNames({ size: props.size ?? 'medium' }))

  const diameter = computed(() => LH_SPINNER_SIZE_PX[props.size ?? 'medium'])

  const spinnerStyle = computed(() => ({
    width: `${diameter.value}px`,
    height: `${diameter.value}px`,
    color: props.color,
    ...sxToStyle(props.sx ?? {}),
  }))

  return { spinnerClasses, diameter, spinnerStyle }
}
