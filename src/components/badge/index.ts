import LhBadgeSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhBadge } from './src/index'
export type { LhBadgeProps, LhBadgeSize, LhBadgeOffset } from './src/types'

const LhBadge = withInstall('LhBadge', LhBadgeSfc)

export default LhBadge
