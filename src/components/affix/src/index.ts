import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getAffixClassNames, getAffixFixedStyle, isAffixFixed } from '@lh-ui/share/core/affix'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import type { LhAffixProps } from './types'

export interface LhAffixEmits {
  /** 固定态翻转时抛出（吸顶 true / 取消 false） */
  (e: 'change', fixed: boolean): void
}

/**
 * Affix 组件 Composable（吸顶判定纯逻辑在 @lh-ui/share/core/affix）
 *
 * IntersectionObserver 检测占位越界；jsdom 等无 IO 环境回退 scroll 监听
 */
export function useLhAffix(props: LhAffixProps, emit: LhAffixEmits) {
  const placeholderRef = ref<HTMLElement | null>(null)
  const fixed = ref(false)

  // Vue2.7 运行时 props 不经默认值收窄 undefined：调用 share 纯函数前兜底（红线 #10）
  const offsetTop = computed(() => props.offsetTop ?? 0)
  const offsetBottom = computed(() => props.offsetBottom ?? 0)

  function resolveTarget(): HTMLElement | null {
    const target = props.target
    if (!target) return null
    if (typeof target === 'string') {
      return document.querySelector<HTMLElement>(target)
    }
    return target
  }

  function updateFixed(): void {
    const el = placeholderRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = isAffixFixed(
      { top: rect.top, bottom: rect.bottom },
      offsetTop.value,
      offsetBottom.value,
      window.innerHeight,
    )
    if (next !== fixed.value) {
      fixed.value = next
      emit('change', next)
    }
  }

  let observer: IntersectionObserver | null = null
  let scrollTarget: HTMLElement | null = null

  function attachListeners(): void {
    const el = placeholderRef.value
    if (!el) return
    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(() => updateFixed(), { threshold: 0 })
      observer.observe(el)
    }
    scrollTarget = resolveTarget()
    const listenerTarget: HTMLElement | Window = scrollTarget ?? window
    listenerTarget.addEventListener('scroll', updateFixed, { passive: true })
    window.addEventListener('resize', updateFixed)
    updateFixed()
  }

  function detachListeners(): void {
    observer?.disconnect()
    observer = null
    const listenerTarget: HTMLElement | Window | null = scrollTarget ?? window
    listenerTarget?.removeEventListener('scroll', updateFixed)
    window.removeEventListener('resize', updateFixed)
  }

  onMounted(attachListeners)

  onBeforeUnmount(detachListeners)

  // target 变化（如父级 ref 在 mounted 后才赋值，:target="$refs.x" 场景）：
  // 先按旧目标解绑，再重新解析并换绑，保证运行时切容器立即生效
  watch(() => props.target, () => {
    detachListeners()
    attachListeners()
  })

  const affixClasses = computed(() => getAffixClassNames({ fixed: fixed.value }))

  const affixStyle = computed(() => {
    if (!fixed.value) return sxToStyle(props.sx ?? {})
    return {
      ...getAffixFixedStyle(offsetTop.value, offsetBottom.value),
      zIndex: `var(--lh-affix-z-index, 900)`,
      width: placeholderRef.value ? `${placeholderRef.value.offsetWidth}px` : 'auto',
      ...sxToStyle(props.sx ?? {}),
    }
  })

  const placeholderStyle = computed(() =>
    fixed.value ? { height: `${placeholderRef.value?.offsetHeight ?? 0}px` } : undefined,
  )

  return { placeholderRef, affixClasses, affixStyle, placeholderStyle }
}
