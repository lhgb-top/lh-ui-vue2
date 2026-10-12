import type {
  LhCascaderItemConfig,
  LhCascaderNode,
} from '@lh-ui/share/core/cascader'
import type { LhComponentSize } from '@lh-ui/share/core/shared/types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhCascaderProps {
  /** 当前选中路径（v-model；emitPath=false 时只给末级值） */
  value?: (string | number)[]
  /** 可选项数据 */
  options?: LhCascaderNode[]
  /** 尺寸 */
  size?: LhComponentSize
  /** 禁用 */
  disabled?: boolean
  /** 可清空 */
  clearable?: boolean
  /** 占位文本 */
  placeholder?: string
  /** 只读 */
  readonly?: boolean
  /** 展示完整路径（默认）或仅末级 */
  showAllLevels?: boolean
  /** 父子节点不关联（可选任意层级） */
  checkStrictly?: boolean
  /** emit 完整路径（默认）或仅末级值 */
  emitPath?: boolean
  /** 多选 */
  multiple?: boolean
  /** 悬停即展开下级（默认） */
  cascading?: boolean
  /** 路径分隔符 */
  separator?: string
  /** 折叠标签（多选只显示一个 + 计数） */
  collapseTags?: boolean
  /** 可搜索 */
  filterable?: boolean
  /** 自定义字段映射 */
  itemConfig?: LhCascaderItemConfig
  /** 弹出层挂载目标（Vue2 无 Teleport；默认 body） */
  teleportTarget?: string | HTMLElement
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhCascaderNode, LhCascaderItemConfig }
