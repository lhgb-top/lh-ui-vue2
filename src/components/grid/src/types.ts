import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhBreakpointSizes, LhColSize } from '@lh-ui/share/core/grid'

/** 子元素主轴上排列 */
export type LhRowJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around'

/** 子元素交叉轴上对齐 */
export type LhRowAlign = 'top' | 'middle' | 'bottom'

export interface LhRowProps {
  /** 主轴上排列 */
  justify?: LhRowJustify
  /** 交叉轴上对齐 */
  align?: LhRowAlign
  /** 列间距（px 或 [横向, 纵向]） */
  gutter?: number | [number, number]
  /** 是否换行 */
  wrap?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhColProps {
  /** 占据列数（24 栅格制） */
  span?: number
  /** 左侧偏移列数 */
  offset?: number
  /** 向右平移列数 */
  push?: number
  /** 向左平移列数 */
  pull?: number
  /** <640px 生效（未声明时向下回退到更小档） */
  xs?: LhColSize
  /** ≥640px 生效 */
  sm?: LhColSize
  /** ≥768px 生效 */
  md?: LhColSize
  /** ≥1024px 生效 */
  lg?: LhColSize
  /** ≥1280px 生效 */
  xl?: LhColSize
  /** 按断点批量声明的响应式尺寸（与 xs~xl 等价，任选其一） */
  sizes?: LhBreakpointSizes
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
