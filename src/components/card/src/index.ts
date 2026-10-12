import { computed } from 'vue'
import type { LhCardProps } from './types'
import { useLhConfigContext } from '../../config-provider/src/index'
import { getCardClassNames, getCardInteractivity, isCardInteractive } from '@lh-ui/share/core/card'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { isActivationKey } from '@lh-ui/share/core/shared/keyboard'
import { useLhComponentTheme } from '../../../composables'

/**
 * Card 组件 Composable
 * 整合 ConfigProvider 配置、键盘语义与样式计算
 */
export function useLhCard(props: LhCardProps) {
  const configContext = useLhConfigContext()

  const cardClasses = computed(() =>
    getCardClassNames({
      shadow: props.shadow ?? 'always',
      clickable: !!props.clickable,
      loading: !!props.loading,
    }),
  )

  /**
   * 计算组件主题样式（组件 props > componentTheme > 全局 themeVars）
   * sx 样式合并到最后（最高优先级）
   */
  const { componentStyle } = useLhComponentTheme('card', props, configContext)
  const cardStyle = computed(() => ({
    ...componentStyle.value,
    ...sxToStyle(props.sx ?? {}),
  }))

  /** 可交互卡的键盘语义（对齐 APG button pattern） */
  const interactivity = computed(() =>
    getCardInteractivity({
      shadow: props.shadow ?? 'always',
      clickable: !!props.clickable,
      loading: !!props.loading,
    }),
  )

  /** 整卡键盘激活（Enter / Space） */
  const onCardKeydown = (e: KeyboardEvent, emit: (event: 'click', e: Event) => void) => {
    if (
      !isCardInteractive({
        shadow: props.shadow ?? 'always',
        clickable: !!props.clickable,
        loading: !!props.loading,
      })
    ) {
      return
    }
    if (isActivationKey(e)) {
      e.preventDefault()
      emit('click', e)
    }
  }

  return {
    configContext,
    cardClasses,
    cardStyle,
    interactivity,
    onCardKeydown,
  }
}
