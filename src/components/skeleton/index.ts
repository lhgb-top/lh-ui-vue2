import LhSkeletonSfc from './src/index.vue'
import LhSkeletonItemSfc from './src/item.vue'
import { withInstall } from '../../install'

export { useLhSkeleton, useLhSkeletonItem } from './src/index'
export type { LhSkeletonProps, LhSkeletonItemProps } from './src/types'

const LhSkeleton = withInstall('LhSkeleton', LhSkeletonSfc)
const LhSkeletonItem = withInstall('LhSkeletonItem', LhSkeletonItemSfc)

export default LhSkeleton
export { LhSkeletonItem }
