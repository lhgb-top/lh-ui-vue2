import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  flattenAnchorItems,
  getAnchorClassNames,
  getAnchorLinkClassNames,
  resolveActiveAnchor,
} from '@lh-ui/share/core/anchor'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import type { LhAnchorProps } from './types'

export interface LhAnchorEmits {
  /** 当前激活锚点变化 */
  (e: 'change', id: string): void
  (e: 'click', event: MouseEvent, id: string): void
}

/**
 * Anchor 组件 Composable（扁平化/联动判定纯逻辑在 @lh-ui/share/core/anchor）
 */
export function useLhAnchor(props: LhAnchorProps, emit: LhAnchorEmits) {
  const flatItems = computed(() => flattenAnchorItems(props.items))
  const activeId = ref(flatItems.value[0]?.id ?? '')

  function resolveScrollTarget(): HTMLElement | Window {
    const target = props.target
    if (!target) return window
    if (typeof target === 'string') {
      return document.querySelector<HTMLElement>(target) ?? window
    }
    return target
  }

  /** 各锚点相对滚动容器视口顶部的偏移（文档顺序） */
  function measureOffsets(): { ids: string[]; offsets: number[] } {
    const ids: string[] = []
    const offsets: number[] = []
    for (const item of flatItems.value) {
      const el = document.getElementById(item.id)
      if (!el) continue
      ids.push(item.id)
      offsets.push(el.getBoundingClientRect().top)
    }
    return { ids, offsets }
  }

  function updateActive(): void {
    const { ids, offsets } = measureOffsets()
    if (ids.length === 0) return
    const threshold = props.offset ?? 0
    const next = resolveActiveAnchor(ids, offsets, threshold)
    if (next && next !== activeId.value) {
      activeId.value = next
      emit('change', next)
    }
  }

  let scrollTarget: HTMLElement | Window | null = null

  function onScroll(): void {
    updateActive()
  }

  function prefersReducedMotion(): boolean {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }

  function scrollToAnchor(id: string): void {
    const el = document.getElementById(id)
    if (!el) return
    activeId.value = id
    emit('change', id)
    el.scrollIntoView({
      behavior: (props.smooth ?? true) && !prefersReducedMotion() ? 'smooth' : 'auto',
      block: 'start',
    })
  }

  onMounted(() => {
    scrollTarget = resolveScrollTarget()
    scrollTarget.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    updateActive()
  })

  onBeforeUnmount(() => {
    scrollTarget?.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  function linkClasses(id: string, level: number): string[] {
    return getAnchorLinkClassNames({ active: activeId.value === id, level })
  }

  const anchorClasses = computed(() => getAnchorClassNames({ direction: props.direction ?? 'vertical' }))

  const anchorStyle = computed(() => sxToStyle(props.sx ?? {}))

  /** 文案（locale 适配层已内置响应式依赖） */
  const ariaLabel = computed(() => t('anchor.label', '锚点导航'))

  return {
    flatItems,
    activeId,
    linkClasses,
    anchorClasses,
    anchorStyle,
    ariaLabel,
    scrollToAnchor,
  }
}
