import { computed, inject, onBeforeUnmount, provide, ref } from 'vue'
import {
  getBreadcrumbItemClassNames,
  getCollapsedHiddenIndexes,
  getEllipsisBeforeIndex,
} from '@lh-ui/share/core/breadcrumb'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_BREADCRUMB_KEY } from './types'
import type { LhBreadcrumbItemProps, LhBreadcrumbProps } from './types'

/**
 * Breadcrumb 组件 Composable（纯逻辑在 @lh-ui/share/core/breadcrumb；文案走 locale 适配层）
 */
export function useLhBreadcrumb(props: LhBreadcrumbProps) {
  // 子项在各自 setup 阶段注册 token，顺序即渲染顺序；
  // 序号/总数在注册完成的同一微任务批次内收敛，不会产生可见闪烁
  const itemTokens = ref<symbol[]>([])
  const expanded = ref(false)

  const effectiveMax = computed(() => (expanded.value ? 0 : props.maxItems ?? 0))
  // 折叠态派生自 token 总数（ref 数组 length 响应式）与 maxItems
  const hiddenIndexes = computed(() =>
    getCollapsedHiddenIndexes({ total: itemTokens.value.length, maxItems: effectiveMax.value }),
  )
  const ellipsisBeforeIndex = computed(() =>
    getEllipsisBeforeIndex({ total: itemTokens.value.length, maxItems: effectiveMax.value }),
  )

  provide(LH_BREADCRUMB_KEY, {
    itemTokens,
    hiddenIndexes,
    ellipsisBeforeIndex,
    expand: () => {
      expanded.value = true
    },
    separator: computed(() => props.separator ?? '/'),
  })

  const rootStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { rootStyle }
}

/**
 * BreadcrumbItem 组件 Composable
 */
export function useLhBreadcrumbItem(props: LhBreadcrumbItemProps) {
  const context = inject(LH_BREADCRUMB_KEY, null)

  // setup 阶段注册 token，顺序即渲染顺序；卸载时注销
  const token = Symbol('breadcrumb-item')
  if (context) {
    context.itemTokens.value.push(token)
    onBeforeUnmount(() => {
      context.itemTokens.value = context.itemTokens.value.filter((item) => item !== token)
    })
  }

  const ownIndex = computed(() => (context ? context.itemTokens.value.indexOf(token) : -1))
  const total = computed(() => (context ? context.itemTokens.value.length : 1))
  const isLast = computed(() => ownIndex.value === total.value - 1)
  const isHidden = computed(() =>
    context ? context.hiddenIndexes.value.includes(ownIndex.value) : false,
  )
  const showEllipsisBefore = computed(() =>
    context ? context.ellipsisBeforeIndex.value === ownIndex.value : false,
  )
  const isLink = computed(() => !!props.to && !isLast.value)

  const itemClasses = computed(() =>
    getBreadcrumbItemClassNames({ isLast: isLast.value, isLink: isLink.value }),
  )

  const separatorText = computed(() => (context ? context.separator.value : '/'))

  return {
    ownIndex,
    isLast,
    isHidden,
    showEllipsisBefore,
    isLink,
    itemClasses,
    separatorText,
    expand: () => context?.expand(),
  }
}
