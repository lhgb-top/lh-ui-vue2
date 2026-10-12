import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhTableColumn, LhTableRow, LhTableSortOrder } from '@lh-ui/share/core/table'

export interface LhTableProps {
  /** 行数据 */
  data: LhTableRow[]
  /** 列配置 */
  columns: LhTableColumn[]
  /** 表体高度（设置后启用虚拟滚动；数字为 px） */
  height?: number | string
  /** 非虚拟模式下的最大高度 */
  maxHeight?: number | string
  /** 虚拟滚动行高（需与实际行高一致） */
  rowHeight?: number
  /** 斑马纹 */
  stripe?: boolean
  /** 单元格边框 */
  border?: boolean
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 行键字段名 */
  rowKey?: string
  /** 默认排序列 */
  defaultSortProp?: string
  /** 默认排序方向 */
  defaultSortOrder?: LhTableSortOrder
  /** 自定义排序函数 */
  sorter?: (a: LhTableRow, b: LhTableRow) => number
  /** 开启列宽拖拽（仍需列级 resizable 配合，且列须为数字 width） */
  resizable?: boolean
  /** 默认筛选状态（非受控，键为列 prop） */
  defaultFilteredValues?: Record<string, (string | number)[]>
  /** 受控筛选状态（:filtered-values.sync） */
  filteredValues?: Record<string, (string | number)[]>
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhTableColumn, LhTableRow, LhTableSortOrder } from '@lh-ui/share/core/table'
