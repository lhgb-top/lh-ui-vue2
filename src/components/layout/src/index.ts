import { computed, inject, onBeforeUnmount, onMounted, provide, ref, type Ref } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_LAYOUT_KEY } from './types'
import type { LhLayoutContext, LhLayoutAsideProps, LhLayoutProps, LhLayoutSectionProps } from './types'

/**
 * Layout 组件 Composable（样式排版在组件层即可表达，无需 share 纯逻辑）
 * provide 的 LH_LAYOUT_KEY 供 Aside 子组件登记；方向判定：
 *   显式 direction 一票定夺；未显式时按内容自动判定（槽位含 Header/Footer
 *   ——组件层探测传入——或直接子级 Aside 登记 → 纵向）
 */
export function useLhLayout(props: LhLayoutProps, hasHeaderFooter?: Ref<boolean>) {
  // 登记计数：多 Aside 布局卸载其中一个时，只要还有一个在就不能切回 horizontal
  const asideCount = ref(0)

  provide(LH_LAYOUT_KEY, {
    registerAside: () => {
      asideCount.value += 1
    },
    unregisterAside: () => {
      asideCount.value = Math.max(asideCount.value - 1, 0)
    },
  } satisfies LhLayoutContext)

  const layoutClasses = computed(() => {
    const vertical =
      props.direction != null
        ? props.direction === 'vertical'
        : asideCount.value > 0 || !!hasHeaderFooter?.value
    return ['lh-layout', vertical ? 'lh-layout--vertical' : 'lh-layout--horizontal']
  })

  const layoutStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { layoutClasses, layoutStyle }
}

/** Header / Main / Footer 共用 Composable：仅转发 sx 为内联样式 */
export function useLhLayoutSection(props: LhLayoutSectionProps) {
  const sectionStyle = computed(() => sxToStyle(props.sx ?? {}))
  return { sectionStyle }
}

/**
 * Aside Composable：挂载后向父级 Layout 登记（父级切换为 vertical），
 * 卸载时注销（2.7 用 onBeforeUnmount 替代 onUnmounted，红线 #8）
 */
export function useLhLayoutAside(props: LhLayoutAsideProps) {
  const context = inject(LH_LAYOUT_KEY, null) as LhLayoutContext | null

  onMounted(() => context?.registerAside())
  onBeforeUnmount(() => context?.unregisterAside())

  const asideStyle = computed(() => {
    const style: Record<string, string> = { ...sxToStyle(props.sx ?? {}) }
    if (props.width != null) {
      style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    }
    return style
  })

  return { asideStyle, context }
}
