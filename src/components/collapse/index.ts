import LhCollapseSfc from './src/index.vue'
import LhCollapseItemSfc from './src/item.vue'
import { withInstall } from '../../install'

export { useLhCollapse } from './src/index'
export type { LhCollapseProps, LhCollapseItemProps, LhCollapseContext } from './src/types'
export type { LhCollapseKey } from '@lh-ui/share/core/collapse'

const LhCollapse = withInstall('LhCollapse', LhCollapseSfc)
const LhCollapseItem = withInstall('LhCollapseItem', LhCollapseItemSfc)

export default LhCollapse
export { LhCollapseItem }
