import { computed, inject, onBeforeUnmount, provide, ref } from 'vue'
import {
  getBreadcrumbItemClassNames,
  getCollapsedHiddenIndexes,
  getEllipsisBeforeIndex,
} from '@lh-ui/share/core/breadcrumb'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { generateId } from '@lh-ui/share/utils'
import { LH_BREADCRUMB_KEY } from './types'
import type { LhBreadcrumbItemProps, LhBreadcrumbProps } from './types'

/**
 * Breadcrumb 组件 Composable（纯逻辑在 @lh-ui/share/core/breadcrumb；文案走 locale 适配层）
 */
export function useLhBreadcrumb(props: LhBreadcrumbProps) {
  // 子项 setup 阶段注册 uid（首帧顺序即渲染顺序）；父级 onUpdated 按 DOM 位序重排——
  // 中段 v-if 的 item 卸载重挂曾被 push 到数组尾，序号/折叠判定与 DOM 顺序脱钩
  const itemTokens = ref<string[]>([])
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

  return { rootStyle, itemTokens }
}

/**
 * BreadcrumbItem 组件 Composable
 */
export function useLhBreadcrumbItem(props: LhBreadcrumbItemProps) {
  const context = inject(LH_BREADCRUMB_KEY, null)

  // setup 阶段注册 uid（首帧顺序即渲染顺序）；uid 同步落到 DOM（data-lh-bc-item），
  // 供父级 onUpdated 按 DOM 位序重排；卸载时注销
  const uid = generateId('lh-bc-item')
  if (context) {
    context.itemTokens.value.push(uid)
    onBeforeUnmount(() => {
      context.itemTokens.value = context.itemTokens.value.filter((item) => item !== uid)
    })
  }

  const ownIndex = computed(() => (context ? context.itemTokens.value.indexOf(uid) : -1))
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
    uid,
    isLast,
    isHidden,
    showEllipsisBefore,
    isLink,
    itemClasses,
    separatorText,
    expand: () => context?.expand(),
  }
}
