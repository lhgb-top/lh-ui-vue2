import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhVirtualListProps {
  /** 数据源（项渲染由 default 插槽负责） */
  data: any[]
  /** 容器高度（数字为 px） */
  height: number | string
  /** 定高模式的项高（与 itemSize 二选一；提供了 itemSize 时走动态高度） */
  itemHeight?: number
  /** 动态高度模式：由调用方返回每项高度 */
  itemSize?: (index: number) => number
  /** 过扫描项数 */
  overscan?: number
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
