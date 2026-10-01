import { computed } from 'vue'
import type { LhIconProps } from './types'
import { useLhConfigContext } from '../../config-provider/src'
import { useLhComponentTheme } from '../../../composables'
import { getIconSvg, getIconStyle, getIconSize } from '@lh-ui/share/core/icon'

/**
 * Icon 组件 Composable（纯逻辑在 @lh-ui/share/core/icon）
 */
export function useLhIcon(props: LhIconProps) {
  const configContext = useLhConfigContext()
  const svgPath = computed(() => getIconSvg(props.name))
  const iconStyle = computed(() => getIconStyle({ size: props.size, color: props.color }))
  const iconSize = computed(() => getIconSize(props.size))
  const { componentStyle } = useLhComponentTheme('icon', props, configContext)

  return { svgPath, iconStyle, iconSize, componentStyle }
}
