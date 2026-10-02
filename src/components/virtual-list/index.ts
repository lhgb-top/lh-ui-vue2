import LhVirtualListSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhVirtualList } from './src/index'
export type { LhVirtualListProps } from './src/types'

const LhVirtualList = withInstall('LhVirtualList', LhVirtualListSfc)

export default LhVirtualList
export { LhVirtualList }
