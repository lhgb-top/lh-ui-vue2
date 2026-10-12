import type { LhSkeletonVariant } from '@lh-ui/share/core/skeleton'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhSkeletonProps {
  /** 是否处于加载态（false 时渲染 default 插槽的真实内容） */
  loading?: boolean
  /** 文本行数 */
  rows?: number
  /** 是否包含圆形头像占位 */
  avatar?: boolean
  /** 是否开启动画 */
  animated?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhSkeletonItemProps {
  /** 占位块形状 */
  variant?: LhSkeletonVariant
  /** 是否开启动画 */
  animated?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
