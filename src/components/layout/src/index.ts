import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_LAYOUT_KEY } from './types'
import type { LhLayoutContext, LhLayoutAsideProps, LhLayoutProps, LhLayoutSectionProps } from './types'

/**
 * Layout 组件 Composable（样式排版在组件层即可表达，无需 share 纯逻辑）
 * provide 的 LH_LAYOUT_KEY 供 Aside 子组件登记，登记后容器自动切为垂直布局
 */
export function useLhLayout(props: LhLayoutProps) {
  const hasAside = ref(false)

  provide(LH_LAYOUT_KEY, {
    registerAside: () => {
      hasAside.value = true
    },
    unregisterAside: () => {
      hasAside.value = false
    },
  } satisfies LhLayoutContext)

  const layoutClasses = computed(() => {
    const vertical = props.direction === 'vertical' || hasAside.value
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
