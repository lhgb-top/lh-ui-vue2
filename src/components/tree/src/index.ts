import { computed, ref, watch } from 'vue'
import {
  findTreeNode,
  flattenTree,
  getNodeCheckState,
  getTreeClassNames,
  getTreeNodeClassNames,
  isNodeLoadable,
  mergeLoadedChildren,
  moveTreeFocus,
  toggleCheckKeys,
} from '@lh-ui/share/core/tree'
import type { LhFlatTreeNode, LhTreeNode } from '@lh-ui/share/core/tree'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { LH_KEYS } from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
import type { LhTreeProps } from './types'

export interface LhTreeEmits {
  (e: 'update:expandedKeys', keys: string[]): void
  (e: 'update:selectedKeys', keys: string[]): void
  (e: 'update:checkedKeys', keys: string[]): void
  (e: 'select', key: string, node: LhTreeNode): void
  (e: 'check', keys: string[], node: LhTreeNode): void
  (e: 'expand', key: string, expanded: boolean): void
  (e: 'nodeLoad', node: LhTreeNode, children: LhTreeNode[]): void
}

/** 带勾选态的扁平节点（模板渲染用） */
export interface LhTreeFlatItem extends LhFlatTreeNode {
  checkState: 'checked' | 'indeterminate' | 'unchecked'
}

/**
 * Tree 组件 Composable（纯逻辑在 @lh-ui/share/core/tree）
 *
 * Vue2 适配要点：
 * - 双绑一律 .sync（update:xxx 事件约定，无 v-model:xxx）
 * - 懒加载缓存用 ref 对象整体替换（红线 #1：动态加属性不响应）
 */
export function useLhTree(props: LhTreeProps, emit: LhTreeEmits) {
  /** 展开态（受控 / 内部双模） */
  const innerExpanded = ref<string[]>([...(props.defaultExpandedKeys ?? [])])
  const expanded = computed(() => props.expandedKeys ?? innerExpanded.value)

  /** 选中态 */
  const innerSelected = ref<string[]>([...(props.defaultSelectedKeys ?? [])])
  const selected = computed(() => props.selectedKeys ?? innerSelected.value)

  /** 勾选态 */
  const innerChecked = ref<string[]>([...(props.defaultCheckedKeys ?? [])])
  const checked = computed(() => props.checkedKeys ?? innerChecked.value)

  // ---------- 懒加载 ----------

  const loadedMap = ref<Record<string, LhTreeNode[]>>({})
  const loadingKeys = ref<string[]>([])

  const mergedData = computed(() => mergeLoadedChildren(props.data, loadedMap.value))

  const flatNodes = computed<LhTreeFlatItem[]>(() =>
    flattenTree(mergedData.value, expanded.value).map((item) => ({
      ...item,
      checkState: getNodeCheckState(item.node, checked.value, props.checkStrictly),
    })),
  )

  function requestLoad(node: LhTreeNode): void {
    if (!props.load || loadingKeys.value.includes(node.key)) return
    loadingKeys.value = [...loadingKeys.value, node.key]
    const settle = (): void => {
      loadingKeys.value = loadingKeys.value.filter((k) => k !== node.key)
    }
    const resolve = (children: LhTreeNode[]): void => {
      settle()
      // 红线 #1：整对象替换而非动态加属性
      loadedMap.value = { ...loadedMap.value, [node.key]: children }
      if (!expanded.value.includes(node.key)) toggleExpand(node.key)
      emit('nodeLoad', node, children)
    }
    const reject = (): void => settle()
    try {
      props.load(node, resolve, reject)
    } catch {
      settle()
    }
  }

  // ---------- 交互 ----------

  function toggleExpand(key: string): void {
    if (props.disabled) return
    const target = findTreeNode(mergedData.value, key)
    if (target && isNodeLoadable(target, !!props.lazy, Object.keys(loadedMap.value))) {
      requestLoad(target)
      return
    }
    const next = expanded.value.includes(key)
      ? expanded.value.filter((k) => k !== key)
      : [...expanded.value, key]
    innerExpanded.value = next
    emit('update:expandedKeys', next)
    emit('expand', key, next.includes(key))
  }

  function toggleSelect(key: string, node: LhTreeNode): void {
    if (props.disabled || node.disabled) return
    const next = props.multiple
      ? selected.value.includes(key)
        ? selected.value.filter((k) => k !== key)
        : [...selected.value, key]
      : [key]
    innerSelected.value = next
    emit('update:selectedKeys', next)
    emit('select', key, node)
  }

  function toggleCheck(key: string): void {
    if (props.disabled) return
    const next = toggleCheckKeys(mergedData.value, checked.value, key, {
      checkStrictly: props.checkStrictly,
    })
    innerChecked.value = next
    emit('update:checkedKeys', next)
    const node = flatNodes.value.find((n) => n.key === key)?.node
    if (node) emit('check', next, node)
  }

  function handleNodeClick(item: LhTreeFlatItem): void {
    if (props.disabled || item.node.disabled) return
    focusedKey.value = item.key
    if (!item.isLeaf && props.expandOnClickNode !== false) toggleExpand(item.key)
    toggleSelect(item.key, item.node)
  }

  const focusedKey = ref<string | null>(null)
  const tabbableKey = computed(() => {
    if (focusedKey.value && flatNodes.value.some((n) => n.key === focusedKey.value && !n.node.disabled)) {
      return focusedKey.value
    }
    const first = flatNodes.value.find((n) => !n.node.disabled)
    return first?.key ?? null
  })

  // 键盘焦点查询的作用域根：keydown 绑在根元素上，按红线 #8 在事件派发内
  // 同步捕获 currentTarget（派发结束后被置空，不能跨 nextTick 使用）
  const keydownRootEl = ref<HTMLElement | null>(null)

  function handleKeydown(event: KeyboardEvent): void {
    if (props.disabled) return
    keydownRootEl.value = event.currentTarget as HTMLElement
    const visible = flatNodes.value
    const current = focusedKey.value ?? tabbableKey.value

    const actions: Record<string, () => void> = {
      [LH_KEYS.ArrowDown]: () => focusNode(moveTreeFocus(visible, current, 1)),
      [LH_KEYS.ArrowUp]: () => focusNode(moveTreeFocus(visible, current, -1)),
      [LH_KEYS.Home]: () => focusNode(visible.find((n) => !n.node.disabled)?.key ?? null),
      [LH_KEYS.End]: () => focusNode([...visible].reverse().find((n) => !n.node.disabled)?.key ?? null),
      [LH_KEYS.ArrowRight]: () => {
        const item = visible.find((n) => n.key === current)
        if (!item) return
        if (!item.isLeaf && !expanded.value.includes(item.key)) toggleExpand(item.key)
        else if (!item.isLeaf) focusNode(moveTreeFocus(visible, current, 1))
      },
      [LH_KEYS.ArrowLeft]: () => {
        const item = visible.find((n) => n.key === current)
        if (!item) return
        if (!item.isLeaf && expanded.value.includes(item.key)) toggleExpand(item.key)
        else if (item.parentKey) focusNode(item.parentKey)
      },
      [LH_KEYS.Enter]: () => {
        const item = visible.find((n) => n.key === current)
        if (item) handleNodeClick(item)
      },
      [LH_KEYS.Space]: () => {
        const item = visible.find((n) => n.key === current)
        if (!item) return
        if (props.showCheckbox) toggleCheck(item.key)
        else handleNodeClick(item)
      },
    }

    const action = actions[event.key]
    if (!action) return
    event.preventDefault()
    action()
  }

  function focusNode(key: string | null): void {
    if (!key) return
    focusedKey.value = key
    // 查询限定在组件根内（红线 #8：event.currentTarget 必须同步捕获）：
    // document 级 querySelector 在同页多棵树（key 相同很常见）时会聚焦到别的实例
    const root = keydownRootEl.value
    const el = root?.querySelector<HTMLElement>(`[data-tree-key="${key}"]`)
    el?.focus()
  }

  function nodeClasses(item: LhTreeFlatItem): string[] {
    return getTreeNodeClassNames({
      expanded: expanded.value.includes(item.key),
      selected: selected.value.includes(item.key),
      disabled: !!item.node.disabled,
      leaf: item.isLeaf,
    })
  }

  // 数据变化时清掉已不存在的焦点键与懒加载缓存
  watch(
    () => props.data,
    () => {
      if (focusedKey.value && !flatNodes.value.some((n) => n.key === focusedKey.value)) {
        focusedKey.value = null
      }
      loadedMap.value = {}
      loadingKeys.value = []
    },
  )

  const treeClasses = computed(() => getTreeClassNames({ showCheckbox: !!props.showCheckbox }))
  const treeStyle = computed(() => sxToStyle(props.sx ?? {}))
  const emptyText = computed(() => t('tree.empty', '暂无数据'))

  return {
    flatNodes,
    expanded,
    selected,
    focusedKey,
    tabbableKey,
    loadingKeys,
    treeClasses,
    treeStyle,
    emptyText,
    toggleExpand,
    toggleCheck,
    handleNodeClick,
    handleKeydown,
    nodeClasses,
  }
}
