import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

export interface LhTreeProps {
  /** 树数据 */
  data: LhTreeNode[]
  /** 显示勾选框 */
  showCheckbox?: boolean
  /** 多选（点击节点切换选中而非替换） */
  multiple?: boolean
  /** 点击非叶子节点时展开/收起 */
  expandOnClickNode?: boolean
  /** 默认展开的键（非受控） */
  defaultExpandedKeys?: string[]
  /** 受控展开的键（:expanded-keys.sync） */
  expandedKeys?: string[]
  /** 默认选中的键（非受控） */
  defaultSelectedKeys?: string[]
  /** 受控选中的键（:selected-keys.sync） */
  selectedKeys?: string[]
  /** 默认勾选的键（非受控） */
  defaultCheckedKeys?: string[]
  /** 受控勾选的键（:checked-keys.sync） */
  checkedKeys?: string[]
  /** 父子勾选不联动（勾选只作用于节点自身，无级联与半选） */
  checkStrictly?: boolean
  /** 懒加载模式：展开未加载的非叶子节点时调用 load */
  lazy?: boolean
  /** 懒加载回调：resolve 提交子节点并展开，reject（或抛错）取消 */
  load?: (
    node: LhTreeNode,
    resolve: (children: LhTreeNode[]) => void,
    reject: (reason?: unknown) => void,
  ) => void
  /** 整体禁用 */
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhTreeNode, LhTreeCheckState, LhFlatTreeNode } from '@lh-ui/share/core/tree'
