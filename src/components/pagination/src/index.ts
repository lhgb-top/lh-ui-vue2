import { computed, ref, watch } from 'vue'
import {
  clampPage,
  formatMessage,
  getPaginationRange,
  getPageCount,
} from '@lh-ui/share/core/pagination'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { t } from '../../../locale'
import { generateId } from '@lh-ui/share/utils'
import type { LhPaginationProps } from './types'

export interface LhPaginationEmits {
  /** 双向绑定走 .sync 语义（Vue2 无双 v-model，事件名保持 update:current） */
  (e: 'update:current', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'change', page: number): void
  (e: 'size-change', size: number): void
}

/**
 * Pagination 组件 Composable（纯逻辑在 @lh-ui/share/core/pagination；文案走 locale 适配层）
 */
export function useLhPagination(props: LhPaginationProps, emit: LhPaginationEmits) {
  // 受控/非受控双模式：传入 current/pageSize 即受控同步，内部值驱动渲染
  const innerCurrent = ref(
    clampPage(props.current ?? 1, getPageCount(props.total, props.pageSize ?? 10)),
  )
  const innerPageSize = ref(props.pageSize ?? 10)

  const pageCount = computed(() => getPageCount(props.total, innerPageSize.value))

  watch(
    () => props.current,
    (val) => {
      if (val !== undefined) innerCurrent.value = clampPage(val, pageCount.value)
    },
  )
  watch(
    () => props.pageSize,
    (val) => {
      if (val !== undefined) innerPageSize.value = val
    },
  )
  watch(pageCount, (count) => {
    if (innerCurrent.value > count) go(count)
  })

  const range = computed(() =>
    getPaginationRange({ current: innerCurrent.value, pageCount: pageCount.value }),
  )

  function go(page: number) {
    const target = clampPage(page, pageCount.value)
    if (props.disabled || target === innerCurrent.value) return
    innerCurrent.value = target
    emit('update:current', target)
    emit('change', target)
  }

  function handleSizeChange() {
    emit('update:pageSize', innerPageSize.value)
    emit('size-change', innerPageSize.value)
    // 条数变化后当前页可能越界，钳制并通知
    const target = clampPage(innerCurrent.value, pageCount.value)
    if (target !== innerCurrent.value) go(target)
  }

  const jumpPage = ref<number | null>(null)
  const jumperId = generateId('lh-pagination-jumper')

  function handleJump() {
    if (jumpPage.value === null || Number.isNaN(jumpPage.value)) return
    go(jumpPage.value)
    jumpPage.value = null
  }

  const totalText = computed(() =>
    formatMessage(t('pagination.total', '共 {total} 条'), { total: props.total }),
  )
  const prevLabel = computed(() => t('pagination.prev', '上一页'))
  const nextLabel = computed(() => t('pagination.next', '下一页'))
  const gotoLabel = computed(() => t('pagination.goto', '前往'))
  const pageSuffixText = computed(() => t('pagination.pageSuffix', '页'))
  const sizeChangerLabel = computed(() => t('pagination.sizeChangerLabel', '每页条数'))

  function pageLabel(page: number) {
    return formatMessage(t('pagination.page', '第 {page} 页'), { page })
  }

  function sizeText(size: number) {
    return formatMessage(t('pagination.sizeChanger', '{size} 条/页'), { size })
  }

  const rootStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    innerCurrent,
    innerPageSize,
    pageCount,
    range,
    go,
    handleSizeChange,
    jumpPage,
    jumperId,
    handleJump,
    totalText,
    prevLabel,
    nextLabel,
    gotoLabel,
    pageSuffixText,
    sizeChangerLabel,
    pageLabel,
    sizeText,
    rootStyle,
  }
}
