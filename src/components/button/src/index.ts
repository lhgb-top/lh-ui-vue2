import { computed } from 'vue'
import type { LhButtonProps } from './types'
import { useLhConfigContext } from '../../config-provider/src'
import { isClickable, getSize } from '@lh-ui/share/core/button'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { useLhComponentTheme } from '../../../composables'

/**
 * Button 组件 Composable
 * 整合 ConfigProvider 配置、事件处理与样式计算（纯逻辑在 @lh-ui/share/core/button）
 */
export function useLhButton(props: LhButtonProps, emit: (event: 'click', e: MouseEvent) => void) {
  // 从 ConfigProvider 获取全局配置
  const configContext = useLhConfigContext()

  // 有效的尺寸（props > ConfigProvider > 默认值）
  const effectiveSize = computed(() => {
    return getSize(props.size, configContext?.value.size)
  })

  /** 点击事件处理（loading/disabled 时不可点击） */
  const handleClick = (e: MouseEvent) => {
    if (isClickable({ loading: props.loading, disabled: props.disabled })) {
      emit('click', e)
    }
  }

  /**
   * 计算组件主题样式
   * 优先级: 组件自身 props > ConfigProvider componentTheme[组件名] > ConfigProvider 全局 themeVars
   * sx 样式合并到最后（最高优先级）
   */
  const { componentStyle } = useLhComponentTheme('button', props, configContext)
  const buttonStyle = computed(() => ({
    ...componentStyle.value,
    ...sxToStyle(props.sx ?? {}),
  }))

  return {
    handleClick,
    buttonStyle,
    effectiveSize,
    configContext,
  }
}
