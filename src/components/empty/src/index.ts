import { computed } from 'vue'
import { getEmptyClassNames } from '@lh-ui/share/core/empty'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import type { LhEmptyProps } from './types'

/**
 * Empty 组件 Composable（纯逻辑在 @lh-ui/share/core/empty；文案走 locale 适配层）
 */
export function useLhEmpty(props: LhEmptyProps) {
  const emptyClasses = computed(() => getEmptyClassNames({ hasImage: !!props.image }))

  const emptyStyle = computed(() => sxToStyle(props.sx ?? {}))

  const description = computed(() => props.description || t('empty.description', '暂无数据'))

  return { emptyClasses, emptyStyle, description }
}
