import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  LH_BACKTOP_SCROLLEND_DELAY,
  backToTop,
  getBackTopClassNames,
  getScrollTop,
  isBackTopVisible,
  resolveScrollTarget,
  supportsScrollEnd,
} from '@lh-ui/share/core/backtop'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import type { LhBackTopProps } from './types'

export interface LhBackTopEmits {
  (e: 'click', event: MouseEvent): void
  /** 滚动停止：携带当前滚动距离抛出（锚点联动 / 数据懒加载等场景消费） */
  (e: 'scrollend', scrollTop: number): void
}

/**
 * 滚动停止回调（vue2 composables 未含此基建，从 plus utils 平价内联移植）：
 * 支持原生 scrollend 的环境直接挂原生事件；否则退回 scroll + 固定阈值防抖
 */
function useLhScrollEnd(
  getTarget: () => HTMLElement | Window | null,
  handler: () => void,
  delay: number = LH_BACKTOP_SCROLLEND_DELAY,
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  function debounced(): void {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      handler()
    }, delay)
  }

  function clear(): void {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  onMounted(() => {
    const target = getTarget()
    if (!target) return
    if (supportsScrollEnd(target)) {
      target.addEventListener('scrollend', handler, { passive: true })
    } else {
      target.addEventListener('scroll', debounced, { passive: true })
    }
  })

  onBeforeUnmount(() => {
    const target = getTarget()
    if (target) {
      if (supportsScrollEnd(target)) target.removeEventListener('scrollend', handler)
      else target.removeEventListener('scroll', debounced)
    }
    clear()
  })

  return { clear }
}

/**
 * BackTop 组件 Composable（可见性/回顶纯逻辑在 @lh-ui/share/core/backtop；文案走 locale 适配层）
 */
export function useLhBackTop(props: LhBackTopProps, emit: LhBackTopEmits) {
  const visible = ref(false)

  // setup 阶段解析滚动目标（SSR 无 window 时不解析），
  // 保证 scrollend composable 挂载时 getTarget 已有值
  let scrollTarget: HTMLElement | Window | null = null
  if (typeof window !== 'undefined') {
    scrollTarget = resolveScrollTarget(props.target)
  }

  function handleScroll(): void {
    if (!scrollTarget) return
    visible.value = isBackTopVisible(getScrollTop(scrollTarget), props.visibilityHeight ?? 200)
  }

  function handleScrollEnd(): void {
    if (!scrollTarget) return
    emit('scrollend', getScrollTop(scrollTarget))
  }

  // 滚动停止事件：原生 scrollend 优先，旧浏览器退回 scroll + 防抖
  useLhScrollEnd(() => scrollTarget, handleScrollEnd)

  function handleClick(event: MouseEvent): void {
    emit('click', event)
    if (scrollTarget) backToTop(scrollTarget, props.smooth !== false)
  }

  onMounted(() => {
    const listenerTarget: HTMLElement | Window | null = scrollTarget
    if (!listenerTarget) return
    listenerTarget.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onBeforeUnmount(() => {
    const listenerTarget: HTMLElement | Window | null = scrollTarget
    listenerTarget?.removeEventListener('scroll', handleScroll)
  })

  const backTopClasses = computed(() => getBackTopClassNames({ visible: visible.value }))

  const backTopStyle = computed(() => ({
    right: `${props.right ?? 40}px`,
    bottom: `${props.bottom ?? 40}px`,
    ...sxToStyle(props.sx ?? {}),
  }))

  /** 文案（locale 适配层已内置响应式依赖） */
  const ariaLabel = computed(() => t('backtop.label', '返回顶部'))

  return { visible, handleClick, backTopClasses, backTopStyle, ariaLabel }
}
