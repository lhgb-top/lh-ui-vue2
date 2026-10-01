import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhPaginationProps {
  /** 数据总数（必填） */
  total: number
  /** 每页条数 */
  pageSize?: number
  /** 当前页（:current.sync，事件名 update:current） */
  current?: number
  /** 每页条数选项 */
  pageSizes?: number[]
  /** 是否显示总条数 */
  showTotal?: boolean
  /** 是否显示每页条数切换 */
  showSizeChanger?: boolean
  /** 是否显示跳页输入 */
  showJumper?: boolean
  /** 紧凑模式 */
  simple?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}
