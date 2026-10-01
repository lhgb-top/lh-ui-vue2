import { computed, nextTick, onUpdated, provide, ref, useSlots } from 'vue'
import type { VNode } from 'vue'
import {
  getTabsClassNames,
  getNameAfterRemove,
  getNextActiveName,
  resolveActiveName,
} from '@lh-ui/share/core/tabs'
import type { LhTabRecord } from '@lh-ui/share/core/tabs'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { generateId } from '@lh-ui/share/utils'
import { LH_TABS_KEY } from './types'
import type { LhTabsProps } from './types'

export interface LhTabsEmits {
  /** v-model：modelValue prop / input 事件 */
  (e: 'input', name: string): void
  (e: 'tab-change', name: string): void
  (e: 'tab-remove', name: string): void
  (e: 'tab-add'): void
}

/** 2.7 插槽 vnode 读 componentOptions（无 Vue3 的 .type/.props） */
function isTabPaneVnode(vnode: VNode): boolean {
  const ctor = vnode.componentOptions?.Ctor as { options?: { name?: string } } | undefined
  return ctor?.options?.name === 'LhTabPane'
}

/** 从默认插槽同步收集页签 vnode（下钻 v-for / template 展开的嵌套数组） */
function collectPaneVnodes(vnodes: VNode[] | undefined): VNode[] {
  const out: VNode[] = []
  for (const vnode of vnodes ?? []) {
    if (Array.isArray(vnode)) {
      out.push(...collectPaneVnodes(vnode as unknown as VNode[]))
    } else if (isTabPaneVnode(vnode)) {
      out.push(vnode)
    } else if (Array.isArray(vnode.children)) {
      out.push(...collectPaneVnodes(vnode.children as VNode[]))
    }
  }
  return out
}

/**
 * Tabs 组件 Composable（纯逻辑在 @lh-ui/share/core/tabs；文案走 locale 适配层）
 */
export function useLhTabs(props: LhTabsProps, emit: LhTabsEmits) {
  const slots = useSlots()

  // 页签记录同步源自插槽 vnode propsData，首帧即正确
  function computeRecords(): LhTabRecord[] {
    return collectPaneVnodes(slots.default?.() as VNode[] | undefined).map((vnode) => {
      const paneProps = (vnode.componentOptions?.propsData ?? {}) as Record<string, unknown>
      return {
        name: String(paneProps.name ?? ''),
        label: String(paneProps.label ?? ''),
        disabled: paneProps.disabled === true || paneProps.disabled === '',
      }
    })
  }

  // Vue2 插槽 vnode 非响应式：updated 时按签名比对，仅在实际变化时落值
  // （无条件 bump 会「updated → 重渲染 → updated」死循环，组件测试曾因此挂起）
  const recordsSig = (rs: LhTabRecord[]) =>
    rs.map((r) => `${r.name} ${r.label} ${r.disabled ? 1 : 0}`).join('|')
  const records = ref<LhTabRecord[]>(computeRecords())
  const lastSig = ref(recordsSig(records.value))
  onUpdated(() => {
    const next = computeRecords()
    const sig = recordsSig(next)
    if (sig !== lastSig.value) {
      lastSig.value = sig
      records.value = next
    }
  })

  const innerActive = ref<string | null>(null)
  const idPrefix = generateId('lh-tabs')

  const activeName = computed(() =>
    resolveActiveName(records.value, props.modelValue ?? innerActive.value),
  )

  function setActive(name: string) {
    const pane = records.value.find((record) => record.name === name)
    if (!pane || pane.disabled) return
    innerActive.value = name
    emit('input', name)
    emit('tab-change', name)
  }

  function removePane(name: string) {
    if (!props.closable) return
    emit('tab-remove', name)
    // 被关闭的是激活页签时，联动切换到相邻可用页签
    if (name === activeName.value) {
      const next = getNameAfterRemove(records.value, name, activeName.value ?? '')
      if (next) setActive(next)
    }
  }

  // —— roving tabindex 键盘导航（APG tabs pattern：方向键移动并激活）——
  // 2.7 模板不支持函数 ref：改为按 data-name 查询 DOM 聚焦
  function focusTab(name: string, header: HTMLElement | null) {
    const btn = Array.from(header?.querySelectorAll<HTMLElement>('button[data-name]') ?? []).find(
      (el) => el.dataset.name === name,
    )
    btn?.focus()
  }

  function onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null
    const currentName = target?.dataset?.name
    if (!currentName) return

    if (event.key === 'Delete') {
      if (props.closable) removePane(currentName)
      return
    }

    let direction: 'next' | 'prev' | 'first' | 'last' | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') direction = 'next'
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') direction = 'prev'
    else if (event.key === 'Home') direction = 'first'
    else if (event.key === 'End') direction = 'last'
    if (!direction) return

    event.preventDefault()
    const next = getNextActiveName(records.value, currentName, direction)
    if (!next) return
    setActive(next)
    // currentTarget 在事件派发结束后即被重置，需同步捕获后再进 nextTick
    const header = event.currentTarget as HTMLElement | null
    nextTick(() => focusTab(next, header))
  }

  provide(LH_TABS_KEY, {
    activeName,
    setActive,
    removePane,
    closable: computed(() => !!props.closable),
    idPrefix,
  })

  const rootClasses = computed(() =>
    getTabsClassNames({ type: props.type ?? 'line', position: props.tabPosition ?? 'top' }),
  )
  const rootStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { records, activeName, idPrefix, setActive, removePane, onKeydown, rootClasses, rootStyle }
}
