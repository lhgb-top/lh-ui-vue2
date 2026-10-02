import { computed, inject, onBeforeUnmount, provide, reactive, ref } from 'vue'
import {
  getTimelineClassNames,
  getTimelineItemClassNames,
  getTimelineSide,
} from '@lh-ui/share/core/timeline'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_TIMELINE_CONTEXT_KEY } from './types'
import type { LhTimelineItemProps, LhTimelineProps } from './types'

/**
 * Timeline 组件 Composable（纯逻辑在 @lh-ui/share/core/timeline）
 */
export function useLhTimeline(props: LhTimelineProps) {
  const tokens = reactive<object[]>([])

  provide(LH_TIMELINE_CONTEXT_KEY, {
    mode: computed(() => props.mode ?? 'left'),
    tokens,
    register: (token) => tokens.push(token),
    unregister: (token) => {
      const index = tokens.indexOf(token)
      if (index !== -1) tokens.splice(index, 1)
    },
  })

  const timelineClasses = computed(() => getTimelineClassNames(props.mode ?? 'left'))

  const timelineStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { timelineClasses, timelineStyle }
}

/**
 * TimelineItem 组件 Composable
 */
export function useLhTimelineItem(props: LhTimelineItemProps) {
  const context = inject(LH_TIMELINE_CONTEXT_KEY, null)
  // 脱离 LhTimeline 单用兜底：按 left 模式、视为唯一节点渲染
  const token = ref({})
  context?.register(token.value)
  onBeforeUnmount(() => context?.unregister(token.value))

  const index = computed(() => (context ? context.tokens.indexOf(token.value) : 0))
  const isLast = computed(() => (context ? index.value === context.tokens.length - 1 : true))
  const side = computed(() =>
    context?.mode.value === 'alternate' ? getTimelineSide(index.value) : 'left',
  )

  const itemClasses = computed(() =>
    getTimelineItemClassNames({
      type: props.type,
      hollow: !!props.hollow,
      side: side.value,
      isLast: isLast.value,
    }),
  )

  const itemStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { itemClasses, itemStyle }
}
